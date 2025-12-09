'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, MessageSquare, Calendar, User, Clock, Send } from 'lucide-react';
import { createMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import MessageModal from '@/components/messages/MessageModal';

interface Message {
  message_id: string;
  client_id: string | null;
  lead_id: string;
  event_id: string | null;
  channel: string;
  direction: 'inbound' | 'outbound';
  content: string;
  voice_url: string | null;
  transcription: string | null;
  sentiment: string | null;
  responded_by: string | null;
  response_time_seconds: number | null;
  created_at: string;
  metadata: Record<string, any>;
}

interface Lead {
  lead_id: string;
  phone: string;
  lead_status: string;
  lead_source: string;
  event_type: string | null;
  event_date: string | null;
  event_location: string | null;
  estimated_guests: number | null;
  message_count: number;
  created_at: string;
}

export default function MessagesPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    if (leadId) {
      fetchMessages();
      fetchLeadDetails();
    }
  }, [leadId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?lead_id=${leadId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const result = await response.json();
      
      // Sort messages by created_at (oldest first for conversation flow)
      const sortedMessages = (result.data || []).sort((a: Message, b: Message) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      setMessages(sortedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    }
  };

  const fetchLeadDetails = async () => {
    try {
      console.log('🔍 Fetching lead details for lead_id:', leadId);
      const response = await fetch(`/api/leads?lead_id=${leadId}`);
      if (!response.ok) throw new Error('Failed to fetch lead');
      const result = await response.json();
      
      console.log('📦 Lead API response:', result);
      
      if (result.data && result.data.length > 0) {
        // Find the exact lead by lead_id
        const exactLead = result.data.find((l: Lead) => l.lead_id === leadId);
        if (exactLead) {
          console.log('✅ Found exact lead:', exactLead.phone, exactLead.lead_id);
          setLead(exactLead);
        } else {
          console.warn('⚠️ Exact lead not found, using first lead');
          setLead(result.data[0]);
        }
      } else {
        console.warn('⚠️ No lead data received');
      }
    } catch (err) {
      console.error('❌ Error fetching lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageData: any) => {
    try {
      await createMessage(messageData);
      toast.success('Message sent successfully');
      setIsMessageModalOpen(false);
      fetchMessages(); // Reload messages
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      toast.error('Failed to send message: ' + error.message);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(msg => {
      const dateKey = new Date(msg.created_at).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    
    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">{lead?.phone || 'Unknown'}</h1>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                  <span className="capitalize truncate">{lead?.lead_source || 'whatsapp'}</span>
                  <span>•</span>
                  <span className="capitalize truncate">{lead?.lead_status || 'active'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Info Summary */}
          {lead && (
            <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm flex-shrink-0">
              {lead.event_type && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="truncate">{lead.event_type}</span>
                </div>
              )}
              {lead.event_date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(lead.event_date).toLocaleDateString()}</span>
                </div>
              )}
              {lead.estimated_guests && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{lead.estimated_guests} guests</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <MessageSquare className="w-4 h-4" />
                <span>{messages.length} messages</span>
              </div>
              <button
                onClick={() => setIsMessageModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          )}
        </div>
        
        {/* Mobile Info Summary */}
        {lead && (
          <div className="lg:hidden mt-3 flex items-center gap-3 text-xs text-gray-600 overflow-x-auto pb-1">
            {lead.event_type && (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Calendar className="w-3 h-3" />
                <span>{lead.event_type}</span>
              </div>
            )}
            {lead.estimated_guests && (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <User className="w-3 h-3" />
                <span>{lead.estimated_guests} guests</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-green-600 font-semibold whitespace-nowrap">
              <MessageSquare className="w-3 h-3" />
              <span>{messages.length} messages</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {Object.entries(messageGroups).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-3 sm:my-4">
                <div className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                  {formatDate(msgs[0].created_at)}
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-2 sm:space-y-3">
                {msgs.map((message) => (
                  <div
                    key={message.message_id}
                    className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                        message.direction === 'outbound'
                          ? 'bg-green-600 text-white rounded-br-none'
                          : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <div
                        className={`flex items-center gap-2 mt-1.5 sm:mt-2 text-xs ${
                          message.direction === 'outbound' ? 'text-green-100' : 'text-gray-500'
                        }`}
                      >
                        <span>{formatTime(message.created_at)}</span>
                        {message.direction === 'outbound' && (
                          <span className="ml-1">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">No messages yet</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">This conversation will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {lead && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          onSubmit={handleSendMessage}
          leadId={leadId}
          leadPhone={lead.phone}
        />
      )}
    </div>
  );
}
