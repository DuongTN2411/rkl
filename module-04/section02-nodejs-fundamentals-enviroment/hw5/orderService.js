const EventEmitter = require('events');

class OrderService extends EventEmitter {
  constructor() {
    super();

    this.on('order:created', ({ id }) => {
      console.log(`[EMAIL] Đã gửi email xác nhận cho đơn hàng #${id}`);
    });

    this.once('order:created', () => {
      console.log('[SYSTEM] Đơn hàng đầu tiên đã được khởi tạo trong hệ thống');
    });
  }
}

module.exports = OrderService;
