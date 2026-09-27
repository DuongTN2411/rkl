/*
  BÁO CÁO PHÂN TÍCH:

  Giải pháp kết nối searchSlice (Client State) với RTK Query (Server State):

  Luồng dữ liệu:
  1. Người dùng nhập từ khóa → dispatch setKeyword(trimmedKeyword) vào searchSlice
  2. Store cập nhật state.search.keyword
  3. Hàm fetchProducts đọc keyword từ store, dùng làm query param gọi API
  4. Kết quả API được lưu vào productsSlice, render ra UI

  Bẫy dữ liệu:
  - Nếu keyword.trim() === "" => KHÔNG gọi API (ngăn lãng phí tài nguyên)
  - Hiển thị cảnh báo cho người dùng biết cần nhập từ khóa hợp lệ
*/

const { createSlice, createAsyncThunk, configureStore, combineReducers } = window.RTK;

const searchSlice = createSlice({
  name: 'search',
  initialState: { keyword: '' },
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    }
  }
});

const fetchProducts = createAsyncThunk('products/search', async (keyword) => {
  const response = await fetch(`https://fakestoreapi.com/products?limit=20`);
  if (!response.ok) throw new Error('Lỗi tải sản phẩm');
  const all = await response.json();
  return all.filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()));
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { data: [], isLoading: false, isError: false, searched: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.searched = false;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.searched = true;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  }
});

const { setKeyword } = searchSlice.actions;

const store = configureStore({
  reducer: combineReducers({
    search: searchSlice.reducer,
    products: productsSlice.reducer
  })
});

function render() {
  const { search, products } = store.getState();
  const { keyword } = search;
  const { data, isLoading, isError, searched } = products;
  const resultEl = document.getElementById('result');
  const kwEl = document.getElementById('currentKeyword');

  kwEl.textContent = keyword ? `Đang tìm: "${keyword}"` : '';

  if (isLoading) {
    resultEl.innerHTML = '<p class="loading">Đang tìm kiếm...</p>';
    return;
  }

  if (isError) {
    resultEl.innerHTML = '<div class="error">Lỗi kết nối server</div>';
    return;
  }

  if (!searched) {
    resultEl.innerHTML = '';
    return;
  }

  if (data.length === 0) {
    resultEl.innerHTML = `<div class="warning">Không tìm thấy sản phẩm nào với từ khóa "${keyword}"</div>`;
    return;
  }

  const ul = document.createElement('ul');
  data.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.title;
    ul.appendChild(li);
  });
  resultEl.innerHTML = '';
  resultEl.appendChild(ul);
}

document.getElementById('searchBtn').addEventListener('click', () => {
  const raw = document.getElementById('searchInput').value;
  const trimmed = raw.trim();

  if (!trimmed) {
    document.getElementById('result').innerHTML = '<div class="warning">Vui lòng nhập từ khóa hợp lệ (không được để trống hoặc toàn khoảng trắng)</div>';
    return;
  }

  store.dispatch(setKeyword(trimmed));
  store.dispatch(fetchProducts(trimmed));
});

document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

store.subscribe(render);
render();
