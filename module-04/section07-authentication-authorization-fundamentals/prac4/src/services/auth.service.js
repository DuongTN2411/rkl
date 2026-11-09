import User from '../models/user.model.js';
import { hashPassword } from '../utils/hash.js';
import { MESSAGES } from '../constants/index.js';

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const register = async ({ username, email, password }) => {
  const emailExists = await User.findOne({ email });
  if (emailExists) throw createError(409, MESSAGES.EMAIL_EXISTS);

  const usernameExists = await User.findOne({ username });
  if (usernameExists) throw createError(409, MESSAGES.USERNAME_EXISTS);

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ username, email, password: hashedPassword });
  return user;
};
