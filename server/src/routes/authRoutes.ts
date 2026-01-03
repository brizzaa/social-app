import { Router } from 'express';
import { z } from 'zod';
import { register, login, refresh, logout } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../utils/validators';

const router = Router();

router.post('/register', validate(z.object({ body: registerSchema })), register);
router.post('/login', validate(z.object({ body: loginSchema })), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
