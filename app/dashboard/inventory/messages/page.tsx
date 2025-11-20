// app/dashboard/messages/page.tsx
'use client';

import { useState } from 'react';
import { Search, Send, ArrowLeft } from 'lucide-react';
import { mockConversations } from '@/data/mockData';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success('Message sent! (Backend needed)');
      setMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-lg shadow h-full flex">
        {/* Sidebar - Conversations List */}
        <div className={`${selectedContact ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-gray-200 flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
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

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedContact(conv)}
                className={`w-full px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                  selectedContact?.id === conv.id ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {conv.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
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
        </div>

        {/* Chat Window */}
        <div className={`${selectedContact ? 'block' : 'hidden md:block'} w-full md:w-2/3 flex flex-col`}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200 bg-gray-50">
                <button 
                  onClick={() => setSelectedContact(null)}
                  className="md:hidden p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                  <p className="text-xs text-gray-500">{selectedContact.phone}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-chat-bg space-y-3">
                {selectedContact.messages?.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-lg shadow-sm ${
                        msg.sent
                          ? 'bg-[#DCF8C6] text-gray-900'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-xs text-gray-500 mt-1 block">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-whatsapp-green hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg font-medium">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
