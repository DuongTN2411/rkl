const NotificationCenter = require('./notificationCenter');

const center = new NotificationCenter();

center.emit('user:registered', { name: 'Alice' });
center.emit('order:created', { id: 1, total: 500000 });
center.emit('order:created', { id: 2, total: 2000000 });
center.emit('order:cancelled', { id: 1, total: 500000 });
center.emit('order:cancelled', { id: 2, total: 2000000 });
center.emit('user:registered', { name: 'Bob' });

console.log('Chương trình vẫn tiếp tục chạy sau sự kiện lỗi');
