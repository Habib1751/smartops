'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function LeadModal({ isOpen, onClose, onSubmit }: LeadModalProps) {
  const [formData, setFormData] = useState({
    phone: '',
    lead_source: 'whatsapp',
    event_type: '',
    event_date: '',
    event_location: '',
    estimated_guests: 0,
    priority_level: 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      phone: '',
      lead_source: 'whatsapp',
      event_type: '',
      event_date: '',
      event_location: '',
      estimated_guests: 0,
      priority_level: 'medium',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add New Lead</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>

          {/* Lead Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead Source <span className="text-red-500">*</span>
            </label>
            <select
              name="lead_source"
              value={formData.lead_source}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social_media">Social Media</option>
            </select>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <input
              type="text"
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Wedding, Concert, Corporate"
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Event Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Location
            </label>
            <input
              type="text"
              name="event_location"
              value={formData.event_location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Tel Aviv Convention Center"
            />
          </div>

          {/* Estimated Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Guests
            </label>
            <input
              type="number"
              name="estimated_guests"
              value={formData.estimated_guests}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority Level <span className="text-red-500">*</span>
            </label>
            <select
              name="priority_level"
              value={formData.priority_level}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
