const express = require('express');
const AppError = require('./utils/AppError');

const app = express();
const PORT = 3000;

app.use(express.json());

let users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com' },
  { id: 2, name: 'Trần Thị B', email: 'b@example.com' }
];
let nextId = 3;

app.get('/users/secret', (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new AppError('Chưa xác thực', 401));
  }
  res.json({ success: true, message: 'Dữ liệu bí mật' });
});

app.get('/users/:id', (req, res, next) => {
  const user = users.find((u) => u.id === Number(req.params.id));

  if (!user) {
    return next(new AppError('Không tìm thấy user', 404));
  }

  res.json({ success: true, data: user });
});

app.post('/users', (req, res, next) => {
  const { name, email } = req.body;

  if (!email) {
    return next(new AppError('Thiếu trường email', 400));
  }

  const user = { id: nextId++, name, email };
  users.push(user);
  res.status(201).json({ success: true, data: user });
});

app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy route ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
