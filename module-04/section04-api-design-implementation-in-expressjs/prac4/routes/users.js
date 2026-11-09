const express = require('express');
const users = require('../data/users');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/:id', (req, res, next) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    return next(new ApiError(404, 'USER_NOT_FOUND', 'Không tìm thấy user'));
  }
  sendSuccess(res, 200, user);
});

router.post('/', (req, res, next) => {
  const { name, email } = req.body || {};

  if (!name || !email) {
    return next(new ApiError(400, 'MISSING_FIELD', 'Thiếu name hoặc email'));
  }
  if (!EMAIL_REGEX.test(email)) {
    return next(new ApiError(422, 'VALIDATION_ERROR', 'Email sai định dạng'));
  }
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return next(new ApiError(409, 'EMAIL_EXISTS', 'Email đã tồn tại'));
  }

  const user = { id: users.length + 1, name, email };
  users.push(user);
  sendSuccess(res, 201, user);
});

module.exports = router;
