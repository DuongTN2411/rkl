const express = require('express');
const orders = require('../data/orders');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

const VALID_STATUS = ['pending', 'paid', 'cancelled'];
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

router.get('/:userId/orders', (req, res) => {
  const userId = Number(req.params.userId);
  const userOrders = orders.filter((o) => o.userId === userId);

  if (userOrders.length === 0) {
    return sendError(res, 404, 'USER_NOT_FOUND', 'Không tìm thấy user');
  }

  const { status, limit } = req.query;

  if (status !== undefined && !VALID_STATUS.includes(status)) {
    return sendError(res, 400, 'INVALID_STATUS', 'status chỉ nhận: pending, paid, cancelled');
  }

  let limitNumber = DEFAULT_LIMIT;
  if (limit !== undefined) {
    limitNumber = Number(limit);
    if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > MAX_LIMIT) {
      return sendError(res, 400, 'INVALID_LIMIT', `limit phải là số nguyên từ 1 đến ${MAX_LIMIT}`);
    }
  }

  const filtered = status ? userOrders.filter((o) => o.status === status) : userOrders;
  sendSuccess(res, 200, filtered.slice(0, limitNumber), { total: filtered.length });
});

router.post('/:userId/orders', (req, res) => {
  const userId = Number(req.params.userId);
  if (!orders.some((o) => o.userId === userId)) {
    return sendError(res, 404, 'USER_NOT_FOUND', 'Không tìm thấy user');
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return sendError(res, 400, 'EMPTY_BODY', 'Body không được để trống');
  }

  const { total } = req.body;
  if (typeof total !== 'number' || !(total > 0)) {
    return sendError(res, 400, 'INVALID_TOTAL', 'total phải là số lớn hơn 0');
  }

  const order = { id: orders.length + 1, userId, status: 'pending', total };
  orders.push(order);
  sendSuccess(res, 201, order);
});

module.exports = router;
