import { IUser, User } from '../models/User';
import { createError } from '../middlewares/errorHandler';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  createdAt: Date;
}

export const getUserProfile = async (
  userId: string,
  currentUserId?: string
): Promise<UserProfile> => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw createError('User not found', 404);
  }

  let isFollowing = false;
  if (currentUserId && currentUserId !== userId) {
    const currentUser = await User.findById(currentUserId);
    isFollowing = currentUser?.following.includes(user._id) || false;
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    isFollowing,
    createdAt: user.createdAt,
  };
};

export const followUser = async (
  currentUserId: string,
  targetUserId: string
): Promise<void> => {
  if (currentUserId === targetUserId) {
    throw createError('Cannot follow yourself', 400);
  }

  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId),
    User.findById(targetUserId),
  ]);

  if (!currentUser || !targetUser) {
    throw createError('User not found', 404);
  }

  // Check if already following
  if (currentUser.following.includes(targetUser._id)) {
    throw createError('Already following this user', 400);
  }

  // Add to following and followers
  currentUser.following.push(targetUser._id);
  targetUser.followers.push(currentUser._id);

  await Promise.all([currentUser.save(), targetUser.save()]);
};

export const unfollowUser = async (
  currentUserId: string,
  targetUserId: string
): Promise<void> => {
  if (currentUserId === targetUserId) {
    throw createError('Cannot unfollow yourself', 400);
  }

  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId),
    User.findById(targetUserId),
  ]);

  if (!currentUser || !targetUser) {
    throw createError('User not found', 404);
  }

  // Check if not following
  if (!currentUser.following.includes(targetUser._id)) {
    throw createError('Not following this user', 400);
  }

  // Remove from following and followers
  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUser._id.toString()
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUser._id.toString()
  );

  await Promise.all([currentUser.save(), targetUser.save()]);
};

