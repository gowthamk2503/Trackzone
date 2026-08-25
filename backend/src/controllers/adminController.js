import { User } from '../models/User.js';
import { Attendance } from '../models/Attendance.js';
import { Geofence } from '../models/Geofence.js';
import { Leave } from '../models/Leave.js';
import { AuditLog } from '../models/AuditLog.js';
import { logAudit } from '../utils/audit.js';

// Helper to get local date string YYYY-MM-DD
const getTodayDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get comprehensive Admin Dashboard Analytics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const todayStr = getTodayDateString();

    const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true });
    const totalOffices = await Geofence.countDocuments({ isActive: true });

    // Today's attendance records
    const todayRecords = await Attendance.find({ date: todayStr }).populate('employee', 'name email department designation profileImage employeeId');

    const presentCount = todayRecords.filter((r) => r.status === 'Present').length;
    const lateCount = todayRecords.filter((r) => r.status === 'Late').length;
    const halfDayCount = todayRecords.filter((r) => r.status === 'Half-day').length;

    // Check active leaves for today
    const leavesToday = await Leave.countDocuments({
      status: 'Approved',
      startDate: { $lte: todayStr },
      endDate: { $gte: todayStr },
    });

    const activeCheckedIn = presentCount + lateCount + halfDayCount;
    const absentCount = Math.max(0, totalEmployees - activeCheckedIn - leavesToday);
    const attendanceRate = totalEmployees > 0 ? Math.round((activeCheckedIn / totalEmployees) * 100) : 0;

    // Calculate Average Working Hours
    const recordsWithHours = todayRecords.filter((r) => r.workingHours > 0);
    const avgWorkingHours = recordsWithHours.length > 0
      ? Math.round((recordsWithHours.reduce((a, b) => a + b.workingHours, 0) / recordsWithHours.length) * 10) / 10
      : 8.2; // default benchmark if early in the day

    // Department-wise attendance breakdown
    const allUsers = await User.find({ role: 'employee', isActive: true }).select('department');
    const deptMap = {};

    allUsers.forEach((u) => {
      const dept = u.department || 'General';
      if (!deptMap[dept]) deptMap[dept] = { total: 0, present: 0 };
      deptMap[dept].total += 1;
    });

    todayRecords.forEach((r) => {
      if (r.employee && r.employee.department) {
        const dept = r.employee.department;
        if (deptMap[dept]) {
          deptMap[dept].present += 1;
        }
      }
    });

    const departmentStats = Object.keys(deptMap).map((dept) => ({
      department: dept,
      totalEmployees: deptMap[dept].total,
      presentToday: deptMap[dept].present,
      rate: Math.round((deptMap[dept].present / deptMap[dept].total) * 100),
    }));

    // Last 7 Days Attendance Trend
    const trendDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      trendDays.push(getTodayDateString(d));
    }

    const trendData = await Promise.all(
      trendDays.map(async (dateStr) => {
        const records = await Attendance.find({ date: dateStr });
        const present = records.filter((r) => r.status === 'Present').length;
        const late = records.filter((r) => r.status === 'Late').length;
        const halfDay = records.filter((r) => r.status === 'Half-day').length;
        return {
          date: dateStr.substring(5), // MM-DD
          fullDate: dateStr,
          present,
          late,
          halfDay,
          total: present + late + halfDay,
        };
      })
    );

    // Recent Live Check-in Feed
    const recentFeed = await Attendance.find({ date: todayStr })
      .populate('employee', 'name email department designation profileImage employeeId')
      .populate('officeLocation', 'officeName')
      .sort({ 'checkIn.time': -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalEmployees,
        totalOffices,
        presentCount,
        lateCount,
        halfDayCount,
        leavesToday,
        absentCount,
        attendanceRate,
        avgWorkingHours,
      },
      departmentStats,
      trendData,
      recentFeed,
      statusDistribution: [
        { name: 'Present', value: presentCount, color: '#10B981' },
        { name: 'Late Arrivals', value: lateCount, color: '#F59E0B' },
        { name: 'Half Day', value: halfDayCount, color: '#6366F1' },
        { name: 'On Leave', value: leavesToday, color: '#3B82F6' },
        { name: 'Absent', value: absentCount, color: '#EF4444' },
      ],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all employees with filtering & pagination
 */
export const getAllEmployees = async (req, res) => {
  try {
    const { search, department, role, status, officeId, page = 1, limit = 50 } = req.query;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex },
        { designation: searchRegex },
      ];
    }

    if (department && department !== 'ALL') {
      query.department = department;
    }

    if (role && role !== 'ALL') {
      query.role = role;
    }

    if (status && status !== 'ALL') {
      query.isActive = status === 'active';
    }

    if (officeId && officeId !== 'ALL') {
      query.officeId = officeId;
    }

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const employees = await User.find(query)
      .populate('officeId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      employees,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin creates new employee
 */
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password = 'Password@123',
      phone,
      department,
      designation,
      role = 'employee',
      officeId,
      shiftSchedule = '09:00 - 18:00',
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Corporate email address already registered' });
      return;
    }

    const count = await User.countDocuments();
    const employeeId = `TZ-${(1000 + count + 1).toString()}`;

    const user = new User({
      employeeId,
      name,
      email: email.toLowerCase(),
      phone,
      password,
      department,
      designation,
      role,
      officeId,
      shiftSchedule,
      isActive: true,
      biometricRegistered: true,
    });

    await user.save();

    await logAudit(
      'EMPLOYEE_CREATED_ADMIN',
      'EMPLOYEE',
      `Admin created employee: ${user.name} (${user.employeeId}, ${user.department})`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    const createdUser = await User.findById(user._id).populate('officeId');
    const userJson = createdUser?.toObject();
    if (userJson) delete userJson.password;

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee: userJson,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin updates employee profile
 */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, designation, role, officeId, shiftSchedule, isActive, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (designation) user.designation = designation;
    if (role) user.role = role;
    if (officeId !== undefined) user.officeId = officeId;
    if (shiftSchedule) user.shiftSchedule = shiftSchedule;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = password; // Pre-save hook will hash

    await user.save();

    await logAudit(
      'EMPLOYEE_UPDATED_ADMIN',
      'EMPLOYEE',
      `Admin updated employee: ${user.name} (${user.employeeId})`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    const updatedUser = await User.findById(user._id).populate('officeId');
    const userJson = updatedUser?.toObject();
    if (userJson) delete userJson.password;

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee: userJson,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin deletes employee
 */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }

    // Toggle active status
    user.isActive = !user.isActive;
    await user.save();

    await logAudit(
      'EMPLOYEE_STATUS_TOGGLED',
      'EMPLOYEE',
      `Admin toggled status for ${user.name} to ${user.isActive ? 'Active' : 'Inactive'}`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    res.json({
      success: true,
      message: `Employee status changed to ${user.isActive ? 'Active' : 'Inactive'}`,
      employee: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin retrieves all attendance records
 */
export const getAllAttendance = async (req, res) => {
  try {
    const { date, startDate, endDate, department, status, employeeId, page = 1, limit = 50 } = req.query;

    const query = {};

    if (date) {
      query.date = String(date);
    } else if (startDate && endDate) {
      query.date = { $gte: String(startDate), $lte: String(endDate) };
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (employeeId && employeeId !== 'ALL') {
      query.employee = employeeId;
    }

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const records = await Attendance.find(query)
      .populate('employee', 'name email department designation profileImage employeeId phone')
      .populate('officeLocation')
      .sort({ date: -1, 'checkIn.time': -1 })
      .skip(skip)
      .limit(limitNum);

    // Filter by department if specified
    const filteredRecords = department && department !== 'ALL'
      ? records.filter((r) => r.employee && r.employee.department === department)
      : records;

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      records: filteredRecords,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin regularizes / approves attendance
 */
export const approveAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus, status, remarks, workingHours } = req.body;

    const attendance = await Attendance.findById(id).populate('employee');
    if (!attendance) {
      res.status(404).json({ success: false, message: 'Attendance record not found' });
      return;
    }

    if (approvalStatus) attendance.approvalStatus = approvalStatus;
    if (status) attendance.status = status;
    if (remarks) attendance.remarks = remarks;
    if (workingHours !== undefined) attendance.workingHours = Number(workingHours);
    attendance.approvedBy = req.user?._id;
    attendance.regularizationRequested = false;

    await attendance.save();

    await logAudit(
      'ATTENDANCE_OVERRIDDEN',
      'ATTENDANCE',
      `Admin approved/overrode attendance for ${attendance.employeeId} on ${attendance.date} as ${attendance.status} (${attendance.approvalStatus})`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    res.json({
      success: true,
      message: 'Attendance record updated and approved successfully',
      attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin Reports & Analytics Summary
 */
export const getReports = async (req, res) => {
  try {
    const { month, year, department } = req.query;
    const now = new Date();
    const targetYear = year ? String(year) : String(now.getFullYear());
    const targetMonth = month ? String(month).padStart(2, '0') : String(now.getMonth() + 1).padStart(2, '0');
    const monthPrefix = `${targetYear}-${targetMonth}`;

    const userQuery = { role: 'employee', isActive: true };
    if (department && department !== 'ALL') {
      userQuery.department = department;
    }

    const employees = await User.find(userQuery).populate('officeId');

    const reportsData = await Promise.all(
      employees.map(async (emp) => {
        const records = await Attendance.find({
          employee: emp._id,
          date: { $regex: `^${monthPrefix}` },
        });

        const present = records.filter((r) => r.status === 'Present').length;
        const late = records.filter((r) => r.status === 'Late').length;
        const halfDay = records.filter((r) => r.status === 'Half-day').length;
        const absent = records.filter((r) => r.status === 'Absent').length;
        const totalHours = records.reduce((acc, r) => acc + (r.workingHours || 0), 0);

        const leaves = await Leave.find({
          employee: emp._id,
          status: 'Approved',
          startDate: { $regex: `^${monthPrefix}` },
        });
        const leaveDays = leaves.reduce((acc, l) => acc + l.totalDays, 0);

        const totalActiveDays = present + late + halfDay;
        const attendanceRate = totalActiveDays > 0 ? Math.round(((present + late + halfDay * 0.5) / 22) * 100) : 0;

        return {
          employeeId: emp.employeeId,
          name: emp.name,
          email: emp.email,
          department: emp.department,
          designation: emp.designation,
          office: emp.officeId?.officeName || 'HQ',
          presentDays: present,
          lateDays: late,
          halfDays: halfDay,
          absentDays: absent,
          leaveDays,
          totalHours: Math.round(totalHours * 10) / 10,
          averageHours: totalActiveDays > 0 ? Math.round((totalHours / totalActiveDays) * 10) / 10 : 0,
          attendanceRate: Math.min(100, attendanceRate),
        };
      })
    );

    res.json({
      success: true,
      month: monthPrefix,
      totalEmployees: employees.length,
      reports: reportsData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get System Audit Logs
 */
export const getAuditLogs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (category && category !== 'ALL') {
      query.category = category;
    }
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [{ action: searchRegex }, { details: searchRegex }, { userName: searchRegex }];
    }

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
