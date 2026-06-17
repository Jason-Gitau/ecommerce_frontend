// src/pages/ResetPasswordPage.tsx
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import PasswordField from '../components/PasswordField';
import { PASSWORD_REGEX } from '../types/api';

const resetSchema = z.object({
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(PASSWORD_REGEX, 'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(token ? 'Create a new password' : 'Invalid or missing reset token.');

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[ResetPassword] Submitting reset with token:', token);
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: data.newPassword,
      });
      console.log('[ResetPassword] Response received:', response);
      setSuccess(true);
      setMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successfully. Please sign in.' } });
      }, 3000);
    } catch (err: unknown) {
      console.error('[ResetPassword] Error occurred:', err);
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Password reset failed. The token may be expired or invalid.';
        console.error('[ResetPassword] API Error Response:', {
          status: err.response?.status,
          data: err.response?.data,
          message,
        });
        setError(message);
      } else {
        setError('Password reset failed. The token may be expired or invalid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Reset Password</h2>

        {!token && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            Missing reset token. Please use the link from your email again.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4">
            <p className="text-green-700">{message}</p>
            <Link to="/login" className="text-blue-600 hover:underline">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">{message}</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <PasswordField
                label="New Password"
                id="reset-new-password"
                registerProps={register('newPassword')}
                error={errors.newPassword?.message}
                placeholder="Create a new password"
                autoComplete="new-password"
              />

              <PasswordField
                label="Confirm Password"
                id="reset-confirm-password"
                registerProps={register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
