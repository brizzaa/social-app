import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { getUserProfile, followUser, unfollowUser } from '../services/userService';

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId;
    const profile = await getUserProfile(id, currentUserId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const follow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId!;

    await followUser(currentUserId, id);

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const unfollow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId!;

    await unfollowUser(currentUserId, id);

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
    });
  } catch (error) {
    next(error);
  }
};

