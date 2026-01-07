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

    const [activeTab, setActiveTab] = useState<'all' | 'following'>('following');

    const loadPosts = useCallback(async (pageNum: number = 1, append: boolean = false, type: 'all' | 'following' = activeTab) => {
        if (isLoading && append) return;

        setIsLoading(true);
        try {
            const response = await api.get<{ data: PaginatedPosts }>(
                `${API_ENDPOINTS.POSTS.FEED}?page=${pageNum}&limit=10&type=${type}`
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
    }, [activeTab, isLoading]);

    useEffect(() => {
        loadPosts(1, false, activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleTabChange = (tab: 'all' | 'following') => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        setPosts([]);
        setPage(1);
        setHasMore(true);
    };

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

    const handleCreatePost = async (content: string, video?: File) => {
        setIsCreating(true);
        try {
            const formData = new FormData();
            formData.append('content', content);
            if (video) {
                formData.append('media', video);
            }

            const response = await api.post(API_ENDPOINTS.POSTS.CREATE, formData);
            const newPost = response.data.data;
            if (activeTab === 'following') {
                setPosts((prev) => [newPost, ...prev]);
            }
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
        <div className="max-w-2xl mx-auto px-4 md:px-6">
            <div className="mb-6 md:mb-8 pt-4 md:pt-6 sticky top-[60px] z-40 bg-base-100/95 backdrop-blur-sm -mx-4 px-4 md:-mx-6 md:px-6 border-b border-base-200">
                <div className="flex gap-8">
                    <button
                        className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'following' ? 'text-primary' : 'text-base-content/60 hover:text-base-content'}`}
                        onClick={() => handleTabChange('following')}
                    >
                        Seguiti
                        {activeTab === 'following' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                        )}
                    </button>
                    <button
                        className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'all' ? 'text-primary' : 'text-base-content/60 hover:text-base-content'}`}
                        onClick={() => handleTabChange('all')}
                    >
                        Esplora
                        {activeTab === 'all' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                        )}
                    </button>
                </div>
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
