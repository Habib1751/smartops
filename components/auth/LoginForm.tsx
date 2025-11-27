"use client";

import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../../lib/firebaseClient';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { signInDemo } from '@/lib/useAuth';

export default function LoginForm({ compact, onLogin }: { compact?: boolean; onLogin?: () => void }) {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    if (!auth) {
      setError('Firebase is not configured');
      setLoading(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Signed in');
      onLogin?.();
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };
 

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!auth) {
      setError('Firebase is not configured');
      setLoading(false);
      return;
    }
    if (!displayName.trim()) return setError('Please enter your name');
    if (password !== passwordConfirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user) {
        await updateProfile(cred.user, { displayName });
        await sendEmailVerification(cred.user);
        setSuccess('Account created. Verification email sent.');
        onLogin?.();
      }
    } catch (err: any) {
      setError(err?.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    resetMessages();
    if (!auth || !googleProvider) {
      setError('Firebase is not configured');
      return;
    }
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin?.();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const handleDemo = () => {
    try {
      signInDemo();
      setSuccess('Signed in as demo user');
      onLogin?.();
    } catch (e) {
      setError('Demo sign-in failed');
    }
  };

  if (user)
    return (
      <div className={
        compact
          ? 'p-4 bg-white rounded-lg shadow-sm w-80'
          : 'p-6 bg-white rounded-lg shadow-md max-w-md mx-auto'
      }>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">{(user.displayName || user.email || '').charAt(0).toUpperCase()}</div>
          <div>
            <h3 className={compact ? 'text-md font-semibold' : 'text-lg font-semibold'}>{user.displayName || 'User'}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    );

  const containerOuter = compact ? '' : 'min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-blue-50';
  const cardClass = compact ? 'w-80 bg-white rounded-lg shadow-sm p-4' : 'w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100';

  return (
    <div className={containerOuter}>
      <div className={cardClass}>
        {!compact && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mb-4 shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-4xl font-bold text-white">S</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-600">Sign in to your SmartOps account</p>
          </div>
        )}

        {/* COMMENTED OUT - Sign In/Sign Up Toggle Buttons (for future use) */}
        {/* <div className={`flex justify-center gap-2 mb-6 ${compact ? 'justify-end' : ''}`}>
          <button
            onClick={() => { setMode('signIn'); resetMessages(); }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${mode === 'signIn' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Sign In
          </button>
          <button
            onClick={() => { setMode('signUp'); resetMessages(); }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${mode === 'signUp' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Sign Up
          </button>
        </div> */}

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
          {error}
        </div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          {success}
        </div>}

        {/* COMMENTED OUT - Sign Up Form (for future use) */}
        {/* {mode === 'signUp' ? (
          <form onSubmit={handleSignUp} className="space-y-4">
        {/* COMMENTED OUT - Sign Up Form (for future use) */}
        {/* {mode === 'signUp' ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                placeholder="Enter your full name" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                placeholder="you@company.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                placeholder="At least 6 characters" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                placeholder="Re-enter your password" 
                type="password" 
                value={passwordConfirm} 
                onChange={(e) => setPasswordConfirm(e.target.value)} 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        ) : ( */}
          <form onSubmit={handleEmailSignIn} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400" 
                placeholder="you@company.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400" 
                placeholder="Enter your password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              {/* <div className="text-right mt-2">
                <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">Forgot password?</a>
              </div> */}
            </div>
            <button 
              disabled={loading} 
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        {/* )} */}

        {/* COMMENTED OUT - Google Sign-in and Demo User (for future use) */}
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {googleProvider ? (
              <button 
                type="button"
                onClick={handleGoogle} 
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            ) : (
              <div className="w-full text-center text-xs text-gray-400 py-3 bg-gray-50 rounded-lg">Google sign-in not configured</div>
            )}

            {!auth && (
              <button 
                type="button"
                onClick={handleDemo} 
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm">
                Continue as Demo User
              </button>
            )}
          </div>
        </div> */}

        {!compact && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              SmartOps Field Service Management
            </p>
            {/* <div className="mt-3 text-xs text-gray-500">
              By continuing, you agree to SmartOps{' '}
              <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}

