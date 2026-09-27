/*
  PHÂN TÍCH & ĐỀ XUẤT - 2 GIẢI PHÁP:

  ====================================================================
  GIẢI PHÁP 1: setTimeout/Debounce thuần trong Component (đã chọn)
  ====================================================================
  - Mỗi lần người dùng gõ, xóa timer cũ và tạo timer mới 500ms.
  - Sau 500ms không gõ thêm mới gọi API.
  Ưu điểm:
    + Đơn giản, dễ hiểu, không cần cấu hình thêm.
    + Không phụ thuộc vào Redux/RTK Query.
    + Dễ bảo trì, test.
  Nhược điểm:
    + Logic debounce nằm trong UI layer, không reuse được.
    + Không cancel request đang bay nếu người dùng gõ lại nhanh.

  ====================================================================
  GIẢI PHÁP 2: RTK Query với skip param hoặc AbortController
  ====================================================================
  - Dùng RTK Query: cấu hình endpoint search.
  - Dùng skip: true khi keyword rỗng để không trigger fetch.
  - Kết hợp debounce ở hook level (debouncedKeyword state).
  - Khi keyword thay đổi, request cũ tự bị cancel (abort) nếu dùng RTK Query.
  Ưu điểm:
    + Cache tự động: gõ lại từ cũ không re-fetch.
    + Request racing được xử lý tự động (cancel request cũ).
    + Logic tập trung ở service layer.
  Nhược điểm:
    + Phức tạp hơn, cần setup apiSlice.
    + Over-engineering cho app nhỏ.

  ====================================================================
  SO SÁNH & LỰA CHỌN:
  ====================================================================
  | Tiêu chí        | Giải pháp 1 (Debounce) | Giải pháp 2 (RTK Query) |
  |-----------------|------------------------|--------------------------|
  | Tốc độ dev      | Nhanh                  | Chậm hơn                 |
  | Dễ bảo trì      | Cao                    | Trung bình               |
  | Caching         | Không                  | Có                       |
  | Cancel request  | Không                  | Có (tự động)             |
  | Phù hợp app     | Nhỏ - vừa              | Vừa - lớn                |

  => CHỌN Giải pháp 1 cho bài này (đơn giản, hiệu quả, dễ demo).
     Nếu app cần cache và cancel racing: dùng Giải pháp 2.
*/

const { createSlice, createAsyncThunk, configureStore } = window.RTK;

let apiCallCount = 0;

const searchAsync = createAsyncThunk('search/fetch', async (keyword) => {
  apiCallCount++;
  document.getElementById('counter').textContent = apiCallCount;

  const response = await fetch(`https://fakestoreapi.com/products?limit=20`);
  if (!response.ok) throw new Error('Lỗi API');
  const all = await response.json();
  if (!keyword) return [];
  return all
    .filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()))
    .slice(0, 6);
});

const searchSlice = createSlice({
  name: 'search',
  initialState: { results: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => { state.isLoading = true; })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(searchAsync.rejected, (state) => { state.isLoading = false; });
  }
});

const store = configureStore({ reducer: searchSlice.reducer });

function render() {
  const { results, isLoading } = store.getState();
  const el = document.getElementById('suggestions');

  if (isLoading) {
    el.innerHTML = '<p class="loading">Đang tìm...</p>';
    return;
  }

  if (results.length === 0) {
    el.innerHTML = '';
    return;
  }

  const ul = document.createElement('ul');
  results.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.title;
    ul.appendChild(li);
  });
  el.innerHTML = '';
  el.appendChild(ul);
}

let debounceTimer = null;

document.getElementById('searchInput').addEventListener('input', (e) => {
  const keyword = e.target.value.trim();

  clearTimeout(debounceTimer);

  if (!keyword) {
    document.getElementById('suggestions').innerHTML = '';
    return;
  }

  debounceTimer = setTimeout(() => {
    store.dispatch(searchAsync(keyword));
  }, 500);
});

store.subscribe(render);
