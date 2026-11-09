const AppError = require('../utils/AppError');

const authorize = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return next(new AppError('Không đủ quyền truy cập', 403));
  }
  next();
};

module.exports = authorize;
