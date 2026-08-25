import { Geofence } from '../models/Geofence.js';
import { User } from '../models/User.js';
import { logAudit } from '../utils/audit.js';

/**
 * List all office locations / geofences
 */
export const listOffices = async (req, res) => {
  try {
    const offices = await Geofence.find().sort({ createdAt: -1 });

    // Attach count of assigned staff per office
    const officesWithCount = await Promise.all(
      offices.map(async (office) => {
        const staffCount = await User.countDocuments({ officeId: office._id, isActive: true });
        return {
          ...office.toObject(),
          staffCount,
        };
      })
    );

    res.json({
      success: true,
      offices: officesWithCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get active offices for check-in selector
 */
export const getActiveOffices = async (req, res) => {
  try {
    const offices = await Geofence.find({ isActive: true }).sort({ officeName: 1 });
    res.json({
      success: true,
      offices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get office by ID
 */
export const getOfficeById = async (req, res) => {
  try {
    const office = await Geofence.findById(req.params.id);
    if (!office) {
      res.status(404).json({ success: false, message: 'Office location not found' });
      return;
    }

    const staffCount = await User.countDocuments({ officeId: office._id, isActive: true });

    res.json({
      success: true,
      office: {
        ...office.toObject(),
        staffCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create new geofenced office location
 */
export const createOffice = async (req, res) => {
  try {
    const { officeName, code, address, city, country, latitude, longitude, radius, timezone, wifiSSID } = req.body;

    const existingCode = await Geofence.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      res.status(400).json({
        success: false,
        message: 'An office with this code identifier already exists.',
      });
      return;
    }

    const office = new Geofence({
      officeName,
      code: code.toUpperCase(),
      address,
      city,
      country: country || 'India',
      latitude: Number(latitude),
      longitude: Number(longitude),
      radius: Number(radius) || 150,
      timezone: timezone || 'Asia/Kolkata',
      wifiSSID: wifiSSID || '',
      isActive: true,
    });

    await office.save();

    await logAudit(
      'GEOFENCE_CREATED',
      'GEOFENCE',
      `Admin created new geofence: ${office.officeName} (${office.radius}m radius) at [${office.latitude}, ${office.longitude}]`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    res.status(201).json({
      success: true,
      message: 'Geofenced office location registered successfully',
      office,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update geofenced office location
 */
export const updateOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const { officeName, code, address, city, country, latitude, longitude, radius, isActive, timezone, wifiSSID } = req.body;

    const office = await Geofence.findById(id);
    if (!office) {
      res.status(404).json({ success: false, message: 'Office location not found' });
      return;
    }

    if (officeName) office.officeName = officeName;
    if (code) office.code = code.toUpperCase();
    if (address) office.address = address;
    if (city) office.city = city;
    if (country) office.country = country;
    if (latitude !== undefined) office.latitude = Number(latitude);
    if (longitude !== undefined) office.longitude = Number(longitude);
    if (radius !== undefined) office.radius = Number(radius);
    if (isActive !== undefined) office.isActive = Boolean(isActive);
    if (timezone) office.timezone = timezone;
    if (wifiSSID !== undefined) office.wifiSSID = wifiSSID;

    await office.save();

    await logAudit(
      'GEOFENCE_UPDATED',
      'GEOFENCE',
      `Admin updated office geofence: ${office.officeName} (Radius: ${office.radius}m)`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    res.json({
      success: true,
      message: 'Office location updated successfully',
      office,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete / deactivate office location
 */
export const deleteOffice = async (req, res) => {
  try {
    const { id } = req.params;

    const office = await Geofence.findById(id);
    if (!office) {
      res.status(404).json({ success: false, message: 'Office location not found' });
      return;
    }

    // Check if staff are currently mapped to this office
    const assignedStaffCount = await User.countDocuments({ officeId: office._id });
    if (assignedStaffCount > 0) {
      // Soft-deactivate rather than hard delete if employees exist
      office.isActive = false;
      await office.save();

      await logAudit(
        'GEOFENCE_DEACTIVATED',
        'GEOFENCE',
        `Admin deactivated office ${office.officeName} (Assigned staff: ${assignedStaffCount})`,
        req,
        req.user?._id,
        req.user?.name,
        req.user?.role
      );

      res.json({
        success: true,
        message: 'Office location deactivated (employees were assigned to this location).',
      });
      return;
    }

    await Geofence.findByIdAndDelete(id);

    await logAudit(
      'GEOFENCE_DELETED',
      'GEOFENCE',
      `Admin deleted office ${office.officeName}`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    res.json({
      success: true,
      message: 'Office location successfully removed',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
