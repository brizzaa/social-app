import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { createError } from './errorHandler';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}

export const authenticate = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        if (!token) {
            throw createError('Authentication required', 401);
        }

        const decoded = verifyAccessToken(token);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        if (error instanceof Error && error.message === 'jwt expired') {
            next(createError('Token expired', 401));
        } else if (error instanceof Error && error.message === 'invalid token') {
            next(createError('Invalid token', 401));
        } else {
            next(error);
        }
    }
};
