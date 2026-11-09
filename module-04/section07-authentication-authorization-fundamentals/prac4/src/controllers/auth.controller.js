import * as authService from '../services/auth.service.js';
import { MESSAGES } from '../constants/index.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ status: 400, message: MESSAGES.MISSING_FIELDS, errors: null });
    }
    const user = await authService.register({ username, email, password });
    return res.status(201).json({ status: 201, message: MESSAGES.REGISTER_SUCCESSFUL, data: user });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ status, message: error.message || MESSAGES.SERVER_ERROR, errors: null });
  }
};
