import { Router } from 'express';
import { z } from 'zod';
import {
  create,
  getSingle,
  getFeedPosts,
  remove,
  like,
} from '../controllers/postController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createPostSchema, postIdSchema, paginationSchema } from '../utils/validators';

const router = Router();

router.get(
  '/',
  authenticate,
  validate(z.object({ query: paginationSchema })),
  getFeedPosts
);

router.get(
  '/:id',
  validate(z.object({ params: postIdSchema })),
  getSingle
);

router.post(
  '/',
  authenticate,
  validate(z.object({ body: createPostSchema })),
  create
);

router.delete(
  '/:id',
  authenticate,
  validate(z.object({ params: postIdSchema })),
  remove
);

router.post(
  '/:id/like',
  authenticate,
  validate(z.object({ params: postIdSchema })),
  like
);

export default router;

