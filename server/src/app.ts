import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import { rateLimiter } from './middlewares/rateLimiter';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';

const app = express();

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(rateLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

export default app;

