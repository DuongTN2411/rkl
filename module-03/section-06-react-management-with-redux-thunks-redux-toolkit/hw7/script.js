/*
  PHÂN TÍCH - 2 HƯỚNG GIẢI QUYẾT:

  HƯỚNG 1: Pessimistic Update (isLoading chặn bấm tiếp)
  - Khi nhấn Like: set isLoading=true, disable button, chờ Server 2 giây.
  - Server trả về => cập nhật UI.
  Ưu điểm: An toàn, UI luôn đồng bộ với Server.
  Nhược điểm: UX tệ - người dùng phải chờ 2 giây mỗi lần bấm.

  HƯỚNG 2: Optimistic Update với Rollback (đã chọn)
  - Khi nhấn Like: CẬP NHẬT UI NGAY LẬP TỨC (tăng like, đổi màu).
  - Gọi API ngầm.
  - Nếu API thành công: giữ nguyên UI (không cần làm gì thêm).
  - Nếu API thất bại: ROLLBACK về trạng thái cũ.
  Ưu điểm: UX mượt mà, không chờ đợi.
  Nhược điểm: Phức tạp hơn, cần lưu snapshot trước khi update.

  SO SÁNH:
  | Tiêu chí         | Pessimistic | Optimistic    |
  |------------------|-------------|---------------|
  | Độ khó triển khai| Thấp        | Trung bình    |
  | UX               | Kém (chờ 2s)| Tốt (ngay lập)|
  | An toàn dữ liệu  | Cao         | Cao (rollback)|

  => CHỌN Hướng 2: Optimistic Update với Rollback.
*/

const { createSlice, createAsyncThunk, configureStore } = window.RTK;

const posts = [
  { id: 1, title: 'Redux Toolkit giúp đơn giản hóa State Management', likes: 12, liked: false },
  { id: 2, title: 'RTK Query - Giải pháp Data Fetching tối ưu cho React', likes: 8, liked: false },
  { id: 3, title: 'Optimistic Updates: Bí quyết tăng UX không tốn chi phí', likes: 21, liked: false }
];

const likePost = createAsyncThunk('posts/like', async (postId, { rejectWithValue }) => {
  await new Promise(res => setTimeout(res, 2000));
  if (Math.random() < 0.3) {
    return rejectWithValue({ postId, message: 'Server lỗi, đã hoàn tác' });
  }
  return postId;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: posts, pending: {} },
  reducers: {
    optimisticLike: (state, action) => {
      const post = state.items.find(p => p.id === action.payload);
      if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        state.pending[action.payload] = true;
      }
    },
    rollbackLike: (state, action) => {
      const post = state.items.find(p => p.id === action.payload);
      if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        delete state.pending[action.payload];
      }
    },
    confirmLike: (state, action) => {
      delete state.pending[action.payload];
    }
  }
});

const { optimisticLike, rollbackLike, confirmLike } = postsSlice.actions;

const store = configureStore({ reducer: postsSlice.reducer });

function handleLike(postId) {
  store.dispatch(optimisticLike(postId));

  store.dispatch(likePost(postId)).then(result => {
    if (likePost.fulfilled.match(result)) {
      store.dispatch(confirmLike(postId));
    } else if (likePost.rejected.match(result)) {
      store.dispatch(rollbackLike(postId));
    }
  });
}

function render() {
  const { items, pending } = store.getState();
  const container = document.getElementById('postList');
  container.innerHTML = '';

  items.forEach(post => {
    const isPending = !!pending[post.id];
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <div class="post-title">${post.title}</div>
      <div class="post-footer">
        <button
          class="like-btn ${post.liked ? 'liked' : ''}"
          data-id="${post.id}"
          ${isPending ? 'disabled' : ''}
        >
          ${post.liked ? '❤️' : '🤍'} Thích
        </button>
        <span class="like-count">${post.likes} lượt thích</span>
        ${isPending ? '<span class="rollback-msg">Đang đồng bộ...</span>' : ''}
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id, 10);
      handleLike(id);
    });
  });
}

store.subscribe(render);
render();
