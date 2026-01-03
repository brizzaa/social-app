import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, TokenPayload } from '../utils/jwt';
import { createError } from '../middlewares/errorHandler';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const { username, email, password } = data;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw createError('User with this email or username already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const { email, password } = data;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401);
  }

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    const { verifyRefreshToken } = await import('../utils/jwt');
    const decoded = verifyRefreshToken(refreshToken);

    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    // Generate new access token
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    return generateAccessToken(tokenPayload);
  } catch (error) {
    throw createError('Invalid refresh token', 401);
  }
};
