import { Router } from 'express';
import { z } from 'zod';
import { register, login, refresh, logout, getMe } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { registerSchema, loginSchema } from '../utils/validators';

const router = Router();

router.post('/register', validate(z.object({ body: registerSchema })), register);
router.post('/login', validate(z.object({ body: loginSchema })), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
