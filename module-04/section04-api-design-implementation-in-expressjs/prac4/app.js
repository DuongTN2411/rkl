const express = require('express');
const userRoutes = require('./routes/users');
const ApiError = require('./utils/ApiError');

const app = express();
app.use(express.json());

app.use('/api/v1/users', userRoutes);

app.get('/api/v1/boom', () => {
  throw new Error('Lỗi cố tình để kiểm tra middleware');
});

app.use((req, res, next) => {
  next(new ApiError(404, 'ROUTE_NOT_FOUND', 'Không tìm thấy đường dẫn'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: { code: err.code || 'INTERNAL_SERVER_ERROR', message: err.message, status },
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
}

module.exports = app;
