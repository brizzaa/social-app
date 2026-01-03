import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../hooks/useAppDispatch';
import { Post, PaginatedPosts } from '../types';
import { PostForm } from '../features/posts/components/PostForm';
import { PostList } from '../features/posts/components/PostList';
import api from '../services/api';
import { API_ENDPOINTS } from '../utils/constants';

const Home: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await api.get<{ data: PaginatedPosts }>(
        `${API_ENDPOINTS.POSTS.FEED}?page=${pageNum}&limit=10`
      );
      const { posts: newPosts, hasMore: more } = response.data.data;

      if (append) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setHasMore(more);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    loadPosts(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      hasMore &&
      !isLoading
    ) {
      loadPosts(page + 1, true);
    }
  }, [hasMore, isLoading, page, loadPosts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCreatePost = async (content: string) => {
    setIsCreating(true);
    try {
      const response = await api.post(API_ENDPOINTS.POSTS.CREATE, { content });
      const newPost = response.data.data;
      setPosts((prev) => [newPost, ...prev]);
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await api.post(API_ENDPOINTS.POSTS.LIKE(postId));
      const { isLiked } = response.data.data;

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked,
                likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await api.delete(API_ENDPOINTS.POSTS.DELETE(postId));
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Bacheca</h1>
        <p className="text-gray-600">Vedi cosa sta succedendo nella tua rete</p>
      </div>
      <PostForm onSubmit={handleCreatePost} isLoading={isCreating} />
      <PostList
        posts={posts}
        onLike={handleLike}
        onDelete={handleDelete}
        currentUserId={user?.id}
        isLoading={isLoading && posts.length > 0}
      />
    </div>
  );
};

export default Home;
