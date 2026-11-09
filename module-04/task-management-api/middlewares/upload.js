const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');
const { UPLOAD_DIR } = require('../config/upload');

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
];

const MAX_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(-80);
    const random = Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}-${random}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new AppError(400, 'Định dạng tệp không được hỗ trợ'));
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

const uploadAttachment = (req, res, next) => {
  upload.single('file')(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError(400, 'Tệp vượt quá dung lượng cho phép (5MB)'));
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(new AppError(400, 'Chỉ được tải lên một tệp qua field "file"'));
      }
      return next(new AppError(400, error.message));
    }

    return next(error);
  });
};

module.exports = { uploadAttachment, UPLOAD_DIR };
