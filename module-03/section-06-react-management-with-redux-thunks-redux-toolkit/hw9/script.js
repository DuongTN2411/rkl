/*
  THIẾT KẾ KIẾN TRÚC - Custom Middleware:

  Vấn đề: Hệ thống có nhiều API khác nhau. Viết code hiển thị Toast lỗi ở từng
  Component tạo ra code rác lặp lại (DRY violation).

  Giải pháp: Custom Middleware trong Redux:
  - Middleware là một hàm nằm giữa action dispatch và reducer.
  - Mọi action đều đi qua middleware trước khi đến reducer.
  - Middleware kiểm tra nếu action có đuôi "/rejected" => đây là lỗi từ AsyncThunk.
  - Tự động đẩy Toast thông báo lên màn hình.
  - KHÔNG Component nào cần xử lý lỗi riêng nữa.

  Cấu trúc:
  const errorMiddleware = (store) => (next) => (action) => {
    if (action.type.endsWith('/rejected')) {
      showToast(action.error.message, 'error');
    }
    return next(action);
  }

  Tích hợp vào configureStore:
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(errorMiddleware)
  })
*/

const { createSlice, createAsyncThunk, configureStore } = window.RTK;

function showToast(message, type = 'error') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

const errorMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith('/rejected')) {
    const errorMsg = action.payload?.message || action.error?.message || 'Đã xảy ra lỗi';
    const status = action.payload?.status;

    if (status === 401) {
      showToast('Lỗi 401: Bạn chưa đăng nhập hoặc phiên đã hết hạn', 'error');
    } else if (status === 500) {
      showToast('Lỗi 500: Server đang gặp sự cố, vui lòng thử lại sau', 'error');
    } else {
      showToast(`Lỗi: ${errorMsg}`, 'error');
    }
  }
  return next(action);
};

const fetchUsers = createAsyncThunk('users/fetch', async (_, { rejectWithValue }) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
  if (!response.ok) return rejectWithValue({ status: response.status, message: `HTTP ${response.status}` });
  return await response.json();
});

const fetch401 = createAsyncThunk('api/401', async (_, { rejectWithValue }) => {
  return rejectWithValue({ status: 401, message: 'Unauthorized' });
});

const fetch500 = createAsyncThunk('api/500', async (_, { rejectWithValue }) => {
  return rejectWithValue({ status: 500, message: 'Internal Server Error' });
});

const fetchNetwork = createAsyncThunk('api/network', async () => {
  await fetch('https://this-domain-does-not-exist-xyz.com/api');
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { data: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.isLoading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        showToast('Tải dữ liệu thành công!', 'success');
      })
      .addCase(fetchUsers.rejected, (state) => { state.isLoading = false; });
  }
});

const store = configureStore({
  reducer: usersSlice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorMiddleware)
});

function render() {
  const { data, isLoading } = store.getState();
  const el = document.getElementById('content');

  if (isLoading) {
    el.innerHTML = '<p style="color:#6b7280;font-style:italic">Đang tải...</p>';
    return;
  }

  if (data.length === 0) {
    el.innerHTML = '';
    return;
  }

  const ul = document.createElement('ul');
  data.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.id}. ${u.name} — ${u.email}`;
    ul.appendChild(li);
  });
  el.innerHTML = '';
  el.appendChild(ul);
}

document.getElementById('fetchUsersBtn').addEventListener('click', () => store.dispatch(fetchUsers()));
document.getElementById('fetch401Btn').addEventListener('click', () => store.dispatch(fetch401()));
document.getElementById('fetch500Btn').addEventListener('click', () => store.dispatch(fetch500()));
document.getElementById('fetchNetworkBtn').addEventListener('click', () => store.dispatch(fetchNetwork()));

store.subscribe(render);
render();
