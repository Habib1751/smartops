// app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar {...({ unreadCount: 5, mobileOpen: sidebarOpen, onClose: () => setSidebarOpen(false) } as any)} />
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <Header unreadCount={5} onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <main className="flex-1 overflow-y-auto p-6 mt-16">
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
