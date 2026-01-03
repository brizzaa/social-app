import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { Avatar } from '../common/Avatar';
import { Button } from '../ui/Button';
import api from '../../services/api';

export const Header: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-gradient hover:scale-105 transition-transform duration-200"
        >
          Social Network
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <Link
              to={`/profile/${user.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar src={user.avatar} alt={user.username} size="sm" />
              <span className="text-gray-700 font-semibold hidden sm:block">
                {user.username}
              </span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Esci
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Accedi
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Registrati</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
