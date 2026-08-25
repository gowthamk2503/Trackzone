import { AuditLog } from '../models/AuditLog.js';

export const logAudit = async (
  action,
  category,
  details,
  req,
  userId,
  userName,
  userRole
) => {
  try {
    const ipAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req?.headers['user-agent'] || '';

    await AuditLog.create({
      user: userId,
      userName: userName || 'System',
      userRole: userRole || 'system',
      action,
      category,
      details,
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};
