// components/layout/Header.tsx
'use client';

import { Bell, Search, Menu, User } from 'lucide-react';

interface HeaderProps {
  unreadCount?: number;
  onToggleSidebar?: () => void;
}

export function Header({ unreadCount = 5, onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-10">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 md:hidden text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>
        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            <User size={16} />
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-medium text-gray-900">Adiel</p>
            <p className="text-gray-500 text-xs">user@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
