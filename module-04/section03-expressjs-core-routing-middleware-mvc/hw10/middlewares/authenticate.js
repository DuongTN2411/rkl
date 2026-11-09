const AppError = require('../utils/AppError');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return next(new AppError('Chưa đăng nhập', 401));
  }

  const role = header.trim().toLowerCase() === 'admin' ? 'admin' : 'user';
  req.user = { id: 1, role };
  next();
};

module.exports = authenticate;
