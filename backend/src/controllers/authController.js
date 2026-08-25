import { User } from '../models/User.js';
import { Geofence } from '../models/Geofence.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { logAudit } from '../utils/audit.js';

/**
 * Register a new employee or administrator
 */
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
      designation,
      role = 'employee',
      officeId,
    } = req.body;

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An employee with this corporate email already exists in the directory',
      });
      return;
    }

    // Auto-generate employee ID e.g., TZ-1008
    const count = await User.countDocuments();
    const employeeId = `TZ-${(1000 + count + 1).toString()}`;

    // Find default office if none provided
    let assignedOffice = officeId;
    if (!assignedOffice) {
      const defaultOffice = await Geofence.findOne({ isActive: true });
      if (defaultOffice) {
        assignedOffice = defaultOffice._id;
      }
    }

    const user = new User({
      employeeId,
      name,
      email: email.toLowerCase(),
      phone,
      password,
      department,
      designation,
      role,
      officeId: assignedOffice,
      isActive: true,
      biometricRegistered: true,
    });

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);

    await logAudit(
      'USER_REGISTERED',
      'AUTH',
      `Registered new user: ${user.name} (${user.employeeId}) with role ${user.role}`,
      req,
      user._id,
      user.name,
      user.role
    );

    // Return sanitized user object
    const userJson = user.toObject();
    delete userJson.password;

    res.status(201).json({
      success: true,
      message: 'Account successfully registered',
      accessToken,
      refreshToken,
      user: userJson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * Login user with email and password
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password selected
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('officeId');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid corporate email or password credentials',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact your organization administrator.',
      });
      return;
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid corporate email or password credentials',
      });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);

    await logAudit(
      'USER_LOGIN',
      'AUTH',
      `User logged in successfully: ${user.name} (${user.role})`,
      req,
      user._id,
      user.name,
      user.role
    );

    const userJson = user.toObject();
    delete userJson.password;

    res.json({
      success: true,
      message: 'Authentication successful',
      accessToken,
      refreshToken,
      user: userJson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token. Please log in again.',
      });
      return;
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User session is no longer active',
      });
      return;
    }

    const tokens = generateTokens(user);

    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token renewal failed',
      error: error.message,
    });
  }
};

/**
 * Logout
 */
export const logout = async (req, res) => {
  try {
    if (req.user) {
      await logAudit(
        'USER_LOGOUT',
        'AUTH',
        `User logged out: ${req.user.name}`,
        req,
        req.user._id,
        req.user.name,
        req.user.role
      );
    }

    res.json({
      success: true,
      message: 'Successfully logged out',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

/**
 * Forgot password request
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with a generic success message to prevent user enumeration
    res.json({
      success: true,
      message: 'If the corporate email is registered, a password reset link has been dispatched.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Password reset request failed',
      error: error.message,
    });
  }
};

/**
 * Reset password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found',
      });
      return;
    }

    user.password = newPassword;
    await user.save();

    await logAudit(
      'PASSWORD_RESET',
      'AUTH',
      `Password was reset for user: ${user.name}`,
      req,
      user._id,
      user.name,
      user.role
    );

    res.json({
      success: true,
      message: 'Password has been successfully updated. You may now log in.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Password update failed',
      error: error.message,
    });
  }
};
