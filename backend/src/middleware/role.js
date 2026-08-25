export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges are required to perform this action.',
    });
    return;
  }
  next();
};

export const requireEmployeeOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'employee')) {
    res.status(403).json({
      success: false,
      message: 'Access denied. Authorized roles only.',
    });
    return;
  }
  next();
};
