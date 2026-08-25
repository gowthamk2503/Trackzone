import { Holiday } from '../models/Holiday.js';
import { logAudit } from '../utils/audit.js';

/**
 * Get all holidays
 */
export const getHolidays = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? Number(year) : new Date().getFullYear();

    const holidays = await Holiday.find({ year: targetYear }).sort({ date: 1 });

    res.json({
      success: true,
      year: targetYear,
      holidays,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Add holiday
 */
export const addHoliday = async (req, res) => {
  try {
    const { name, date, description, isOptional } = req.body;

    const d = new Date(date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[d.getDay()];
    const year = d.getFullYear();

    const holiday = new Holiday({
      name,
      date,
      dayOfWeek,
      description,
      isOptional: Boolean(isOptional),
      year,
    });

    await holiday.save();

    await logAudit(
      'HOLIDAY_ADDED',
      'SYSTEM',
      `Admin added holiday: ${name} on ${date}`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    res.status(201).json({
      success: true,
      message: 'Holiday added successfully',
      holiday,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Delete holiday
 */
export const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    await Holiday.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Holiday removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
