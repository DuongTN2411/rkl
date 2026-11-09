import User from '../models/user.model.js';
import { MESSAGES } from '../constants/index.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    return res.status(200).json({ status: 200, message: MESSAGES.GET_USERS_SUCCESSFUL, data: users });
  } catch (error) {
    return res.status(500).json({ status: 500, message: MESSAGES.SERVER_ERROR, errors: null });
  }
};
