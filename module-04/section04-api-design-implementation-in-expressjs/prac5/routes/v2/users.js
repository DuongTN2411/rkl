const express = require('express');
const users = require('../../data/users');
const { sendSuccess, sendError } = require('../../utils/response');

const router = express.Router();

const toV2 = (u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email });

router.get('/', (req, res) => {
  sendSuccess(res, 200, users.map(toV2), { total: users.length });
});

router.get('/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    return sendError(res, 404, 'USER_NOT_FOUND', 'Không tìm thấy user');
  }
  sendSuccess(res, 200, toV2(user));
});

module.exports = router;
