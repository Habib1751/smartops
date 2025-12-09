'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  leadId: string;
  leadPhone: string;
}

export default function MessageModal({ isOpen, onClose, onSubmit, leadId, leadPhone }: MessageModalProps) {
  const [formData, setFormData] = useState({
    lead_id: leadId,
    content: '',
    direction: 'outbound' as 'inbound' | 'outbound',
    channel: 'whatsapp',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, lead_id: leadId });
    // Reset form
    setFormData({
      lead_id: leadId,
      content: '',
      direction: 'outbound',
      channel: 'whatsapp',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold text-white">Send Message</h2>
            <p className="text-green-100 text-sm mt-1">To: {leadPhone}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-500 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Direction <span className="text-red-500">*</span>
            </label>
            <select
              name="direction"
              value={formData.direction}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="outbound">Outbound (You → Customer)</option>
              <option value="inbound">Inbound (Customer → You)</option>
            </select>
          </div>

          {/* Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel <span className="text-red-500">*</span>
            </label>
            <select
              name="channel"
              value={formData.channel}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>

            </select>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Type your message here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.content.length} characters
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
