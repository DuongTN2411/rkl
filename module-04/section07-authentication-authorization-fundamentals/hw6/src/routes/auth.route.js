import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { loginLimiter } from '../middlewares/rate-limit.middleware.js';

const router = Router();

router.post('/login', loginLimiter, authController.login);

export default router;
