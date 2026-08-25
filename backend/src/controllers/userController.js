import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { Attendance } from '../models/Attendance.js';
import { logAudit } from '../utils/audit.js';

/**
 * Get current user profile with office & quick stats
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).populate('officeId');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Calculate user's monthly attendance stats
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyRecords = await Attendance.find({
      employee: user._id,
      date: { $regex: `^${currentMonth}` },
    });

    const presentDays = monthlyRecords.filter((r) => r.status === 'Present' || r.status === 'Late').length;
    const lateDays = monthlyRecords.filter((r) => r.status === 'Late').length;
    const totalWorkingHours = monthlyRecords.reduce((acc, r) => acc + (r.workingHours || 0), 0);

    const userJson = user.toObject();
    delete userJson.password;

    res.json({
      success: true,
      user: userJson,
      stats: {
        currentMonth,
        totalPresent: presentDays,
        totalLate: lateDays,
        totalWorkingHours: Math.round(totalWorkingHours * 10) / 10,
        averageDailyHours: presentDays > 0 ? Math.round((totalWorkingHours / presentDays) * 10) / 10 : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update user profile details
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage, department, designation, shiftSchedule, officeId } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (shiftSchedule) user.shiftSchedule = shiftSchedule;
    if (officeId) user.officeId = officeId;

    // Allow designation/dept changes if admin or if user is updating their own
    if (department && req.user?.role === 'admin') user.department = department;
    if (designation && req.user?.role === 'admin') user.designation = designation;

    await user.save();

    await logAudit(
      'PROFILE_UPDATED',
      'EMPLOYEE',
      `User ${user.name} updated profile details`,
      req,
      user._id,
      user.name,
      user.role
    );

    const updatedUser = await User.findById(user._id).populate('officeId');
    const userJson = updatedUser?.toObject();
    if (userJson) delete userJson.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userJson,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password provided is incorrect' });
      return;
    }

    user.password = newPassword;
    await user.save();

    await logAudit(
      'PASSWORD_CHANGED',
      'AUTH',
      `User ${user.name} changed account password`,
      req,
      user._id,
      user.name,
      user.role
    );

    res.json({ success: true, message: 'Password has been updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get user notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user?._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      user: req.user?._id,
      read: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === 'all') {
      await Notification.updateMany({ user: req.user?._id, read: false }, { read: true });
    } else {
      await Notification.findOneAndUpdate({ _id: id, user: req.user?._id }, { read: true });
    }

    res.json({ success: true, message: 'Notification(s) marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
