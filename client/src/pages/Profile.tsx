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
        // For now, we'll load all posts. In a real app, you'd have a user posts endpoint
        const response = await api.get<{ data: { posts: Post[] } }>(
          `${API_ENDPOINTS.POSTS.FEED}?page=1&limit=50`
        );
        // Filter posts by this user
        const userPosts = response.data.data.posts.filter(
          (post) => post.author.id === id
        );
        setPosts(userPosts);
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
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <div className="flex items-start gap-6">
          <Avatar src={profile.avatar} alt={profile.username} size="lg" />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {profile.username}
                </h1>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              {!isOwnProfile && (
                <FollowButton
                  userId={profile.id}
                  isFollowing={profile.isFollowing || false}
                  onToggle={handleFollowToggle}
                />
              )}
            </div>
            <div className="flex gap-8 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profile.followersCount || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Follower</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profile.followingCount || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Seguiti</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Post</h2>
        {isLoadingPosts ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <PostList
            posts={posts}
            onLike={handleLike}
            currentUserId={currentUser?.id}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
