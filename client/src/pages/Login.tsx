import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setCredentials } from '../store/slices/authSlice';
import { setError, clearError } from '../store/slices/uiSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import { LoginData } from '../types';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError(null);
    dispatch(clearError());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);
    dispatch(clearError());

    try {
      const response = await api.post('/auth/login', formData);
      const { user, accessToken } = response.data.data;

      dispatch(setCredentials({ user, accessToken }));
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Accesso fallito. Per favore, riprova.';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] py-8 md:py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Bentornato</h1>
          <p className="text-base-content/70 text-sm md:text-base">Accedi al tuo account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={error || undefined}
            placeholder="Inserisci la tua email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Inserisci la tua password"
          />
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Accedi
          </Button>
        </form>
        <p className="mt-5 text-center text-base-content/70 text-sm md:text-base">
          Non hai un account?{' '}
          <Link
            to="/register"
            className="link link-primary font-semibold"
          >
            Registrati
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
