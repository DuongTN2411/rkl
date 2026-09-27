/*
  BÁO CÁO PHÂN TÍCH I/O & THIẾT KẾ:

  Input  -> Action setPage(pageNumber)
  Output -> state.currentPage (số nguyên >= 1)

  Logic Reducer:
  1. Nhận action.payload là số trang mới
  2. Validate: nếu payload < 1 => đưa về 1 (chặn số âm/số 0)
  3. Validate: nếu payload > TOTAL_PAGES => đưa về TOTAL_PAGES
  4. Cập nhật state.currentPage = validated value

  Mọi Component đều đọc store.getState().currentPage để biết trang hiện tại.
  Khi bấm "Quay lại" từ chi tiết bài viết, trang sẽ giữ nguyên.
*/

const { createSlice, configureStore } = window.RTK;

const ITEMS_PER_PAGE = 5;
const TOTAL_ITEMS = 20;
const TOTAL_PAGES = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

const allPosts = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: i + 1,
  title: `Bài viết số ${i + 1}: Chủ đề Redux Toolkit nâng cao`
}));

const paginationSlice = createSlice({
  name: 'pagination',
  initialState: { currentPage: 1 },
  reducers: {
    setPage: (state, action) => {
      let page = action.payload;
      if (page < 1) page = 1;
      if (page > TOTAL_PAGES) page = TOTAL_PAGES;
      state.currentPage = page;
    }
  }
});

const { setPage } = paginationSlice.actions;

const store = configureStore({ reducer: paginationSlice.reducer });

function render() {
  const { currentPage } = store.getState();
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagePosts = allPosts.slice(start, start + ITEMS_PER_PAGE);

  document.getElementById('pageInfo').textContent =
    `Hiển thị ${start + 1} - ${Math.min(start + ITEMS_PER_PAGE, TOTAL_ITEMS)} / ${TOTAL_ITEMS} bài viết`;

  const listEl = document.getElementById('postList');
  listEl.innerHTML = '';
  pagePosts.forEach(post => {
    const li = document.createElement('li');
    li.textContent = post.title;
    listEl.appendChild(li);
  });

  document.getElementById('pageLabel').textContent = `Trang ${currentPage} / ${TOTAL_PAGES}`;
  document.getElementById('prevBtn').disabled = currentPage <= 1;
  document.getElementById('nextBtn').disabled = currentPage >= TOTAL_PAGES;
}

document.getElementById('prevBtn').addEventListener('click', () => {
  store.dispatch(setPage(store.getState().currentPage - 1));
});

document.getElementById('nextBtn').addEventListener('click', () => {
  store.dispatch(setPage(store.getState().currentPage + 1));
});

const urlParams = new URLSearchParams(window.location.search);
const pageParam = parseInt(urlParams.get('page'), 10);
if (!isNaN(pageParam)) {
  store.dispatch(setPage(pageParam));
}

store.subscribe(render);
render();
