const express = require('express');
const users = require('../data/users');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

router.get('/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    return sendError(res, 404, 'USER_NOT_FOUND', 'Không tìm thấy user');
  }
  sendSuccess(res, 200, user);
});

module.exports = router;
