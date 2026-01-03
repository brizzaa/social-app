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
    <Card hover className="mb-4">
      <div className="flex items-start gap-4">
        <Link
          to={`/profile/${post.author.id}`}
          className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
        >
          <Avatar src={post.author.avatar} alt={post.author.username} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <Link
                to={`/profile/${post.author.id}`}
                className="font-bold text-gray-900 hover:text-blue-600 transition-colors inline-block"
              >
                {post.author.username}
              </Link>
              <span className="text-gray-500 text-sm ml-2">· {timeAgo}</span>
            </div>
            {isOwnPost && onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(post.id)}
              >
                Elimina
              </Button>
            )}
          </div>
          <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed text-base">
            {post.content}
          </p>
          <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 group transition-all duration-200 ${
                post.isLiked
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${
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
              <span className="font-semibold">{post.likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
