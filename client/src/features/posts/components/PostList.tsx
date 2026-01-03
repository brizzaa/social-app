import React from 'react';
import { Post } from '../../../types';
import { PostCard } from './PostCard';
import { Spinner } from '../../../components/common/Spinner';
import { Card } from '../../../components/ui/Card';

interface PostListProps {
  posts: Post[];
  onLike: (postId: string) => void;
  onDelete?: (postId: string) => void;
  currentUserId?: string;
  isLoading?: boolean;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  onLike,
  onDelete,
  currentUserId,
  isLoading = false,
}) => {
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-gray-600 font-medium text-lg">
          Nessun post ancora. Segui alcuni utenti per vedere i loro post!
        </p>
      </Card>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  );
};
