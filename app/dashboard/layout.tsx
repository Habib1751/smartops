// app/dashboard/layout.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../lib/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
// import { MessagingPanel } from '@/components/whatsapp/MessagingPanel';
import { MessagingPanel } from '@/components/layout/whatsapp/MessagingPanel';
import { Toaster } from 'react-hot-toast';
// ❌ REMOVE THIS LINE: import './globals.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // If still loading auth state, show a simple loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show ONLY the login form - nothing else
  if (!user) {
    return <LoginForm onLogin={() => router.refresh()} />;
  }

  // User is authenticated - show the full dashboard with sidebar and header
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900">
      <Sidebar {...({ unreadCount: 5, mobileOpen: sidebarOpen, onClose: () => setSidebarOpen(false) } as any)} />
      <div className="flex-1 flex flex-col ml-0 md:ml-64 min-w-0">
        <Header unreadCount={5} onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 mt-16">
          {children}
        </main>
      </div>
      <MessagingPanel 
        isOpen={messagingOpen}
        onClose={() => setMessagingOpen(false)}
      />
      <Toaster position="top-right" />
    </div>
  );
}
