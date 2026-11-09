const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Bạn chưa đăng nhập hoặc token không hợp lệ'));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid token subject');
    }

    req.user = {
      id: userId,
      email: payload.email,
    };
    return next();
  } catch (error) {
    return next(new AppError(401, 'Token không hợp lệ hoặc đã hết hạn'));
  }
};

module.exports = authenticate;
