const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require('sequelize');
const AppError = require('../utils/AppError');
const { sendError } = require('../utils/response');

const notFound = (req, res, next) => {
  next(new AppError(404, `Không tìm thấy đường dẫn ${req.originalUrl}`));
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return sendError(res, 400, 'Body không phải là JSON hợp lệ');
  }

  if (error instanceof AppError) {
    return sendError(res, error.status, error.message, error.errors);
  }

  if (error instanceof UniqueConstraintError) {
    return sendError(res, 400, 'Dữ liệu đã tồn tại');
  }

  if (error instanceof ValidationError) {
    const errors = error.errors.map((item) => ({
      field: item.path,
      message: item.message,
    }));
    return sendError(res, 400, 'Dữ liệu không hợp lệ', errors);
  }

  if (error instanceof ForeignKeyConstraintError) {
    return sendError(res, 400, 'Dữ liệu liên kết không hợp lệ');
  }

  console.error(error);
  return sendError(res, 500, 'Đã xảy ra lỗi máy chủ');
};

module.exports = { notFound, errorHandler };
