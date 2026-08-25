import { validationResult, body, param, query } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed on submitted data',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
    return;
  }
  next();
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid corporate email address is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').trim().notEmpty().withMessage('Contact phone number is required'),
  body('department').trim().notEmpty().withMessage('Department assignment is required'),
  body('designation').trim().notEmpty().withMessage('Job designation is required'),
  handleValidationErrors,
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email address is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const checkInValidation = [
  body('latitude').isFloat().withMessage('Valid latitude coordinate is required'),
  body('longitude').isFloat().withMessage('Valid longitude coordinate is required'),
  body('officeId').optional().isString().withMessage('Valid office location identifier'),
  body('biometricVerified').optional().isBoolean().withMessage('Biometric status must be boolean'),
  handleValidationErrors,
];

export const geofenceValidation = [
  body('officeName').trim().notEmpty().withMessage('Office name is required'),
  body('code').trim().notEmpty().withMessage('Office identifier code is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('latitude').isFloat().withMessage('Latitude must be a valid number'),
  body('longitude').isFloat().withMessage('Longitude must be a valid number'),
  body('radius').isFloat({ min: 10, max: 10000 }).withMessage('Radius must be between 10 and 10000 meters'),
  handleValidationErrors,
];

export const leaveValidation = [
  body('leaveType').isIn(['Sick Leave', 'Casual Leave', 'Paid Leave', 'Emergency Leave', 'Maternity/Paternity Leave']).withMessage('Valid leave type is required'),
  body('startDate').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Start date must be in YYYY-MM-DD format'),
  body('endDate').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('End date must be in YYYY-MM-DD format'),
  body('reason').trim().isLength({ min: 5 }).withMessage('Reason must provide sufficient context (min 5 chars)'),
  handleValidationErrors,
];
