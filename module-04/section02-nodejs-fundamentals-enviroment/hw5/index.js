const OrderService = require('./orderService');

const service = new OrderService();

const orders = [
  { id: 1, total: 100000 },
  { id: 2, total: 250000 },
  { id: 3, total: 75000 },
];

orders.forEach((order) => {
  service.emit('order:created', order);
});
