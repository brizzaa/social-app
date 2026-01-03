import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../../types';
import { Avatar } from '../../../components/common/Avatar';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

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
    <Card hover className="mb-3 md:mb-4 group">
      <div className="flex items-start gap-3 md:gap-4">
        <Link
          to={`/profile/${post.author.id}`}
          className="flex-shrink-0 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
          aria-label={`Profilo di ${post.author.username}`}
        >
          <Avatar src={post.author.avatar} alt={post.author.username} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
            <div className="flex-1 min-w-0">
              <Link
                to={`/profile/${post.author.id}`}
                className="font-semibold text-base-content hover:text-primary transition-colors inline-block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
              >
                {post.author.username}
              </Link>
              <span className="text-base-content/50 text-xs md:text-sm ml-2">· {timeAgo}</span>
            </div>
            {isOwnPost && onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(post.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Elimina post"
              >
                Elimina
              </Button>
            )}
          </div>
          <p className="text-base-content mb-3 md:mb-4 whitespace-pre-wrap leading-relaxed text-sm md:text-base break-words">
            {post.content}
          </p>
          <div className="flex items-center gap-4 md:gap-6 pt-3 border-t border-base-300">
            <button
              onClick={() => onLike(post.id)}
              className={`btn btn-ghost btn-sm gap-2 rounded-full transition-all duration-200 ${
                post.isLiked
                  ? 'text-error bg-error/10 hover:bg-error/20'
                  : 'text-base-content/60 hover:text-error hover:bg-base-200'
              }`}
              aria-label={post.isLiked ? 'Rimuovi like' : 'Metti like'}
            >
              <svg
                className={`w-5 h-5 transition-all duration-200 ${
                  post.isLiked
                    ? 'fill-current scale-110'
                    : 'group-hover:scale-110'
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
              <span className="font-medium">{post.likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
