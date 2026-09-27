const productsDb = [
  { id: 1, name: 'Áo thun', price: 150000 },
  { id: 2, name: 'Quần jean', price: 450000 },
  { id: 3, name: 'Giày sneaker', price: 900000 },
];

let cartSlice = { items: [] };
let shippingSlice = { name: '', phone: '', address: '' };

function api_getProducts() {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(productsDb); }, 300);
  });
}

function api_createOrder(payload) {
  const slow = document.getElementById('simulate-slow-network').checked;
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (slow) {
        reject(new Error('Mất kết nối mạng - vui lòng thử lại.'));
      } else {
        resolve({ orderId: 'ORD-' + Date.now(), payload: payload });
      }
    }, slow ? 3000 : 700);
  });
}

function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  list.forEach(function (p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = '<span>' + p.name + ' - ' + p.price.toLocaleString('vi-VN') + ' đ</span>';
    const btn = document.createElement('button');
    btn.textContent = 'Thêm vào giỏ';
    btn.addEventListener('click', function () { addToCart(p); });
    card.appendChild(btn);
    container.appendChild(card);
  });
}

function addToCart(product) {
  const existing = cartSlice.items.find(function (i) { return i.id === product.id; });
  if (existing) {
    existing.qty += 1;
  } else {
    cartSlice.items.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  renderCart();
}

function clearCart() {
  cartSlice.items = [];
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cart-list');
  list.innerHTML = '';
  let total = 0;
  cartSlice.items.forEach(function (i) {
    total += i.price * i.qty;
    const li = document.createElement('li');
    li.innerHTML = '<span>' + i.name + ' x' + i.qty + '</span><span>' +
      (i.price * i.qty).toLocaleString('vi-VN') + ' đ</span>';
    list.appendChild(li);
  });
  document.getElementById('cart-total').textContent = total.toLocaleString('vi-VN') + ' đ';
}

['ship-name', 'ship-phone', 'ship-address'].forEach(function (id) {
  document.getElementById(id).addEventListener('input', function (e) {
    const key = id.replace('ship-', '');
    shippingSlice[key] = e.target.value;
  });
});

function handleCheckout() {
  const status = document.getElementById('checkout-status');
  const btn = document.getElementById('btn-checkout');

  if (!cartSlice.items.length) {
    status.textContent = 'Giỏ hàng đang trống.';
    return;
  }
  if (!shippingSlice.name.trim() || !shippingSlice.phone.trim() || !shippingSlice.address.trim()) {
    status.textContent = 'Vui lòng nhập đầy đủ thông tin giao hàng.';
    return;
  }

  const payload = {
    items: cartSlice.items,
    shipping: shippingSlice,
  };

  btn.disabled = true;
  status.textContent = 'Đang gửi đơn hàng lên server...';

  api_createOrder(payload)
    .then(function (res) {
      status.textContent = 'Đặt hàng thành công! Mã đơn: ' + res.orderId;
      clearCart();
    })
    .catch(function (err) {
      status.textContent = 'Lỗi: ' + err.message + ' (giỏ hàng vẫn được giữ nguyên, không mất dữ liệu).';
    })
    .finally(function () {
      btn.disabled = false;
    });
}

document.getElementById('btn-checkout').addEventListener('click', handleCheckout);

api_getProducts().then(renderProducts);
renderCart();
