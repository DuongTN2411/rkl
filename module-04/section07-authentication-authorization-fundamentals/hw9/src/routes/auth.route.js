import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { loginLimiter } from '../middlewares/rate-limit.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/refresh-token', authController.refreshToken);

export default router;
