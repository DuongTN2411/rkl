const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    const random = Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}-${random}-${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    const error = new Error('Chỉ chấp nhận file ảnh JPEG/PNG/WEBP');
    error.statusCode = 400;
    return cb(error);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

app.post('/upload/avatar', (req, res) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res
            .status(400)
            .json({ message: 'File vượt quá dung lượng cho phép (2MB)' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res
            .status(400)
            .json({ message: 'Chỉ được upload 1 file qua field "avatar"' });
        }
        return res.status(400).json({ message: err.message });
      }

      if (err.statusCode === 400) {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'Vui lòng chọn file ảnh qua field "avatar"' });
    }

    res.json({
      message: 'Upload thành công',
      filename: req.file.filename,
      size: req.file.size
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
