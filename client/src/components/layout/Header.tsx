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
    <header className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-primary hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 -ml-2"
          aria-label="Home"
        >
          Social Network
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <Link
              to={`/profile/${user.id}`}
              className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity rounded-lg p-1 -ml-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`Profilo di ${user.username}`}
            >
              <Avatar src={user.avatar} alt={user.username} size="sm" />
              <span className="text-base-content font-semibold hidden sm:block text-sm">
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
