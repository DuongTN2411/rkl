/*
  PHÂN TÍCH LỖI (Phần 1):
  Đoạn code gốc của học viên:
    state.todos.push(action.payload);
    return state;
  - Vi phạm nguyên tắc Immutability của Redux thuần.
  - state.todos.push() thay đổi trực tiếp mảng gốc (mutation).
  - React/Redux so sánh tham chiếu (===) để quyết định render lại.
  - Vì state vẫn là cùng một object (reference không đổi), Redux không nhận ra state đã thay đổi.
  - Kết quả: giao diện không được render lại dù dữ liệu đã bị mutate trong bộ nhớ.

  GIẢI PHÁP (Phần 2):
  Dùng Redux Toolkit (createSlice) - tích hợp sẵn Immer.js.
  Immer cho phép viết code có vẻ "mutate" nhưng thực ra tạo ra một bản sao mới an toàn.
  Vì vậy state.todos.push() bên trong createSlice là hoàn toàn hợp lệ.
*/

const { createSlice, configureStore } = window.RTK;

const todoSlice = createSlice({
  name: 'todos',
  initialState: { todos: [] },
  reducers: {
    addTodo: (state, action) => {
      state.todos.push({ id: Date.now(), text: action.payload });
    }
  }
});

const { addTodo } = todoSlice.actions;

const store = configureStore({
  reducer: todoSlice.reducer
});

function render() {
  const { todos } = store.getState();
  const list = document.getElementById('todoList');
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.text;
    list.appendChild(li);
  });
}

document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (text) {
    store.dispatch(addTodo(text));
    input.value = '';
  }
});

store.subscribe(render);
render();
