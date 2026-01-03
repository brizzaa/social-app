import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import api from '../../../services/api';
import { API_ENDPOINTS } from '../../../utils/constants';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onToggle: (newState: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing,
  onToggle,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await api.delete(API_ENDPOINTS.USERS.UNFOLLOW(userId));
        onToggle(false);
      } else {
        await api.post(API_ENDPOINTS.USERS.FOLLOW(userId));
        onToggle(true);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'primary'}
      onClick={handleToggle}
      isLoading={isLoading}
    >
      {isFollowing ? 'Smetti di seguire' : 'Segui'}
    </Button>
  );
};
