import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../../types';
import { Avatar } from '../../../components/common/Avatar';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { BASE_URL } from '../../../utils/constants';

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onDelete?: (postId: string) => void;
    currentUserId?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onDelete,
    currentUserId,
}) => {
    const isOwnPost = currentUserId === post.author.id;
    const timeAgo = new Date(post.createdAt).toLocaleDateString();

    return (
        <Card className="mb-4 group border border-base-200 shadow-sm hover:shadow-soft transition-all duration-200 bg-base-100">
            <div className="flex items-start gap-4 p-1">
                <Link
                    to={`/profile/${post.author.id}`}
                    className="flex-shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                    aria-label={`Profilo di ${post.author.username}`}
                >
                    <Avatar src={post.author.avatar} alt={post.author.username} size="md" />
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                        <div className="flex items-baseline gap-2 min-w-0">
                            <Link
                                to={`/profile/${post.author.id}`}
                                className="font-bold text-base-content hover:underline decoration-2 decoration-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded text-base"
                            >
                                {post.author.username}
                            </Link>
                            <span className="text-base-content/40 text-sm">·</span>
                            <span className="text-base-content/40 text-sm">{timeAgo}</span>
                        </div>
                        {isOwnPost && onDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(post.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-error hover:bg-error/10 h-8 w-8 p-0 rounded-full flex items-center justify-center"
                                aria-label="Elimina post"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </Button>
                        )}
                    </div>

                    <p className="text-base-content/90 mb-3 whitespace-pre-wrap leading-relaxed text-[15px] break-words">
                        {post.content}
                    </p>

                    {post.mediaUrl && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-base-200 bg-base-200/50">
                            {post.mediaType === 'video' ? (
                                <video
                                    src={`${BASE_URL}${post.mediaUrl}`}
                                    controls
                                    className="w-full h-auto max-h-[500px] object-contain"
                                >
                                    Il tuo browser non supporta il tag video.
                                </video>
                            ) : (
                                <img
                                    src={`${BASE_URL}${post.mediaUrl}`}
                                    alt="Post media"
                                    className="w-full h-auto max-h-[500px] object-cover"
                                />
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => onLike(post.id)}
                            className={`group/like flex items-center gap-2 text-sm transition-colors duration-200 ${post.isLiked
                                ? 'text-accent'
                                : 'text-base-content/50 hover:text-accent'
                                }`}
                        >
                            <div className={`p-2 rounded-full transition-colors ${post.isLiked ? 'bg-accent/10' : 'group-hover/like:bg-accent/10'
                                }`}>
                                <svg
                                    className={`w-5 h-5 transition-transform duration-200 ${post.isLiked
                                        ? 'fill-current scale-110'
                                        : 'scale-100 group-active/like:scale-90'
                                        }`}
                                    fill={post.isLiked ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                            <span className={`font-medium ${post.isLiked && 'text-accent'}`}>
                                {post.likesCount > 0 && post.likesCount}
                            </span>
                        </button>


                    </div>
                </div>
            </div>
        </Card>
    );
};
