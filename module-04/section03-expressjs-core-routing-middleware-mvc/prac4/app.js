const express = require('express');

const app = express();
const PORT = 3000;

const logger = (req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
};

const checkAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Thiếu token xác thực' });
  }
  next();
};

app.use(logger);

app.get('/', (req, res) => {
  res.json({ message: 'Trang chủ' });
});

app.get('/products', (req, res) => {
  res.json({ message: 'Danh sách sản phẩm' });
});

app.get('/admin/dashboard', checkAuth, (req, res) => {
  res.json({ message: 'Chào mừng Admin' });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
