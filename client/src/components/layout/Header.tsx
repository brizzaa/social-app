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
        <header className="navbar bg-base-100/80 border-b border-base-200 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between">
                <Link
                    to="/"
                    className="text-xl md:text-2xl font-black text-primary hover:opacity-80 transition-all duration-200 px-2 -ml-2 tracking-tight"
                    aria-label="Home"
                >
                    SocialApp
                </Link>

                {isAuthenticated ? (
                    user ? (
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link
                                to={`/profile/${user.id}`}
                                className="flex items-center gap-2 md:gap-3 hover:bg-base-200/50 transition-all rounded-full p-1 pr-3 -ml-1 border border-transparent hover:border-base-200"
                                aria-label={`Profilo di ${user.username}`}
                            >
                                <Avatar src={user.avatar} alt={user.username} size="sm" />
                                <span className="text-base-content font-semibold hidden sm:block text-sm">
                                    {user.username}
                                </span>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-error/10 hover:text-error text-base-content/70">
                                Esci
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-base-300"></div>
                            <div className="w-20 h-4 bg-base-300 rounded hidden sm:block"></div>
                        </div>
                    )
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="font-medium text-base-content/70 hover:text-primary">
                                Accedi
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm" className="bg-primary hover:bg-primary-focus text-white border-0 shadow-lg shadow-primary/30">Registrati</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};
