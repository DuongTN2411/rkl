const authService = require('../services/authService');
const { sendSuccess } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return sendSuccess(res, 201, 'Đăng ký tài khoản thành công', user);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, 200, 'Đăng nhập thành công', result);
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return sendSuccess(res, 200, 'Lấy thông tin tài khoản thành công', user);
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, me };
