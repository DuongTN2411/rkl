import * as authService from '../services/auth.service.js';
import { MESSAGES } from '../constants/index.js';

const handleError = (res, error) => {
  const status = error.status || 500;
  return res.status(status).json({ status, message: error.message || MESSAGES.SERVER_ERROR, errors: null });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ status: 400, message: MESSAGES.MISSING_FIELDS, errors: null });
    }
    const user = await authService.register({ username, email, password });
    return res.status(201).json({ status: 201, message: MESSAGES.REGISTER_SUCCESSFUL, data: user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 400, message: MESSAGES.MISSING_FIELDS, errors: null });
    }
    const data = await authService.login({ username, password });
    return res.status(200).json({ status: 200, message: MESSAGES.LOGIN_SUCCESSFUL, data });
  } catch (error) {
    return handleError(res, error);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ status: 400, message: MESSAGES.MISSING_FIELDS, errors: null });
    }
    const data = await authService.refreshToken(refreshToken);
    return res.status(200).json({ status: 200, message: MESSAGES.REFRESH_SUCCESSFUL, data });
  } catch (error) {
    return handleError(res, error);
  }
};
