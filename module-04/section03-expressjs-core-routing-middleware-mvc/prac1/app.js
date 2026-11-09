const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bookstore API' });
});

app.get('/books', (req, res) => {
  res.json({ message: 'Danh sách sách', data: [] });
});

app.post('/books', (req, res) => {
  res.json({ message: 'Tạo sách thành công', data: req.body });
});

app.get('/books/:id', (req, res) => {
  res.json({ message: 'Chi tiết sách', id: req.params.id });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
