import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setCredentials } from '../store/slices/authSlice';
import { setError, clearError } from '../store/slices/uiSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import { RegisterData } from '../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
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
      const response = await api.post('/auth/register', formData);
      const { user, accessToken } = response.data.data;

      dispatch(setCredentials({ user, accessToken }));
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registrazione fallita. Per favore, riprova.';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Crea un account</h1>
          <p className="text-gray-600">Unisciti alla nostra community oggi</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nome utente"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={30}
            placeholder="Scegli un nome utente"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Inserisci la tua email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Crea una password (min. 6 caratteri)"
          />
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Crea Account
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Hai già un account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
          >
            Accedi
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
