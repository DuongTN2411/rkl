/*
  THIẾT KẾ KIẾN TRÚC - Data Flow:

  ┌─────────────────────────────────────────────────────┐
  │                    REDUX STORE                       │
  │  ┌──────────────────┐  ┌─────────────────────────┐  │
  │  │   productsSlice  │  │      cartSlice          │  │
  │  │  (Server State)  │  │   (Client State)        │  │
  │  │  - items[]       │  │  - items[] (qty, price) │  │
  │  │  - isLoading     │  │  - total                │  │
  │  └──────────────────┘  └─────────────────────────┘  │
  │  ┌──────────────────┐  ┌─────────────────────────┐  │
  │  │  addressSlice    │  │    orderSlice           │  │
  │  │  (Client State)  │  │  (Server State)         │  │
  │  │  - name          │  │  - isSubmitting         │  │
  │  │  - address       │  │  - success              │  │
  │  │  - phone         │  │  - error                │  │
  │  └──────────────────┘  └─────────────────────────┘  │
  └─────────────────────────────────────────────────────┘

  Luồng Checkout:
  1. [RTK Query] Lấy danh sách sản phẩm từ API
  2. [cartSlice] Thêm/Xóa sản phẩm vào giỏ hàng (Client State)
  3. [addressSlice] Nhập địa chỉ giao hàng (Client State)
  4. [orderSlice Mutation] Gom dữ liệu cart + address => POST lên API
  5. Nếu thành công (200): Clear cart + address, hiện thông báo
  6. Nếu thất bại: Giữ nguyên cart + address, hiện lỗi

  Ràng buộc kỹ thuật:
  - Nút Thanh Toán chỉ active khi: cart > 0 VÀ tên + địa chỉ + SĐT được điền
  - Khi đang submit: disable nút để tránh double-submit
  - Mạng chậm: cart vẫn hiển thị, không crash
*/

const { createSlice, createAsyncThunk, configureStore, combineReducers } = window.RTK;

function showToast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await fetch('https://fakestoreapi.com/products?limit=6');
  if (!res.ok) throw new Error('Không tải được sản phẩm');
  const data = await res.json();
  return data.map(p => ({ id: p.id, title: p.title.slice(0, 40), price: p.price }));
});

const submitOrder = createAsyncThunk('order/submit', async (orderData, { rejectWithValue }) => {
  await new Promise(r => setTimeout(r, 1500));
  if (Math.random() < 0.15) {
    return rejectWithValue({ message: 'Server lỗi, vui lòng thử lại' });
  }
  return { orderId: `ORD-${Date.now()}`, ...orderData };
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, s => { s.isLoading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload; })
      .addCase(fetchProducts.rejected, s => { s.isLoading = false; });
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearCart: (state) => { state.items = []; }
  }
});

const addressSlice = createSlice({
  name: 'address',
  initialState: { name: '', address: '', phone: '' },
  reducers: {
    setAddress: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearAddress: () => ({ name: '', address: '', phone: '' })
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: { isSubmitting: false, lastOrder: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, s => { s.isSubmitting = true; s.error = null; })
      .addCase(submitOrder.fulfilled, (s, a) => { s.isSubmitting = false; s.lastOrder = a.payload; })
      .addCase(submitOrder.rejected, (s, a) => { s.isSubmitting = false; s.error = a.payload?.message; });
  }
});

const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
const { setAddress, clearAddress } = addressSlice.actions;

const store = configureStore({
  reducer: combineReducers({
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
    address: addressSlice.reducer,
    order: orderSlice.reducer
  })
});

function getCartTotal(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);
}

function render() {
  const { products, cart, address, order } = store.getState();

  const productEl = document.getElementById('productList');
  if (products.isLoading) {
    productEl.innerHTML = '<div class="loading-overlay">Đang tải sản phẩm...</div>';
  } else {
    productEl.innerHTML = '';
    products.items.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <div class="title">${p.title}</div>
        <div class="price">$${p.price}</div>
        <button data-id="${p.id}" data-title="${p.title}" data-price="${p.price}">+ Thêm vào giỏ</button>
      `;
      productEl.appendChild(div);
    });
    productEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        store.dispatch(addToCart({
          id: parseInt(btn.dataset.id),
          title: btn.dataset.title,
          price: parseFloat(btn.dataset.price)
        }));
      });
    });
  }

  const cartEl = document.getElementById('cartList');
  cartEl.innerHTML = '';
  if (cart.items.length === 0) {
    cartEl.innerHTML = '<p style="color:#6b7280;font-size:0.85rem">Chưa có sản phẩm nào</p>';
  } else {
    cart.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item.title.slice(0, 25)}... x${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
        <button data-id="${item.id}">✕</button>
      `;
      cartEl.appendChild(div);
    });
    cartEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => store.dispatch(removeFromCart(parseInt(btn.dataset.id))));
    });
  }

  document.getElementById('cartTotal').textContent =
    cart.items.length > 0 ? `Tổng: $${getCartTotal(cart.items)}` : '';

  const canCheckout = cart.items.length > 0 &&
    address.name.trim() && address.address.trim() && address.phone.trim() &&
    !order.isSubmitting;

  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn.disabled = !canCheckout;
  checkoutBtn.textContent = order.isSubmitting ? 'Đang xử lý...' : 'Thanh Toán';

  const resultEl = document.getElementById('orderResult');
  if (order.lastOrder) {
    resultEl.className = 'show';
    resultEl.innerHTML = `
      <strong>Đặt hàng thành công!</strong><br>
      Mã đơn hàng: ${order.lastOrder.orderId}<br>
      Giao đến: ${order.lastOrder.address.name} - ${order.lastOrder.address.address}
    `;
  } else {
    resultEl.className = '';
  }
}

['nameField', 'addressField', 'phoneField'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    store.dispatch(setAddress({
      name: document.getElementById('nameField').value,
      address: document.getElementById('addressField').value,
      phone: document.getElementById('phoneField').value
    }));
  });
});

document.getElementById('checkoutBtn').addEventListener('click', async () => {
  const { cart, address } = store.getState();
  const result = await store.dispatch(submitOrder({
    items: cart.items,
    address: { ...address },
    total: getCartTotal(cart.items)
  }));

  if (submitOrder.fulfilled.match(result)) {
    store.dispatch(clearCart());
    store.dispatch(clearAddress());
    document.getElementById('nameField').value = '';
    document.getElementById('addressField').value = '';
    document.getElementById('phoneField').value = '';
    showToast('Đặt hàng thành công!', 'success');
  } else {
    showToast(result.payload?.message || 'Đặt hàng thất bại', 'error');
  }
});

store.subscribe(render);
store.dispatch(fetchProducts());
render();
