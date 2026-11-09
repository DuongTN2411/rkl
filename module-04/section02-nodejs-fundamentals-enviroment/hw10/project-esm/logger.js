import config from './config.js';

function timestamp() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat('sv-SE', {
    timeZone: config.LOG_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(now);
  const ms = String(now.getUTCMilliseconds()).padStart(3, '0');
  return `${formatted.replace(' ', 'T')}.${ms}`;
}

export default function setupLogger(service) {
  service.on('order:created', (order) => {
    console.log(`[${timestamp()}] Đơn hàng #${order.id} - created`);
  });

  service.on('order:processed', (order) => {
    console.log(`[${timestamp()}] Đơn hàng #${order.id} - processed`);
  });
}
