/*
  BÁO CÁO PHÂN TÍCH:

  Vấn đề với useEffect + useState:
  - Gọi API 2 lần khi component mount (React StrictMode).
  - Không có caching: mỗi lần mount lại đều re-fetch.
  - Phải tự quản lý isLoading, error, data riêng lẻ.

  RTK Query giải quyết:
  - Tự động cache: cùng endpoint + params chỉ fetch 1 lần.
  - Cung cấp isLoading, isError, data tự động.
  - Không bao giờ fetch trùng lặp.

  Các biến trạng thái RTK Query trả về:
  - isLoading: true khi đang fetch lần đầu
  - isFetching: true khi đang re-fetch (đã có cache)
  - isError: true khi fetch thất bại
  - isSuccess: true khi có dữ liệu
  - data: kết quả trả về
  - error: thông tin lỗi

  Bẫy dữ liệu: nếu data là [] => hiển thị "Chưa có sản phẩm nào" thay vì màn hình trắng.
*/

const { createSlice, createAsyncThunk, configureStore } = window.RTK;

const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const response = await fetch('https://fakestoreapi.com/products?limit=6');
  if (!response.ok) throw new Error('Không thể tải sản phẩm');
  return await response.json();
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { data: [], isLoading: false, isError: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  }
});

const store = configureStore({ reducer: productsSlice.reducer });

function renderProducts() {
  const { data, isLoading, isError, error } = store.getState();
  const contentEl = document.getElementById('content');

  if (isLoading) {
    contentEl.innerHTML = '<p class="loading">Đang tải sản phẩm...</p>';
    return;
  }

  if (isError) {
    contentEl.innerHTML = `<div class="error">Lỗi: ${error}</div>`;
    return;
  }

  if (data.length === 0) {
    contentEl.innerHTML = '<div class="empty">Chưa có sản phẩm nào</div>';
    return;
  }

  const ul = document.createElement('ul');
  data.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>${product.title}</div>
      <div class="price">$${product.price}</div>
    `;
    ul.appendChild(li);
  });
  contentEl.innerHTML = '';
  contentEl.appendChild(ul);
}

store.subscribe(renderProducts);
renderProducts();

store.dispatch(fetchProducts());
