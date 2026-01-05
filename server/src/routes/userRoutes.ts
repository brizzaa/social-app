import { Router } from 'express';
import { z } from 'zod';
import { getProfile, follow, unfollow } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { userIdSchema } from '../utils/validators';

const router = Router();

router.get(
  '/:id',
  validate(z.object({ params: userIdSchema })),
  getProfile
);

router.post(
  '/:id/follow',
  authenticate,
  validate(z.object({ params: userIdSchema })),
  follow
);

router.delete(
  '/:id/follow',
  authenticate,
  validate(z.object({ params: userIdSchema })),
  unfollow
);

export default router;

