import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';
import { User, Post } from '../types';
import { Avatar } from '../components/common/Avatar';
import { FollowButton } from '../features/users/components/FollowButton';
import { PostList } from '../features/posts/components/PostList';
import { Spinner } from '../components/common/Spinner';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import { API_ENDPOINTS } from '../utils/constants';

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAppSelector((state) => state.auth);
    const [profile, setProfile] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const response = await api.get<{ data: User }>(API_ENDPOINTS.USERS.PROFILE(id));
                setProfile(response.data.data);
            } catch (error) {
                console.error('Impossibile caricare il profilo:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [id]);

    useEffect(() => {
        if (!id || !profile) return;

        const loadUserPosts = async () => {
            setIsLoadingPosts(true);
            try {
                const response = await api.get<{ data: { posts: Post[] } }>(
                    `${API_ENDPOINTS.POSTS.FEED}?page=1&limit=20&type=user&userId=${id}`
                );
                setPosts(response.data.data.posts);
            } catch (error) {
                console.error('Impossibile caricare i post:', error);
            } finally {
                setIsLoadingPosts(false);
            }
        };

        loadUserPosts();
    }, [id, profile]);

    const handleFollowToggle = (newState: boolean) => {
        if (profile) {
            setProfile({
                ...profile,
                isFollowing: newState,
                followersCount: (profile.followersCount || 0) + (newState ? 1 : -1),
            });
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
            console.error('Impossibile mettere like al post:', error);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm('Sei sicuro di voler eliminare questo post?')) {
            return;
        }

        try {
            await api.delete(API_ENDPOINTS.POSTS.DELETE(postId));
            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (error) {
            console.error('Impossibile eliminare il post:', error);
            alert('Errore durante l\'eliminazione del post');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner />
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center py-8">Utente non trovato</div>;
    }

    const isOwnProfile = currentUser?.id === profile.id;

    return (
        <div className="max-w-2xl mx-auto px-4 md:px-6">
            <Card className="mb-4 md:mb-6 mt-4 md:mt-6">
                <div className="flex items-start gap-4 md:gap-6">
                    <Avatar src={profile.avatar} alt={profile.username} size="lg" />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                            <div className="min-w-0">
                                <h1 className="text-3xl font-bold text-base-content mb-1 tracking-tight truncate">
                                    {profile.username}
                                </h1>
                                <p className="text-base-content/60 text-sm md:text-base truncate">{profile.email}</p>
                            </div>
                            {!isOwnProfile && (
                                <FollowButton
                                    userId={profile.id}
                                    isFollowing={profile.isFollowing || false}
                                    onToggle={handleFollowToggle}
                                />
                            )}
                        </div>
                        <div className="flex gap-6 md:gap-8 pt-4 border-t border-base-300 w-full sm:w-auto">
                            <div className="text-center hover:opacity-80 transition-opacity cursor-default">
                                <div className="text-2xl font-bold text-base-content">
                                    {profile.followersCount || 0}
                                </div>
                                <div className="text-xs md:text-sm text-base-content/60 font-medium uppercase tracking-wide">Follower</div>
                            </div>
                            <div className="text-center hover:opacity-80 transition-opacity cursor-default">
                                <div className="text-2xl font-bold text-base-content">
                                    {profile.followingCount || 0}
                                </div>
                                <div className="text-xs md:text-sm text-base-content/60 font-medium uppercase tracking-wide">Seguiti</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-base-content tracking-tight">Post</h2>
                {isLoadingPosts ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <PostList
                        posts={posts}
                        onLike={handleLike}
                        onDelete={isOwnProfile ? handleDelete : undefined}
                        currentUserId={currentUser?.id}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;
