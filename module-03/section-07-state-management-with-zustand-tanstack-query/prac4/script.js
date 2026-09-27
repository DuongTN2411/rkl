const ordersDb = {
  1: { id: 1, status: 'shipped', trackingId: 'VN-TRACK-001' },
  2: { id: 2, status: 'processing', trackingId: null },
};

const shippingHistoryDb = {
  'VN-TRACK-001': [
    { time: '08:00', event: 'Đơn hàng rời kho' },
    { time: '10:30', event: 'Đang trung chuyển tại Hà Nội' },
    { time: '15:00', event: 'Đang giao đến khách hàng' },
  ],
};

function api_getOrder(id) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(ordersDb[id]); }, 400);
  });
}

function api_getShippingHistory(trackingId) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(shippingHistoryDb[trackingId] || []); }, 400);
  });
}

function useQueryOrder(orderId, onData) {
  document.getElementById('order-info').textContent = 'Đang tải...';
  api_getOrder(orderId).then(onData);
}

function useQueryShippingHistory(trackingId, onData) {
  const el = document.getElementById('shipping-info');
  const enabled = !!trackingId;
  if (!enabled) {
    el.textContent = 'Chưa đủ điều kiện để gọi (trackingId = null) - API KHÔNG được gọi, tránh lỗi 400.';
    return;
  }
  el.textContent = 'Đang tải lịch sử giao hàng...';
  api_getShippingHistory(trackingId).then(onData);
}

function loadOrder(orderId) {
  useQueryOrder(orderId, function (order) {
    document.getElementById('order-info').innerHTML =
      'Mã đơn: #' + order.id + '<br>Trạng thái: ' + order.status +
      '<br>trackingId: ' + (order.trackingId || 'null');

    useQueryShippingHistory(order.trackingId, function (history) {
      const el = document.getElementById('shipping-info');
      if (!history.length) {
        el.textContent = 'Không có dữ liệu lịch sử.';
        return;
      }
      el.innerHTML = history.map(function (h) {
        return h.time + ' - ' + h.event;
      }).join('<br>');
    });
  });
}

document.getElementById('order-select').addEventListener('change', function (e) {
  loadOrder(Number(e.target.value));
});

loadOrder(1);
