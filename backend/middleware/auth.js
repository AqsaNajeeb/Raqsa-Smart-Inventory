import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes (any logged-in user)
export const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = user;
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Vendor-only access
export const vendorOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no user'
    });
  }

  if (req.user.role === 'vendor') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: Vendor only'
  });
};
