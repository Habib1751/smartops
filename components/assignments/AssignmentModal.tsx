'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, User, DollarSign, Clock, MapPin, Star } from 'lucide-react';
import { fetchTechnicians } from '@/lib/api';
import toast from 'react-hot-toast';

type AssignmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  mode: 'create' | 'edit';
};

export default function AssignmentModal({ isOpen, onClose, onSubmit, initialData, mode }: AssignmentModalProps) {
  const [formData, setFormData] = useState({
    event_id: '',
    technician_id: '',
    role_for_event: '',
    call_time: '',
    estimated_finish_time: '',
    agreed_rate: '',
    total_hours_worked: '',
    payment_status: 'pending',
    attendance_status: 'scheduled',
    performance_rating: '',
    notes: '',
  });
  
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        event_id: initialData.event_id || '',
        technician_id: initialData.technician_id || '',
        role_for_event: initialData.role_for_event || '',
        call_time: initialData.call_time || '',
        estimated_finish_time: initialData.estimated_finish_time || '',
        agreed_rate: initialData.agreed_rate?.toString() || '',
        total_hours_worked: initialData.total_hours_worked?.toString() || '',
        payment_status: initialData.payment_status || 'pending',
        attendance_status: initialData.attendance_status || 'scheduled',
        performance_rating: initialData.performance_rating?.toString() || '',
        notes: initialData.notes || '',
      });
    } else if (mode === 'create') {
      setFormData({
        event_id: '',
        technician_id: '',
        role_for_event: '',
        call_time: '',
        estimated_finish_time: '',
        agreed_rate: '',
        total_hours_worked: '',
        payment_status: 'pending',
        attendance_status: 'scheduled',
        performance_rating: '',
        notes: '',
      });
    }
  }, [initialData, mode, isOpen]);

  // Load technicians when modal opens in create mode
  useEffect(() => {
    if (isOpen && mode === 'create') {
      loadTechnicians();
    }
  }, [isOpen, mode]);

  const loadTechnicians = async () => {
    try {
      setLoadingTechnicians(true);
      const response = await fetchTechnicians({ is_active: true, per_page: 100 });
      setTechnicians(response.data || []);
    } catch (error) {
      console.error('Failed to load technicians:', error);
      // Don't show error toast - just log it
      setTechnicians([]);
    } finally {
      setLoadingTechnicians(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: any = {
      role_for_event: formData.role_for_event,
      call_time: formData.call_time,
      agreed_rate: parseFloat(formData.agreed_rate),
    };

    if (mode === 'create') {
      submitData.event_id = formData.event_id;
      submitData.technician_id = formData.technician_id;
    }

    if (formData.estimated_finish_time) {
      submitData.estimated_finish_time = formData.estimated_finish_time;
    }
    
    if (formData.total_hours_worked) {
      submitData.total_hours_worked = parseFloat(formData.total_hours_worked);
    }
    
    if (formData.performance_rating) {
      submitData.performance_rating = parseInt(formData.performance_rating);
    }
    
    if (formData.notes) {
      submitData.notes = formData.notes;
    }

    // Only include these in edit mode
    if (mode === 'edit') {
      submitData.payment_status = formData.payment_status;
      submitData.attendance_status = formData.attendance_status;
    }

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Create New Assignment' : 'Edit Assignment'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Fill required fields to create assignment. Payment will be calculated automatically after event.' 
                : 'Update assignment details. Payment = Rate × Hours Worked.'}
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
          {/* Assignment Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Assignment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mode === 'create' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="event_id"
                      value={formData.event_id}
                      onChange={handleChange}
                      placeholder="Enter event UUID"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Get event ID from Events section. Format: 550e8400-e29b-41d4-a716-446655440000
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technician <span className="text-red-500">*</span>
                    </label>
                    {loadingTechnicians ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                        Loading technicians...
                      </div>
                    ) : (
                      <select
                        name="technician_id"
                        value={formData.technician_id}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select technician...</option>
                        {technicians.map((tech) => (
                          <option key={tech.technician_id} value={tech.technician_id}>
                            {tech.name} - {tech.phone}
                          </option>
                        ))}
                      </select>
                    )}
                    {technicians.length === 0 && !loadingTechnicians && (
                      <p className="text-xs text-red-500 mt-1">
                        No active technicians found. Please add technicians first.
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className={mode === 'edit' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role for Event <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role_for_event"
                  value={formData.role_for_event}
                  onChange={handleChange}
                  placeholder="e.g., Lead Operator, Audio Technician"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="call_time"
                  value={formData.call_time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Finish Time
                </label>
                <input
                  type="time"
                  name="estimated_finish_time"
                  value={formData.estimated_finish_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {mode === 'edit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    name="total_hours_worked"
                    value={formData.total_hours_worked}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.5"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Payment
            </h3>
            <div className={`grid grid-cols-1 ${mode === 'edit' ? 'md:grid-cols-2' : ''} gap-4`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agreed Rate (per hour) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="agreed_rate"
                    value={formData.agreed_rate}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {mode === 'create' && (
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Total payment will be calculated automatically: Rate × Hours Worked (after event)
                  </p>
                )}
              </div>

              {mode === 'edit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Status & Rating Section */}
          {mode === 'edit' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                Status & Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attendance Status
                  </label>
                  <select
                    name="attendance_status"
                    value={formData.attendance_status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Performance Rating (1-5)
                  </label>
                  <input
                    type="number"
                    name="performance_rating"
                    value={formData.performance_rating}
                    onChange={handleChange}
                    placeholder="Rate 1-5"
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or comments..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
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
              {mode === 'create' ? 'Create Assignment' : 'Update Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
