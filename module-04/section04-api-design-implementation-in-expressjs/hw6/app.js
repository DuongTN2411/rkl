const express = require('express');
const versionResolver = require('./middlewares/versionResolver');
const bookRoutes = require('./routes/books');
const { sendError } = require('./utils/response');

const app = express();
app.use(express.json());

app.use('/api/books', versionResolver, bookRoutes);

app.use((req, res) => {
  sendError(res, 404, 'ROUTE_NOT_FOUND', 'Không tìm thấy đường dẫn');
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
}

module.exports = app;
