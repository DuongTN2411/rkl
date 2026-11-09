const express = require('express');

const app = express();
app.use(express.json());

let books = [];
let nextId = 1;

app.get('/api/v1/books', (req, res) => {
  res.status(200).json({ success: true, data: books });
});

app.post('/api/v1/books', (req, res) => {
  const book = { ...req.body, id: nextId++ };
  books.push(book);
  res.status(201).json({ success: true, data: book });
});

app.put('/api/v1/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
  }
  books[index] = { ...books[index], ...req.body, id };
  res.status(200).json({ success: true, data: books[index] });
});

app.delete('/api/v1/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
  }
  books.splice(index, 1);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
}

module.exports = app;
