'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthAPI, ApiResponse } from '../../../services/auth';
import { http } from '../../../services/http';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Processing sign-in...');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const username = params.get('username');
        const email = params.get('email');
        const role = params.get('role');
        const cookiesSet = params.get('cookies_set');
        const redirect = params.get('redirect') || '/';

        // If backend returned tokens in query, store them (accessToken always, refreshToken only if cookies not set)
        if (accessToken) {
          try { localStorage.setItem('accessToken', accessToken); } catch {}
          if (refreshToken && cookiesSet !== 'true') {
            try { localStorage.setItem('refreshToken', refreshToken); } catch {}
          }
          // store some basic user info
          const user: Record<string, string> = {};
          if (username) user.username = username;
          if (email) user.email = decodeURIComponent(email);
          if (role) user.role = role;
          try { localStorage.setItem('user', JSON.stringify(user)); } catch {}

          setMessage('Sign-in complete. Redirecting...');
          // give a tiny delay for UX
          setTimeout(() => { if (mounted) router.replace(redirect); }, 600);
          return;
        }

        // If no tokens in query but backend set cookies, try to finish via whoami/refresh
        if (cookiesSet === 'true') {
          setMessage('Finalizing session from server cookies...');
          const who = await AuthAPI.whoami();
          if (who.success) {
            try { localStorage.setItem('user', JSON.stringify(who.data)); } catch {}
            setMessage('Sign-in successful. Redirecting...');
            setTimeout(() => { if (mounted) router.replace(redirect); }, 600);
            return;
          }

          // try refresh via cookie
          try {
            await http.post<ApiResponse<string>>('/api/auth/refresh', {}, { params: { source: 'cookie' } });
          } catch (err) {
            console.warn('Refresh attempt failed', err);
          }

          const who2 = await AuthAPI.whoami();
          if (who2.success) {
            try { localStorage.setItem('user', JSON.stringify(who2.data)); } catch {}
            setMessage('Sign-in successful. Redirecting...');
            setTimeout(() => { if (mounted) router.replace(redirect); }, 600);
            return;
          }
        }

        // Nothing worked
        setMessage('Unable to complete sign-in. Redirecting to login...');
        setTimeout(() => { if (mounted) router.replace('/'); }, 800);
      } catch (err) {
        console.error(err);
        if (mounted) {
          setMessage('An error occurred. Redirecting...');
          setTimeout(() => router.replace('/'), 800);
        }
      }
    })();

    return () => { mounted = false; };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded shadow text-center">
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
}
