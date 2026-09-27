/*
  PHÂN TÍCH LỖI (Phần 1):
  Đoạn code gốc chỉ xử lý .fulfilled, thiếu .rejected và .pending.
  - Khi fetch thất bại, Promise bị rejected nhưng không có extraReducer nào bắt.
  - Lỗi không được lưu vào state => UI không biết để hiển thị thông báo.
  - React cố render dữ liệu undefined/null => crash màn hình trắng.

  GIẢI PHÁP (Phần 2):
  Thêm extraReducers bắt đủ 3 trạng thái: pending, fulfilled, rejected.
  Lưu state.error khi rejected => UI đọc để hiển thị thông báo thân thiện.
*/

const { createSlice, createAsyncThunk, configureStore } = window.RTK;

const fetchUsers = createAsyncThunk('users/fetch', async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Lỗi mạng: không thể tải dữ liệu');
  }
  return await response.json();
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Đã xảy ra lỗi không xác định';
      });
  }
});

const store = configureStore({ reducer: usersSlice.reducer });

function render() {
  const { data, loading, error } = store.getState();
  const statusEl = document.getElementById('status');
  const listEl = document.getElementById('userList');

  listEl.innerHTML = '';
  statusEl.className = 'empty';
  statusEl.textContent = '';

  if (loading) {
    statusEl.className = 'loading';
    statusEl.textContent = 'Đang tải dữ liệu...';
    return;
  }

  if (error) {
    statusEl.className = 'error';
    statusEl.textContent = `Lỗi mạng: ${error}`;
    return;
  }

  data.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.id}. ${user.name}`;
    listEl.appendChild(li);
  });
}

document.getElementById('fetchBtn').addEventListener('click', () => {
  store.dispatch(fetchUsers('https://jsonplaceholder.typicode.com/users'));
});

document.getElementById('fetchErrorBtn').addEventListener('click', () => {
  store.dispatch(fetchUsers('https://jsonplaceholder.typicode.com/wrong-url-404'));
});

store.subscribe(render);
render();
