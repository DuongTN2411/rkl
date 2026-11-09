const express = require('express');
const orders = require('../data/orders');
const { buildOrderLinks } = require('../utils/links');
const { sendSuccess, sendError } = require('../utils/response');

const router = express.Router();

const withLinks = (order) => ({ ...order, _links: buildOrderLinks(order) });

router.get('/:id', (req, res) => {
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) {
    return sendError(res, 404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng');
  }
  sendSuccess(res, 200, withLinks(order));
});

router.post('/:id/cancellation', (req, res) => {
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) {
    return sendError(res, 404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng');
  }
  if (order.status !== 'pending') {
    return sendError(res, 409, 'ORDER_NOT_CANCELLABLE', 'Chỉ đơn hàng pending mới được huỷ');
  }
  order.status = 'cancelled';
  sendSuccess(res, 200, withLinks(order));
});

module.exports = router;
