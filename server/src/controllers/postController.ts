import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import {
    createPost,
    getPostById,
    getFeed,
    deletePost,
    toggleLike,
} from '../services/postService';

export const create = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { content } = req.body;
        const authorId = req.userId!;

        const post = await createPost({
            author: authorId,
            content,
        });

        const postWithAuthor = await getPostById(post._id.toString(), authorId);

        res.status(201).json({
            success: true,
            data: postWithAuthor,
        });
    } catch (error) {
        next(error);
    }
};

export const getSingle = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const currentUserId = req.userId;

        const post = await getPostById(id, currentUserId);

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

export const getFeedPosts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const currentUserId = req.userId!;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const filter = (req.query.type as 'all' | 'following' | 'user') || 'following';
        const targetUserId = req.query.userId as string;

        const result = await getFeed(currentUserId, page, limit, filter, targetUserId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const authorId = req.userId!;

        await deletePost(id, authorId);

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const like = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId!;

        const isLiked = await toggleLike(id, userId);

        res.status(200).json({
            success: true,
            data: {
                isLiked,
            },
        });
    } catch (error) {
        next(error);
    }
};
