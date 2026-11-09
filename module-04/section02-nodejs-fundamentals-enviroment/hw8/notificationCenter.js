const EventEmitter = require('events');

class NotificationCenter extends EventEmitter {
  constructor() {
    super();

    this.on('user:registered', ({ name }) => {
      console.log(`[EMAIL] Gửi email chào mừng ${name}`);
    });
    this.on('user:registered', () => {
      console.log('[STATS] Cập nhật số người dùng: +1');
    });

    this.on('order:created', ({ id }) => {
      console.log(`[EMAIL] Gửi xác nhận đơn #${id}`);
    });
    this.on('order:created', ({ total }) => {
      console.log(`[STATS] Cập nhật doanh thu: +${total}`);
    });

    this.on('order:cancelled', ({ id }) => {
      console.log(`[EMAIL] Gửi thông báo hủy đơn #${id}`);
    });
    this.on('order:cancelled', ({ total }) => {
      if (total > 1000000) {
        throw new Error(`Không thể cập nhật doanh thu: tổng tiền ${total} vượt quá 1000000`);
      }
      console.log(`[STATS] Cập nhật doanh thu: -${total}`);
    });

    this.on('error', (err) => {
      console.log(`[ERROR] ${err.message}`);
    });
  }

  emit(event, ...args) {
    try {
      return super.emit(event, ...args);
    } catch (err) {
      if (event === 'error') {
        throw err;
      }
      return super.emit('error', err);
    }
  }
}

module.exports = NotificationCenter;
