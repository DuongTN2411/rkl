const express = require('express');
const orderRoutes = require('./routes/orders');
const { sendError } = require('./utils/response');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/users', orderRoutes);

app.use((req, res) => {
  sendError(res, 404, 'ROUTE_NOT_FOUND', 'Không tìm thấy đường dẫn');
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 400, 'INVALID_JSON', 'Body không phải JSON hợp lệ');
  }
  console.error(err.stack);
  sendError(res, err.status || 500, 'INTERNAL_SERVER_ERROR', err.message);
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
}

module.exports = app;
