const express = require('express');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Khong tim thay duong dan' },
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Da xay ra loi may chu' },
  });
});

module.exports = app;
