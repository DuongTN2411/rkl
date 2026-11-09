const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const HttpError = require('./utils/httpError');

const app = express();

app.use(express.json());
app.use('/api/v1/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Khong tim thay duong dan' },
  });
});

app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message, ...err.extra },
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_JSON', message: 'Body khong phai JSON hop le' },
    });
  }

  console.error(err.message);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Da xay ra loi may chu' },
  });
});

module.exports = app;
