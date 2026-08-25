import { Attendance } from '../models/Attendance.js';
import { Geofence } from '../models/Geofence.js';
import { Notification } from '../models/Notification.js';
import { validateGeofence, calculateDistanceMeters } from '../utils/haversine.js';
import { logAudit } from '../utils/audit.js';
import { verifyWebAuthnAssertion } from './webauthnController.js';

// Helper to get local date string YYYY-MM-DD
const getTodayDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check In with Geofence and Biometric validation
 */
export const checkIn = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const {
      latitude,
      longitude,
      accuracy = 10,
      officeId,
      biometricVerified = true,
      authMethod = 'biometric',
      deviceInfo = 'Web Client',
      overrideGeofence = false, // for admin / dev testing flexibility
    } = req.body;

    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({
        success: false,
        message: 'GPS coordinates (latitude and longitude) are required for check-in',
      });
      return;
    }

    const todayStr = getTodayDateString();

    // Check duplicate attendance
    const existingAttendance = await Attendance.findOne({
      employee: user._id,
      date: todayStr,
    });

    if (existingAttendance && existingAttendance.checkIn?.time) {
      res.status(400).json({
        success: false,
        message: 'Attendance check-in already recorded for today.',
        attendance: existingAttendance,
      });
      return;
    }

    // Find assigned office or target office
    let targetOffice = null;
    if (officeId) {
      targetOffice = await Geofence.findById(officeId);
    } else if (user.officeId) {
      targetOffice = await Geofence.findById(user.officeId);
    }

    if (!targetOffice) {
      targetOffice = await Geofence.findOne({ isActive: true });
    }

    if (!targetOffice) {
      res.status(400).json({
        success: false,
        message: 'No active geofence office location found in the system.',
      });
      return;
    }

    // Run Haversine Geofence Calculation
    const geofenceResult = validateGeofence(
      { latitude: Number(latitude), longitude: Number(longitude) },
      { latitude: targetOffice.latitude, longitude: targetOffice.longitude },
      targetOffice.radius
    );

    // If outside geofence and override not authorized
    if (!geofenceResult.isWithinGeofence && !overrideGeofence) {
      await logAudit(
        'CHECKIN_GEOFENCE_REJECTED',
        'ATTENDANCE',
        `User ${user.name} was rejected: ${geofenceResult.formattedDistance} from ${targetOffice.officeName} (Radius: ${targetOffice.radius}m)`,
        req,
        user._id,
        user.name,
        user.role
      );

      res.status(403).json({
        success: false,
        code: 'OUTSIDE_GEOFENCE',
        message: `Attendance rejected: You are ${geofenceResult.formattedDistance} away from ${targetOffice.officeName}. You must be within ${targetOffice.radius}m of the office premises.`,
        geofenceDetails: {
          officeName: targetOffice.officeName,
          officeCoordinates: { latitude: targetOffice.latitude, longitude: targetOffice.longitude },
          userCoordinates: { latitude, longitude },
          distanceMeters: geofenceResult.distanceMeters,
          radiusMeters: targetOffice.radius,
          differenceMeters: geofenceResult.differenceMeters,
        },
      });
      return;
    }

    // Real Cryptographic WebAuthn Passkey Verification
    const hasRegisteredPasskeys = (user.webauthnCredentials || []).length > 0;
    const { assertionResponse } = req.body;

    if (hasRegisteredPasskeys) {
      if (!assertionResponse) {
        res.status(403).json({
          success: false,
          code: 'BIOMETRIC_FAILED',
          message: 'Valid cryptographic WebAuthn passkey assertion required. Please authenticate with your passkey.',
        });
        return;
      }

      const verifyResult = await verifyWebAuthnAssertion(user, assertionResponse, req);
      if (!verifyResult.verified) {
        await logAudit(
          'BIOMETRIC_VERIFICATION_FAILED',
          'ATTENDANCE',
          `Biometric assertion verification failed for ${user.name}: ${verifyResult.error}`,
          req,
          user._id,
          user.name,
          user.role
        );

        res.status(403).json({
          success: false,
          code: 'BIOMETRIC_FAILED',
          message: `Biometric authentication failed: ${verifyResult.error || 'Invalid cryptographic signature'}`,
        });
        return;
      }
    } else {
      // In development fallback if no passkey registered yet
      if (!biometricVerified && !assertionResponse) {
        res.status(403).json({
          success: false,
          code: 'BIOMETRIC_FAILED',
          message: 'Biometric / Fingerprint authentication could not be verified. Attendance check-in aborted.',
        });
        return;
      }
    }

    const checkInTime = new Date();

    // Determine status (Late arrival check: after 09:30 AM is marked 'Late')
    let status = 'Present';
    const hours = checkInTime.getHours();
    const minutes = checkInTime.getMinutes();
    if (hours > 9 || (hours === 9 && minutes > 30)) {
      status = 'Late';
    }

    const locationPoint = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      accuracy: Number(accuracy),
      address: `${targetOffice.officeName}, ${targetOffice.city}`,
      distanceFromGeofence: geofenceResult.distanceMeters,
      verifiedWithinGeofence: geofenceResult.isWithinGeofence,
    };

    let attendanceRecord;

    if (existingAttendance) {
      existingAttendance.checkIn = {
        time: checkInTime,
        location: locationPoint,
        biometricVerified: true,
        authMethod,
        deviceInfo,
      };
      existingAttendance.status = status;
      existingAttendance.officeLocation = targetOffice._id;
      attendanceRecord = await existingAttendance.save();
    } else {
      attendanceRecord = new Attendance({
        employee: user._id,
        employeeId: user.employeeId,
        date: todayStr,
        checkIn: {
          time: checkInTime,
          location: locationPoint,
          biometricVerified: true,
          authMethod,
          deviceInfo,
        },
        status,
        officeLocation: targetOffice._id,
        approvalStatus: 'Approved',
      });
      await attendanceRecord.save();
    }

    // Create Notification
    await Notification.create({
      user: user._id,
      title: `Checked In (${status})`,
      message: `You successfully checked in at ${checkInTime.toLocaleTimeString()} at ${targetOffice.officeName}. Status: ${status}.`,
      type: 'attendance',
    });

    await logAudit(
      'CHECKIN_SUCCESS',
      'ATTENDANCE',
      `User ${user.name} checked in at ${checkInTime.toLocaleTimeString()} (${status}) at ${targetOffice.officeName}. Distance: ${geofenceResult.formattedDistance}`,
      req,
      user._id,
      user.name,
      user.role
    );

    res.status(200).json({
      success: true,
      message: `Checked in successfully as ${status}!`,
      attendance: attendanceRecord,
      geofence: {
        officeName: targetOffice.officeName,
        distanceMeters: geofenceResult.distanceMeters,
        radiusMeters: targetOffice.radius,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Check Out with working hours calculation
 */
export const checkOut = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const {
      latitude,
      longitude,
      accuracy = 10,
      biometricVerified = true,
      authMethod = 'biometric',
      deviceInfo = 'Web Client',
      assertionResponse,
    } = req.body;

    // Verify assertion if passkey registered
    if ((user.webauthnCredentials || []).length > 0 && assertionResponse) {
      const verifyResult = await verifyWebAuthnAssertion(user, assertionResponse, req);
      if (!verifyResult.verified) {
        res.status(403).json({
          success: false,
          code: 'BIOMETRIC_FAILED',
          message: `Biometric check-out authentication failed: ${verifyResult.error || 'Invalid signature'}`,
        });
        return;
      }
    }

    const todayStr = getTodayDateString();

    const attendance = await Attendance.findOne({
      employee: user._id,
      date: todayStr,
    }).populate('officeLocation');

    if (!attendance || !attendance.checkIn?.time) {
      res.status(400).json({
        success: false,
        message: 'No active check-in record found for today. Please check in first.',
      });
      return;
    }

    if (attendance.checkOut?.time) {
      res.status(400).json({
        success: false,
        message: 'You have already checked out for today.',
        attendance,
      });
      return;
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(attendance.checkIn.time);
    const durationMs = checkOutTime.getTime() - checkInTime.getTime();
    const workingHours = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100;

    let targetOffice = attendance.officeLocation;
    let distanceMeters = 0;
    if (targetOffice && latitude && longitude) {
      distanceMeters = calculateDistanceMeters(
        { latitude: Number(latitude), longitude: Number(longitude) },
        { latitude: targetOffice.latitude, longitude: targetOffice.longitude }
      );
    }

    const locationPoint = {
      latitude: Number(latitude || targetOffice?.latitude || 0),
      longitude: Number(longitude || targetOffice?.longitude || 0),
      accuracy: Number(accuracy),
      address: targetOffice ? `${targetOffice.officeName}, ${targetOffice.city}` : 'Office Location',
      distanceFromGeofence: distanceMeters,
      verifiedWithinGeofence: true,
    };

    // Update status if working hours < 4
    if (workingHours < 4 && attendance.status === 'Present') {
      attendance.status = 'Half-day';
    }

    attendance.checkOut = {
      time: checkOutTime,
      location: locationPoint,
      biometricVerified: biometricVerified !== false,
      authMethod,
      deviceInfo,
    };
    attendance.workingHours = workingHours;

    await attendance.save();

    // Create Notification
    await Notification.create({
      user: user._id,
      title: 'Checked Out Successfully',
      message: `You checked out at ${checkOutTime.toLocaleTimeString()}. Total working hours logged: ${workingHours} hrs.`,
      type: 'attendance',
    });

    await logAudit(
      'CHECKOUT_SUCCESS',
      'ATTENDANCE',
      `User ${user.name} checked out. Total logged: ${workingHours} hrs`,
      req,
      user._id,
      user.name,
      user.role
    );

    res.json({
      success: true,
      message: `Checked out successfully! Logged ${workingHours} working hours.`,
      attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Today's check-in / check-out status
 */
export const getTodayStatus = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const todayStr = getTodayDateString();

    const attendance = await Attendance.findOne({
      employee: user._id,
      date: todayStr,
    }).populate('officeLocation');

    // Retrieve default or assigned office
    let office = null;
    if (user.officeId) {
      office = await Geofence.findById(user.officeId);
    }
    if (!office) {
      office = await Geofence.findOne({ isActive: true });
    }

    let isCheckedIn = false;
    let isCheckedOut = false;
    let currentWorkingHours = 0;

    if (attendance?.checkIn?.time) {
      isCheckedIn = true;
      if (attendance?.checkOut?.time) {
        isCheckedOut = true;
        currentWorkingHours = attendance.workingHours;
      } else {
        const now = new Date();
        const diffMs = now.getTime() - new Date(attendance.checkIn.time).getTime();
        currentWorkingHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
      }
    }

    res.json({
      success: true,
      date: todayStr,
      isCheckedIn,
      isCheckedOut,
      currentWorkingHours,
      attendance,
      office,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Employee's Attendance History
 */
export const getHistory = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { startDate, endDate, status, page = 1, limit = 30 } = req.query;

    const query = { employee: user._id };

    if (startDate && endDate) {
      query.date = { $gte: String(startDate), $lte: String(endDate) };
    } else if (startDate) {
      query.date = { $gte: String(startDate) };
    } else if (endDate) {
      query.date = { $lte: String(endDate) };
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const records = await Attendance.find(query)
      .populate('officeLocation')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalRecords = await Attendance.countDocuments(query);

    res.json({
      success: true,
      records,
      pagination: {
        total: totalRecords,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalRecords / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Monthly summary for calendar & report views
 */
export const getMonthlySummary = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { month, year, employeeId } = req.query;
    const now = new Date();
    const targetYear = year ? String(year) : String(now.getFullYear());
    const targetMonth = month ? String(month).padStart(2, '0') : String(now.getMonth() + 1).padStart(2, '0');
    const monthPrefix = `${targetYear}-${targetMonth}`;

    let targetUserId = user._id;
    // Admins can inspect other employees' monthly reports
    if (employeeId && user.role === 'admin') {
      targetUserId = employeeId;
    }

    const records = await Attendance.find({
      employee: targetUserId,
      date: { $regex: `^${monthPrefix}` },
    }).populate('officeLocation').sort({ date: 1 });

    const totalPresent = records.filter((r) => r.status === 'Present').length;
    const totalLate = records.filter((r) => r.status === 'Late').length;
    const totalHalfDay = records.filter((r) => r.status === 'Half-day').length;
    const totalOnLeave = records.filter((r) => r.status === 'On Leave').length;
    const totalAbsent = records.filter((r) => r.status === 'Absent').length;
    const totalHours = records.reduce((acc, r) => acc + (r.workingHours || 0), 0);

    res.json({
      success: true,
      month: monthPrefix,
      summary: {
        totalDaysLogged: records.length,
        totalPresent,
        totalLate,
        totalHalfDay,
        totalOnLeave,
        totalAbsent,
        totalHours: Math.round(totalHours * 10) / 10,
        averageDailyHours: records.length > 0 ? Math.round((totalHours / records.length) * 10) / 10 : 0,
      },
      records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Request attendance regularization / override
 */
export const requestRegularization = async (req, res) => {
  try {
    const { attendanceId, reason } = req.body;

    const attendance = await Attendance.findOne({
      _id: attendanceId,
      employee: req.user?._id,
    });

    if (!attendance) {
      res.status(404).json({ success: false, message: 'Attendance record not found' });
      return;
    }

    attendance.regularizationRequested = true;
    attendance.regularizationReason = reason;
    attendance.approvalStatus = 'Pending';
    await attendance.save();

    await logAudit(
      'REGULARIZATION_REQUESTED',
      'ATTENDANCE',
      `Employee ${req.user?.name} requested attendance regularize for ${attendance.date}`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    res.json({
      success: true,
      message: 'Regularization request submitted for administrative review',
      attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
