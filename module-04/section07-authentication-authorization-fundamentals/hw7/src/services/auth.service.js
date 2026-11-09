import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { MESSAGES } from '../constants/index.js';

export const createError = (status, message) => {
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

export const login = async ({ username, password }) => {
  const user = await User.findOne({ $or: [{ username }, { email: username }] });
  if (!user) throw createError(401, MESSAGES.INVALID_CREDENTIALS);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw createError(401, MESSAGES.INVALID_CREDENTIALS);

  const payload = { userId: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken: `Bearer ${accessToken}`,
    refreshToken: `Bearer ${refreshToken}`,
  };
};
