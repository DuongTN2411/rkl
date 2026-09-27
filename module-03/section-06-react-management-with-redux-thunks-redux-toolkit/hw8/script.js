/*
  THIẾT KẾ KIẾN TRÚC - Cache Invalidation Pattern:

  Trong RTK Query thực tế:
  - getProducts endpoint: providesTags: ['Product']
    => Cache được đánh dấu tag 'Product'
  - addProduct mutation: invalidatesTags: ['Product']
    => Sau khi thêm thành công, RTK Query tự xóa cache 'Product' và re-fetch
  - deleteProduct mutation: invalidatesTags: (result, error, id) => [{ type: 'Product', id }]
    => Chỉ invalidate cache của sản phẩm cụ thể

  Cơ chế:
  1. Lần đầu load: getProducts fetch API => cache với tag ['Product']
  2. Thêm/Xóa thành công: invalidate tag => cache bị xóa => getProducts tự gọi lại
  3. Thêm/Xóa thất bại: KHÔNG invalidate => cache giữ nguyên, không re-fetch thừa

  Demo dưới đây mô phỏng logic này bằng Redux Toolkit thuần.
  Sau mỗi mutation thành công (status 200), danh sách tự động refresh.
  Nếu mutation thất bại: không refresh, chỉ hiện thông báo lỗi.
*/

const { createSlice, createAsyncThunk, configureStore, combineReducers } = window.RTK;

let mockProducts = [
  { id: 1, name: 'Laptop Dell XPS 15' },
  { id: 2, name: 'Màn hình LG 27 inch 4K' },
  { id: 3, name: 'Bàn phím cơ Keychron K2' }
];
let nextId = 4;

function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = type;
  setTimeout(() => { toast.className = ''; toast.textContent = ''; }, 3000);
}

const fetchProducts = createAsyncThunk('products/fetch', async () => {
  await new Promise(r => setTimeout(r, 400));
  return [...mockProducts];
});

const addProduct = createAsyncThunk('products/add', async (name, { rejectWithValue }) => {
  await new Promise(r => setTimeout(r, 600));
  const newProduct = { id: nextId++, name };
  mockProducts.push(newProduct);
  return newProduct;
});

const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  await new Promise(r => setTimeout(r, 500));
  if (Math.random() < 0.2) {
    return rejectWithValue({ id, message: 'Server lỗi khi xóa' });
  }
  mockProducts = mockProducts.filter(p => p.id !== id);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => { state.isLoading = false; });
  }
});

const store = configureStore({ reducer: productsSlice.reducer });

function invalidateAndRefetch() {
  store.dispatch(fetchProducts());
}

function render() {
  const { items, isLoading } = store.getState();
  const container = document.getElementById('productList');

  if (isLoading) {
    container.innerHTML = '<p class="loading">Đang tải danh sách...</p>';
    return;
  }

  container.innerHTML = '';
  items.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.innerHTML = `
      <span>${product.name}</span>
      <button class="delete-btn" data-id="${product.id}">Xóa</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.id, 10);
      const result = await store.dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(result)) {
        showToast('Xóa thành công', 'success');
        invalidateAndRefetch();
      } else {
        showToast('Xóa thất bại, giữ nguyên danh sách', 'error');
      }
    });
  });
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) return;
  const result = await store.dispatch(addProduct(name));
  if (addProduct.fulfilled.match(result)) {
    showToast('Thêm thành công', 'success');
    document.getElementById('nameInput').value = '';
    invalidateAndRefetch();
  }
});

store.subscribe(render);
store.dispatch(fetchProducts());
