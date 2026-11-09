const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const env = require('../config/env');
const { USER_PUBLIC_ATTRIBUTES } = require('../constants');
const AppError = require('../utils/AppError');

const toPublicUser = (user) => {
  const data = user.toJSON ? user.toJSON() : user;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const register = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    where: { email: normalizedEmail },
    attributes: ['id'],
  });

  if (existingUser) {
    throw new AppError(400, 'Email đã được sử dụng');
  }

  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return toPublicUser(user);
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    where: { email: normalizedEmail },
    attributes: [...USER_PUBLIC_ATTRIBUTES, 'password'],
  });

  if (!user) {
    throw new AppError(401, 'Email hoặc mật khẩu không đúng');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError(401, 'Email hoặc mật khẩu không đúng');
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: toPublicUser(user),
  };
};

const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: USER_PUBLIC_ATTRIBUTES,
  });

  if (!user) {
    throw new AppError(401, 'Tài khoản không tồn tại');
  }

  return user;
};

module.exports = { register, login, getMe };
