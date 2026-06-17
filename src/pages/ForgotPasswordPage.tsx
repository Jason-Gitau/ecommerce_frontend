// src/pages/ForgotPasswordPage.tsx
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const forgotSchema = z.object({ email: z.string().email('Invalid email address') });
type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormData>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      console.log('[ForgotPassword] Submitting request with email:', data.email);
      const response = await api.post('/auth/request-password-reset', data);
      console.log('[ForgotPassword] Response received:', response);
      setSuccess(true);
    } catch (err: unknown) {
      console.error('[ForgotPassword] Error occurred:', err);
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Failed to send reset email.';
        console.error('[ForgotPassword] API Error Response:', {
          status: err.response?.status,
          data: err.response?.data,
          message,
        });
        setError(message);
      } else {
        setError('Failed to send reset email.');
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-green-600 mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-4">If an account exists with that email, we have sent a password reset link.</p>
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Reset Password</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...register('email')} type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Send Reset Link</button>
        </form>
        <p className="mt-4 text-center text-sm"><Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link></p>
      </div>
    </div>
  );
}
