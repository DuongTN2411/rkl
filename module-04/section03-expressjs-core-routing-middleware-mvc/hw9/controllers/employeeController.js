const fs = require('fs');
const Employee = require('../models/Employee');
const AppError = require('../utils/AppError');

const getEmployees = (req, res, next) => {
  try {
    res.json({ success: true, data: Employee.getAll() });
  } catch (err) {
    next(err);
  }
};

const createEmployee = (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new AppError('Thiếu trường bắt buộc: name và email', 400);
    }

    const emailExists = Employee.getAll().some(
      (e) => e.email.toLowerCase() === String(email).trim().toLowerCase()
    );
    if (emailExists) {
      throw new AppError('Email đã tồn tại', 409);
    }

    const employee = Employee.create({ name, email: String(email).trim() });
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

const getEmployeeById = (req, res, next) => {
  try {
    const employee = Employee.findById(req.params.id);

    if (!employee) {
      throw new AppError('Không tìm thấy nhân viên', 404);
    }

    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

const ensureEmployeeExists = (req, res, next) => {
  try {
    if (!Employee.findById(req.params.id)) {
      throw new AppError('Không tìm thấy nhân viên', 404);
    }
    next();
  } catch (err) {
    next(err);
  }
};

const uploadEmployeeAvatar = (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Vui lòng chọn file ảnh qua field "avatar"', 400);
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const employee = Employee.updateAvatar(req.params.id, avatarUrl);

    if (!employee) {
      fs.unlink(req.file.path, () => {});
      throw new AppError('Không tìm thấy nhân viên', 404);
    }

    res.json({ success: true, message: 'Upload avatar thành công', data: employee });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  ensureEmployeeExists,
  uploadEmployeeAvatar
};
