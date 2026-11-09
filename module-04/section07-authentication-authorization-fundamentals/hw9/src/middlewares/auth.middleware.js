import { verifyAccessToken, stripBearer } from '../utils/jwt.js';
import { MESSAGES } from '../constants/index.js';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ status: 401, message: MESSAGES.TOKEN_REQUIRED, errors: null });
  }

  try {
    const token = stripBearer(header);
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? MESSAGES.TOKEN_EXPIRED : MESSAGES.TOKEN_INVALID;
    return res.status(401).json({ status: 401, message, errors: null });
  }
};
