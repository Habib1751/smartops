'use client';

import React, { useState } from 'react';
import { mockMessages, mockClients } from '@/data/mockData';


// Build conversations grouped by client
const conversations = mockClients.map((client: any) => {
  const clientMessages = mockMessages.filter((m: any) => m.client_id === client.client_id);
  const lastMessage = clientMessages[clientMessages.length - 1];
  const unreadCount = clientMessages.filter((m: any) => !m.is_read).length;
  return {
    id: client.client_id,
    name: client.name,
    phone: client.phone,
    lastMessage: lastMessage ? lastMessage.content : '',
    unreadCount,
    messages: clientMessages.map((m: any) => ({
      id: m.message_id,
      text: m.content,
      sent: m.direction === 'outbound',
      created_at: m.created_at,
    })),
  };
});

export default function MessagesPanel() {
  const [active, setActive] = useState(conversations[0]?.id || null);
  const activeConv = conversations.find((c) => c.id === active) || conversations[0];

  return (
    <div className="bg-white rounded-lg shadow flex h-[600px] overflow-hidden">
      <div className="w-80 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Conversations</h3>
        </div>
        {conversations.map((c) => (
          <div key={c.id} onClick={() => setActive(c.id)} className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${active === c.id ? 'bg-gray-50' : ''}`}>
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">{c.lastMessage}</p>
            </div>
            {c.unreadCount > 0 && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{c.unreadCount}</span>}
          </div>
        ))}
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="border-b pb-3 mb-3">
          <h4 className="font-semibold">{activeConv?.name}</h4>
          <p className="text-xs text-gray-500">{activeConv?.phone}</p>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {activeConv?.messages.map((m) => (
            <div key={m.id} className={`${m.sent ? 'self-end bg-blue-600 text-white' : 'self-start bg-gray-100 text-gray-800'} px-4 py-2 rounded-lg max-w-[70%]`}>{m.text}</div>
          ))}
        </div>

        <div className="mt-3">
          <div className="flex gap-2">
            <input placeholder="Type a message" className="flex-1 px-3 py-2 border rounded-lg" />
            <button className="px-4 py-2 bg-whatsapp-green text-white rounded-lg">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
