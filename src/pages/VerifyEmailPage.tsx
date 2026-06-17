// src/pages/VerifyEmailPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error');
  const [message, setMessage] = useState(token ? 'Verifying your email...' : 'Invalid or missing verification token.');

  useEffect(() => {
    if (!token) {
      return;
    }

    const verify = async () => {
      try {
        console.log('[VerifyEmail] Verifying email with token:', token);
        const response = await api.post('/auth/verify-email', { token });
        console.log('[VerifyEmail] Response received:', response);
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err: unknown) {
        console.error('[VerifyEmail] Error occurred:', err);
        if (axios.isAxiosError(err)) {
          const message = err.response?.data?.message || 'Verification failed. The token may be expired or invalid.';
          console.error('[VerifyEmail] API Error Response:', {
            status: err.response?.status,
            data: err.response?.data,
            message,
          });
          setStatus('error');
          setMessage(message);
          return;
        }
        setStatus('error');
        setMessage('Verification failed. The token may be expired or invalid.');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        {status === 'loading' && <div className="text-blue-600 font-semibold">{message}</div>}
        
        {status === 'success' && (
          <div>
            <div className="text-green-600 font-bold text-xl mb-2">✓ Success</div>
            <p className="text-gray-600 mb-4">{message}</p>
            <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-red-600 font-bold text-xl mb-2">✕ Error</div>
            <p className="text-gray-600 mb-4">{message}</p>
            <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
