import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'trackzone_enterprise_super_secret_jwt_key_2026_x89f';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'trackzone_refresh_super_secret_jwt_key_2026_k49z';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const generateTokens = (user) => {
  const payload = {
    userId: user._id ? user._id.toString() : user.employeeId,
    employeeId: user.employeeId,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
