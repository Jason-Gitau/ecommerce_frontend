// src/pages/LoginPage.tsx
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import PasswordField from '../components/PasswordField';
import { useAuthStore } from '../store/authStore';
import type { ApiResponse, LoginResponse } from '../types/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message as string | undefined;
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
      const authData = response.data;

      if (!authData?.user || !authData?.accessToken) {
        throw new Error('Unexpected login response from server.');
      }

      login(authData.user, authData.accessToken);

      if (authData.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError('Login request could not reach the server. Check CORS, network, or cookie settings.');
          return;
        }
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      } else {
        setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-lg shadow-neu-flat">
        <h2 className="text-medium font-bold text-center text-on-surface mb-6">Sign In</h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-secondary-container text-secondary rounded text-caption">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container rounded text-caption">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-caption font-medium text-on-surface-variant">Email</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-neu-inset bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-focus-glow focus:border-focus-glow"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-caption text-on-error-container">{errors.email.message}</p>}
          </div>

          <PasswordField
            label="Password"
            id="login-password"
            registerProps={register('password')}
            error={errors.password?.message}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-neu-flat text-caption font-medium text-on-primary bg-primary hover:shadow-neu-hover focus:outline-none focus:ring-2 focus:ring-focus-glow disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
