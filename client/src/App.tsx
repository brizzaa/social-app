import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch';
import { setUser, logout } from './store/slices/authSlice';
import api from './services/api';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const fetchUser = async () => {
            if (isAuthenticated && !user) {
                try {
                    const response = await api.get('/auth/me');
                    dispatch(setUser(response.data.data));
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    dispatch(logout());
                }
            }
        };

        fetchUser();
    }, [dispatch, isAuthenticated, user]);

    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile/:id"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
