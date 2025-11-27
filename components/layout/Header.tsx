// components/layout/Header.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Menu, User, X, LogOut } from 'lucide-react';
import LoginForm from '../auth/LoginForm';
import { useAuth } from '@/lib/useAuth';

interface HeaderProps {
  unreadCount?: number;
  onToggleSidebar?: () => void;
}

export function Header({ unreadCount = 5, onToggleSidebar }: HeaderProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  // close when clicking outside
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!panelRef.current) return;
      if (panelRef.current.contains(e.target as Node)) return;
      setShowLogin(false);
    }
    if (showLogin) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [showLogin]);

  // close user menu when clicking outside
  useEffect(() => {
    function onDocUser(e: MouseEvent) {
      if (!userMenuRef.current) return;
      if (userMenuRef.current.contains(e.target as Node)) return;
      setShowUserMenu(false);
    }
    if (showUserMenu) document.addEventListener('mousedown', onDocUser);
    return () => document.removeEventListener('mousedown', onDocUser);
  }, [showUserMenu]);

  const handleLogout = async () => {
    const { signOut } = await import('firebase/auth');
    const { auth } = await import('@/lib/firebaseClient');
    if (auth) {
      await signOut(auth);
      router.push('/');
      router.refresh();
    }
    setShowUserMenu(false);
  };

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-20">
      {/* Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 sm:p-2 md:hidden text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu size={18} className="sm:w-5 sm:h-5" />
        </button>
        <div className="relative w-full">
          <Search size={16} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4 relative flex-shrink-0">{/* Notifications */}
        <button className="relative p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} className="sm:w-5 sm:h-5" />
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User / Login trigger */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200 relative">
          {user ? (
            // Logged in: show user email and logout menu
            <>
              <button
                onClick={() => setShowUserMenu((s) => !s)}
                className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 hover:bg-gray-100 px-2 sm:px-3 py-1 rounded-lg"
                aria-label="User menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-xs sm:text-sm hidden md:block text-left">
                  <p className="font-medium text-gray-900 truncate max-w-[100px] lg:max-w-[140px]">{user.displayName || 'User'}</p>
                  <p className="text-gray-500 text-xs truncate max-w-[100px] lg:max-w-[140px]">{user.email}</p>
                </div>
              </button>

              {/* User menu dropdown */}
              {showUserMenu && (
                <div ref={userMenuRef} className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                  <div className="px-3 sm:px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            // Not logged in: show login button
            <button
              onClick={() => setShowLogin((s) => !s)}
              className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 hover:bg-gray-100 px-2 sm:px-3 py-1 rounded-lg"
              aria-label="Open login"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                <User size={14} className="sm:w-4 sm:h-4" />
              </div>
              <div className="text-xs sm:text-sm hidden md:block">
                <p className="font-medium text-gray-900">Account</p>
                <p className="text-gray-500 text-xs">Sign in / Up</p>
              </div>
            </button>
          )}

          {/* Attached login panel (top-right) - only show when not logged in */}
          {!user && showLogin && (
            <div ref={panelRef} className="absolute right-0 top-full mt-3 w-[90vw] max-w-[360px] sm:max-w-[420px] z-30">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b">
                  <div className="text-sm font-medium">Welcome</div>
                  <button onClick={() => setShowLogin(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-3 sm:p-4">
                  <LoginForm compact onLogin={() => { setShowLogin(false); router.refresh(); }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
