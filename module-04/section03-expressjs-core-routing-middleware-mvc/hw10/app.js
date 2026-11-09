const express = require('express');
const path = require('path');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const AppError = require('./utils/AppError');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

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
