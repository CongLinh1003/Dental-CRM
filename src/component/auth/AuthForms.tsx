'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { AuthAPI } from '../../services/auth';
import { toast } from 'react-toastify';

// Local type for login response data to avoid importing from services and keep types explicit
interface LoginData {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  username?: string;
  email?: string;
  role?: string;
  cookies_set?: boolean | string;
  [key: string]: unknown;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: { name?: string; avatarUrl?: string; [key: string]: string | undefined }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { usernameOrEmail: email, password };
      const res = await AuthAPI.login(payload, { saveCookies: rememberMe });
      if (res.success) {
        try { localStorage.setItem('rememberMe', String(rememberMe)); } catch {}
        const data: LoginData | undefined = res.data as LoginData | undefined;
        if (data && data.access_token) {
          try { localStorage.setItem('accessToken', data.access_token as string); } catch {}
          if (data.refresh_token && data.cookies_set !== true && data.cookies_set !== 'true') {
            try { localStorage.setItem('refreshToken', data.refresh_token as string); } catch {}
          }
          const userObj = {
            name: (data.username as string) || (data.email as string) || email,
            avatarUrl: '/penguin.png',
            ...data,
          } as { name?: string; avatarUrl?: string; [key: string]: unknown };
          try { localStorage.setItem('user', JSON.stringify(userObj)); } catch {}
          onSuccess?.(userObj as { name?: string; avatarUrl?: string; [key: string]: string | undefined });
          onClose();
        } else {
          try {
            const who = await AuthAPI.whoami();
            if (who.success) {
              const userObj = {
                name: who.data.username || who.data.name || email,
                avatarUrl: (who.data.avatarUrl as string) || '/penguin.png',
                ...who.data,
              } as { name?: string; avatarUrl?: string; [key: string]: unknown };
              try { localStorage.setItem('user', JSON.stringify(userObj)); } catch {}
              onSuccess?.(userObj as { name?: string; avatarUrl?: string; [key: string]: string | undefined });
            } else {
              const fallback = { name: email, avatarUrl: '/penguin.png' };
              try { localStorage.setItem('user', JSON.stringify(fallback)); } catch {}
            }
          } catch {
            const fallback = { name: email, avatarUrl: '/penguin.png' };
            try { localStorage.setItem('user', JSON.stringify(fallback)); } catch {}
          }
        }

        onClose();
        toast.success("Đăng nhập thành công",{
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        window.location.reload();
      } else {
        alert((res && res.message) ? res.message : 'Login failed (see console)');
      }
    } catch (err) {
      const error = err as unknown;
      let serverMsg = '';
      if (typeof error === 'object' && error !== null) {
        serverMsg =
          (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (error as { message?: string }).message ||
          '';
      }
      alert(serverMsg || 'Login error (see console)');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { username: userName, email, password };
      const res = await AuthAPI.register(payload);
      if (res.success) {
        alert(res.message || 'Register successful');
        setIsRegistering(false);
      } else {
        alert(res.message || 'Register failed');
      }
    } catch (err) {
      const error = err as unknown;
      let serverMsg = '';
      if (typeof error === 'object' && error !== null) {
        serverMsg =
          (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (error as { message?: string }).message ||
          '';
      }
      alert(serverMsg || 'Register error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      try { localStorage.setItem('rememberMe', String(rememberMe)); } catch {}
      const url = await AuthAPI.oauth2GoogleUrl({ rememberMe, saveCookies: rememberMe });
      window.location.href = url;
    } catch (err) {
      alert('Unable to start Google sign-in.');
    }
  };

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { y: '-100vh', opacity: 0 },
    visible: { y: '0', opacity: 1, transition: { duration: 0.5, damping: 25, stiffness: 500 } },
    exit: { y: '100vh', opacity: 0 },
  };

  if (!isOpen) return null;

  return (
    <motion.div className="absolute w-full h-screen top-0 left-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-3xl" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
      <motion.div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl mx-4 md:mx-0 relative" variants={modalVariants} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          {isRegistering ? (
            <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Image src="/LOGO/Logo_Horizontal_Light_1-1024x237.png.webp" alt="Logo" width={200} height={100} className="mb-8 mx-auto" />
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-purple-700">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-purple-700">{t('name')}</label>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-purple-700">{t('phone')}</label>
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-purple-700">{t('password')}</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none" required />
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md transition duration-300 hover:bg-purple-700">{t('register')}</motion.button>
              </form>
              <button onClick={() => setIsRegistering(false)} className="w-full mt-4 text-center text-purple-600 font-medium hover:underline">Bạn đã có tài khoản? Đăng nhập ngay</button>
            </motion.div>
          ) : (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Image src="/LOGO/Logo_Horizontal_Light_1-1024x237.png.webp" alt="Logo" width={200} height={100} className="mb-4 mx-auto" />
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-purple-700">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-purple-700">Mật khẩu</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none" required />
                </div>

                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <label htmlFor="remember" className="text-sm text-gray-600">{t('remember')}</label>
                </div>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-gradient-to-bl from-purple-500 hover:from-yellow-600 hover:to-purple-600 to-yellow-600 text-white font-semibold py-3 rounded-md transition duration-300 hover:bg-blue-700">{t('login')}</motion.button>

                <motion.button type="button" onClick={handleGoogleLogin} aria-label="Sign in with Google" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full mt-2 border border-gray-300 flex items-center justify-center gap-3 py-2 rounded-md bg-white text-gray-800">
                  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block">
                    <path fill="#EA4335" d="M24 9.5c3.9 0 7.3 1.4 10 3.9l7.4-7.4C36.1 2.7 30.4 0 24 0 14 0 5.3 5.7 1.6 14.1l8.9 6.9C12.5 15 17.8 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3.5-2.4 6.4-5 8.4l8 6.2C43.7 38 46.5 31.7 46.5 24.5z"/>
                    <path fill="#FBBC05" d="M10.5 28.9c-.6-1.8-.6-3.6 0-5.4L1.6 16.6C.6 18.8 0 21.3 0 24c0 2.7.6 5.2 1.6 7.4l8.9-6.5z"/>
                    <path fill="#34A853" d="M24 48c6.5 0 12.2-2.1 16.3-5.7l-8-6.3c-2.3 1.5-5.2 2.4-8.3 2.4-6.2 0-11.5-4.5-12.9-10.5L1.6 31.1C5.3 39.5 14 45.2 24 45.2z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </motion.button>
              </form>
              <button onClick={() => setIsRegistering(true)} className="w-full mt-4 text-center text-blue-600 font-medium hover:underline">Bạn chưa có tài khoản? Đăng ký ngay</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
