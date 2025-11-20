'use client';

import MessagesPanel from '@/components/dashboard/MessagesPanel';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      <MessagesPanel />
    </div>
  );
}
