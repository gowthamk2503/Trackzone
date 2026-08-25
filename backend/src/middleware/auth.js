import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is missing or malformed',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired access token',
        expired: err.name === 'TokenExpiredError',
      });
      return;
    }

    req.tokenPayload = payload;

    // Attach user to request
    let user = null;
    try {
      user = await User.findById(payload.userId);
    } catch (e) {
      // In case ID format differs or mock DB is used
      user = await User.findOne({ employeeId: payload.employeeId });
    }

    if (!user) {
      // Fallback query by employeeId
      user = await User.findOne({ employeeId: payload.employeeId });
    }

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account not found or is currently inactive',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication internal failure',
      error: error.message,
    });
  }
};
