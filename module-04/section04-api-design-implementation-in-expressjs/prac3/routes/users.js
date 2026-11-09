const express = require('express');
const users = require('../data/users');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', (req, res) => {
  const { name, email } = req.body || {};

  if (!name || !email) {
    return sendError(res, 400, 'MISSING_FIELD', 'Thiếu name hoặc email');
  }

  if (!EMAIL_REGEX.test(email)) {
    return sendError(res, 422, 'VALIDATION_ERROR', 'Email sai định dạng');
  }

  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return sendError(res, 409, 'EMAIL_EXISTS', 'Email đã tồn tại');
  }

  const user = { id: users.length + 1, name, email };
  users.push(user);
  sendSuccess(res, 201, user);
});

module.exports = router;
