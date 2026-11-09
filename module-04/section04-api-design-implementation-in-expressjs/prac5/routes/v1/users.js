const express = require('express');
const users = require('../../data/users');
const { sendSuccess, sendError } = require('../../utils/response');

const router = express.Router();

const toV1 = (u) => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email });

router.get('/', (req, res) => {
  sendSuccess(res, 200, users.map(toV1), { total: users.length });
});

router.get('/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    return sendError(res, 404, 'USER_NOT_FOUND', 'Không tìm thấy user');
  }
  sendSuccess(res, 200, toV1(user));
});

module.exports = router;
