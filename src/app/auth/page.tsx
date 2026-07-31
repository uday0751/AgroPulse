'use client';

import React, { useState, useLayoutEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { setAuthCookie } from '@/lib/auth-helpers';
import { 
  signInWithEmailAndPassword, 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import gsap from 'gsap';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

declare global { 
  interface Window { 
    recaptchaVerifier: any; 
    confirmationResult: any; 
  } 
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.auth-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
      gsap.from('.anim-item', {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSuccess = (uid: string) => {
    setAuthCookie(uid);
    router.push(redirectPath);
    router.refresh();
  };

  const handleDemoAuth = () => {
    handleSuccess('demo-user-id');
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      setupRecaptcha();
      const phoneNumber = `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send OTP.');
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      handleSuccess(result.user.uid);
    } catch (err: any) {
      console.error(err);
      setError('Invalid OTP.');
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const onEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      handleSuccess(result.user.uid);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed.');
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      handleSuccess(result.user.uid);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign in failed.');
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4" ref={containerRef}>
      <div className="auth-card bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8 anim-item">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm">
            🌿
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AgroPulse</h1>
          <p className="text-gray-500 mt-2 text-center">Welcome back to your farming assistant</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm anim-item text-center">
            {error}
          </div>
        )}

        {demoMode && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl anim-item text-center">
            <p className="text-orange-800 font-medium mb-3 text-sm">Demo Mode: Click below to enter as demo user</p>
            <button
              onClick={handleDemoAuth}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Enter as Demo User
            </button>
          </div>
        )}

        <div className="flex space-x-2 mb-6 anim-item bg-gray-100 p-1 rounded-xl">
          <button
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'phone' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('phone')}
          >
            Phone OTP
          </button>
          <button
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'email' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('email')}
          >
            Email & Password
          </button>
        </div>

        {activeTab === 'phone' ? (
          <div className="anim-item">
            {!otpSent ? (
              <form onSubmit={onSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm font-medium">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      placeholder="Enter 10-digit number"
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>
                <div id="recaptcha-container"></div>
                <button
                  type="submit"
                  disabled={loading || phone.length !== 10}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={onVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 text-center tracking-widest text-lg font-bold text-gray-900 bg-white"
                    placeholder="------"
                    required
                    pattern="[0-9]{6}"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify & Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-sm text-green-600 hover:text-green-500 font-medium text-center"
                >
                  Change phone number
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={onEmailLogin} className="space-y-4 anim-item">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  placeholder="farmer@agropulse.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login'}
            </button>
          </form>
        )}

        <div className="mt-6 anim-item">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <button
            onClick={onGoogleSignIn}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 anim-item">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-semibold text-green-600 hover:text-green-500">
            Sign Up <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
