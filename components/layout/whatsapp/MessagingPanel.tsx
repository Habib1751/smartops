// components/whatsapp/MessagingPanel.tsx
'use client';

import { useState } from 'react';
import { X, Search, Send, ArrowLeft } from 'lucide-react';
import { mockMessages, mockClients } from '@/data/mockData';
import {toast} from 'react-hot-toast';

interface MessagingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessagingPanel({ isOpen, onClose }: MessagingPanelProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success('Message sent! (Mock - Backend needed)');
      setMessage('');
    }
  };

  if (!isOpen) return null;

  // Group messages by client
  const conversationMap = new Map<string, any>();
  mockMessages.forEach((msg) => {
    if (!conversationMap.has(msg.client_id)) {
      const client = mockClients.find((c) => c.client_id === msg.client_id);
      conversationMap.set(msg.client_id, {
        client_id: msg.client_id,
        name: client?.name || 'Unknown',
        phone: client?.phone || '',
        lastMessage: msg.content,
        lastMessageTime: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unreadCount: msg.is_read ? 0 : 1,
        messages: [{ id: msg.message_id, text: msg.content, time: new Date(msg.created_at).toLocaleTimeString(), sent: msg.direction === 'outbound' }],
      });
    }
  });

  const conversations = Array.from(conversationMap.values());
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedContact = selectedClientId ? conversations.find((c) => c.client_id === selectedClientId) : null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-whatsapp-green">
          <h2 className="text-lg font-semibold text-white">WhatsApp Messages</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        {!selectedContact ? (
          <>
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.client_id}
                  onClick={() => setSelectedClientId(conv.client_id)}
                  className="w-full px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {conv.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-whatsapp-green rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200 bg-gray-50">
              <button 
                onClick={() => setSelectedClientId(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold">
                {selectedContact?.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{selectedContact?.name}</h3>
                <p className="text-xs text-gray-500">{selectedContact?.phone}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-chat-bg space-y-2">
              {selectedContact?.messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      msg.sent
                        ? 'bg-[#DCF8C6] text-gray-900'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-whatsapp-green hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
