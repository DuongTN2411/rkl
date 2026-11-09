const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');
const employeeRoutes = require('./routes/employeeRoutes');
const AppError = require('./utils/AppError');

const app = express();
const PORT = 3000;

app.use(logger);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/employees', employeeRoutes);

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
