import { Leave } from '../models/Leave.js';
import { Notification } from '../models/Notification.js';
import { logAudit } from '../utils/audit.js';

/**
 * Apply for leave
 */
export const applyLeave = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const leave = new Leave({
      employee: user._id,
      employeeId: user.employeeId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'Pending',
    });

    await leave.save();

    await logAudit(
      'LEAVE_APPLIED',
      'LEAVE',
      `Employee ${user.name} applied for ${totalDays} day(s) ${leaveType} (${startDate} to ${endDate})`,
      req,
      user._id,
      user.name,
      user.role
    );

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get current user's leave requests
 */
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user?._id })
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    const totalApprovedDays = leaves
      .filter((l) => l.status === 'Approved')
      .reduce((acc, l) => acc + l.totalDays, 0);

    const pendingCount = leaves.filter((l) => l.status === 'Pending').length;

    res.json({
      success: true,
      leaves,
      stats: {
        totalLeavesApplied: leaves.length,
        totalApprovedDays,
        pendingApplications: pendingCount,
        leaveBalance: Math.max(0, 18 - totalApprovedDays), // 18 standard annual paid days
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Get all leave requests
 */
export const getAllLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const leaves = await Leave.find(query)
      .populate('employee', 'name email department designation profileImage employeeId phone')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Leave.countDocuments(query);
    const pendingCount = await Leave.countDocuments({ status: 'Pending' });

    res.json({
      success: true,
      leaves,
      pendingCount,
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
 * Admin: Approve / Reject leave request
 */
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status must be Approved or Rejected' });
      return;
    }

    const leave = await Leave.findById(id).populate('employee');
    if (!leave) {
      res.status(404).json({ success: false, message: 'Leave application not found' });
      return;
    }

    leave.status = status;
    leave.approvedBy = req.user?._id;
    if (rejectionReason) leave.rejectionReason = rejectionReason;

    await leave.save();

    // Create Notification for the employee
    await Notification.create({
      user: leave.employee._id,
      title: `Leave Application ${status}`,
      message: `Your ${leave.leaveType} application for ${leave.startDate} to ${leave.endDate} has been ${status.toLowerCase()}.${
        rejectionReason ? ` Reason: ${rejectionReason}` : ''
      }`,
      type: 'leave',
    });

    await logAudit(
      `LEAVE_${status.toUpperCase()}`,
      'LEAVE',
      `Admin ${req.user?.name} marked leave for ${leave.employeeId} as ${status}`,
      req,
      req.user?._id,
      req.user?.name,
      req.user?.role
    );

    res.json({
      success: true,
      message: `Leave application successfully ${status.toLowerCase()}`,
      leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
