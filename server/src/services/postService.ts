import { IPost, Post } from '../models/Post';
import { User } from '../models/User';
import { createError } from '../middlewares/errorHandler';

export interface PostData {
    author: string;
    content: string;
}

export interface PostWithAuthor {
    id: string;
    content: string;
    author: {
        id: string;
        username: string;
        avatar?: string;
    };
    likesCount: number;
    isLiked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedPosts {
    posts: PostWithAuthor[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export const createPost = async (data: PostData): Promise<IPost> => {
    const post = new Post({
        author: data.author,
        content: data.content,
    });

    await post.save();
    return post;
};

export const getPostById = async (
    postId: string,
    currentUserId?: string
): Promise<PostWithAuthor> => {
    const post = await Post.findById(postId).populate('author', 'username avatar');
    if (!post) {
        throw createError('Post non trovato', 404);
    }

    const author = post.author as any;
    const isLiked = currentUserId ? post.likes.some((id) => id.toString() === currentUserId) : false;

    return {
        id: post._id.toString(),
        content: post.content,
        author: {
            id: author._id.toString(),
            username: author.username,
            avatar: author.avatar,
        },
        likesCount: post.likes.length,
        isLiked,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    };
};

export const getFeed = async (
    currentUserId: string,
    page: number = 1,
    limit: number = 10,
    filter: 'all' | 'following' = 'following'
): Promise<PaginatedPosts> => {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
        throw createError('Utente non trovato', 404);
    }

    let query = {};

    if (filter === 'following') {
        // Get posts from users that current user follows
        const followingIds = currentUser.following.map((id) => id.toString());
        // Always include own posts in following feed
        followingIds.push(currentUserId);
        query = { author: { $in: followingIds } };
    }
    // if filter is 'all', query stays empty {} which means all posts

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        Post.find(query)
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Post.countDocuments(query),
    ]);

    const postsWithAuthor: PostWithAuthor[] = posts.map((post) => {
        const author = post.author as any;
        const isLiked = post.likes.some((id) => id.toString() === currentUserId);

        return {
            id: post._id.toString(),
            content: post.content,
            author: {
                id: author._id.toString(),
                username: author.username,
                avatar: author.avatar,
            },
            likesCount: post.likes.length,
            isLiked,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    });

    return {
        posts: postsWithAuthor,
        total,
        page,
        limit,
        hasMore: skip + posts.length < total,
    };
};

export const deletePost = async (postId: string, authorId: string): Promise<void> => {
    const post = await Post.findById(postId);
    if (!post) {
        throw createError('Post not found', 404);
    }

    if (post.author.toString() !== authorId) {
        throw createError('Not authorized to delete this post', 403);
    }

    await Post.findByIdAndDelete(postId);
};

export const toggleLike = async (postId: string, userId: string): Promise<boolean> => {
    const post = await Post.findById(postId);
    if (!post) {
        throw createError('Post not found', 404);
    }

    const userIdObj = post.likes.find((id) => id.toString() === userId);
    const isLiked = !!userIdObj;

    if (isLiked) {
        // Unlike
        post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
        // Like
        post.likes.push(userId as any);
    }

    await post.save();
    return !isLiked; // Return new like state
};
