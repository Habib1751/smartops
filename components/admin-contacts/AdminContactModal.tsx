'use client';

import { useState, useEffect } from 'react';
import { X, User, Phone, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

type AdminContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  mode: 'create' | 'edit';
};

export default function AdminContactModal({ isOpen, onClose, onSubmit, initialData, mode }: AdminContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'general',
    whatsapp_number: '',
    is_primary: false,
    is_active: true,
    display_name: '',
    availability_start: '08:00:00',
    availability_end: '20:00:00',
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        role: initialData.role || 'general',
        whatsapp_number: initialData.whatsapp_number || '',
        is_primary: initialData.is_primary || false,
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
        display_name: initialData.display_name || '',
        availability_start: initialData.availability_start || '08:00:00',
        availability_end: initialData.availability_end || '20:00:00',
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        role: 'general',
        whatsapp_number: '',
        is_primary: false,
        is_active: true,
        display_name: '',
        availability_start: '08:00:00',
        availability_end: '20:00:00',
      });
    }
  }, [initialData, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate WhatsApp number format (E.164: +[country code][number], 7-15 digits)
    if (!formData.whatsapp_number.match(/^\+\d{7,15}$/)) {
      toast.error('WhatsApp number must be in international format (E.164), e.g. +972501234567 or +923012345678');
      return;
    }
    
    const submitData: any = {
      name: formData.name,
      role: formData.role,
      whatsapp_number: formData.whatsapp_number,
      is_primary: formData.is_primary,
      is_active: formData.is_active,
      availability_start: formData.availability_start,
      availability_end: formData.availability_end,
    };

    if (formData.display_name) {
      submitData.display_name = formData.display_name;
    }

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {mode === 'create' ? 'Add Admin Contact' : 'Edit Admin Contact'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Add a new WhatsApp contact for admin communications.' 
                : 'Update admin contact information.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="general">General</option>
                  <option value="sales">Sales</option>
                  <option value="technical">Technical</option>
                  <option value="support">Support</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">
                  <Phone className="inline w-4 h-4 mr-1" />
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="+972501234567"
                  required
                  pattern="\+\d{7,15}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-mono"
                />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: +[country code][number] (E.164). Placeholder shows an Israeli example (+972...), other country numbers are accepted.
                  </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">
                  Display Name (shown to clients)
                </label>
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleChange}
                  placeholder="חיים מהצוות"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Name displayed to customers (can be in Hebrew)
                </p>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Availability Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="availability_start"
                  value={formData.availability_start.substring(0, 5)}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability_start: e.target.value + ':00' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="availability_end"
                  value={formData.availability_end.substring(0, 5)}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability_end: e.target.value + ':00' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
            </div>
          </div>

          {/* Status Checkboxes */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Status</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_primary"
                  checked={formData.is_primary}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-black">Primary Contact</span>
                  <p className="text-xs text-gray-500">This will be the default contact for this role</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-black">Active</span>
                  <p className="text-xs text-gray-500">Contact is currently available to receive messages</p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {mode === 'create' ? 'Add Contact' : 'Update Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
