const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
  { id: 1, title: 'Học Express', done: false },
  { id: 2, title: 'Làm bài tập routing', done: false }
];

const findTask = (id) => tasks.find((t) => t.id === Number(id));

const notFound = (id) => ({ message: `Không tìm thấy task ${id}` });

app
  .route('/tasks/:id')
  .get((req, res) => {
    const task = findTask(req.params.id);
    if (!task) return res.status(404).json(notFound(req.params.id));
    res.json(task);
  })
  .put((req, res) => {
    const task = findTask(req.params.id);
    if (!task) return res.status(404).json(notFound(req.params.id));

    const { title, done } = req.body;
    if (title !== undefined) task.title = title;
    if (done !== undefined) task.done = done;

    res.json(task);
  })
  .delete((req, res) => {
    const task = findTask(req.params.id);
    if (!task) return res.status(404).json(notFound(req.params.id));

    tasks = tasks.filter((t) => t.id !== task.id);
    res.json({ message: `Đã xóa task ${req.params.id}` });
  });

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
