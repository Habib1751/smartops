'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, DollarSign, Users, Clock, FileText } from 'lucide-react';
import { createEvent, updateEvent } from '@/lib/api';
import toast from 'react-hot-toast';

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData?: any;
  mode: 'create' | 'edit';
};

export default function EventModal({ isOpen, onClose, onSubmit, initialData, mode }: EventModalProps) {
  const [formData, setFormData] = useState({
    event_code: '',
    client_id: '',
    lead_id: '',
    event_status: 'pending',
    event_type: 'Concert',
    event_date: '',
    event_location: '',
    artist_name: '',
    estimated_guests: '',
    event_start_time: '',
    event_end_time: '',
    load_in_time: '',
    load_out_time: '',
    sound_check_time: '',
    total_working_hours: '',
    base_package_price: '',
    travel_fee: '',
    total_price: '',
    payment_status: 'pending',
    deposit_paid: false,
    technicians_assigned: false,
    equipment_prepared: false,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        event_code: initialData.event_code || '',
        client_id: initialData.client_id || '',
        lead_id: initialData.lead_id || '',
        event_status: initialData.event_status || 'pending',
        event_type: initialData.event_type || 'Concert',
        event_date: initialData.event_date || '',
        event_location: initialData.event_location || '',
        artist_name: initialData.artist_name || '',
        estimated_guests: initialData.estimated_guests?.toString() || '',
        event_start_time: initialData.event_start_time?.substring(0, 5) || '',
        event_end_time: initialData.event_end_time?.substring(0, 5) || '',
        load_in_time: initialData.load_in_time?.substring(0, 5) || '',
        load_out_time: initialData.load_out_time?.substring(0, 5) || '',
        sound_check_time: initialData.sound_check_time?.substring(0, 5) || '',
        total_working_hours: initialData.total_working_hours?.toString() || '',
        base_package_price: initialData.base_package_price?.toString() || '',
        travel_fee: initialData.travel_fee?.toString() || '',
        total_price: initialData.total_price?.toString() || '',
        payment_status: initialData.payment_status || 'pending',
        deposit_paid: initialData.deposit_paid || false,
        technicians_assigned: initialData.technicians_assigned || false,
        equipment_prepared: initialData.equipment_prepared || false,
        notes: initialData.special_notes || '',
      });
    } else if (mode === 'create') {
      setFormData({
        event_code: '',
        client_id: '',
        lead_id: '',
        event_status: 'pending',
        event_type: 'Concert',
        event_date: '',
        event_location: '',
        artist_name: '',
        estimated_guests: '',
        event_start_time: '',
        event_end_time: '',
        load_in_time: '',
        load_out_time: '',
        sound_check_time: '',
        total_working_hours: '',
        base_package_price: '',
        travel_fee: '',
        total_price: '',
        payment_status: 'pending',
        deposit_paid: false,
        technicians_assigned: false,
        equipment_prepared: false,
        notes: '',
      });
    }
  }, [initialData, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Calculate financial fields
      const basePrice = formData.base_package_price ? parseFloat(formData.base_package_price) : 0;
      const travelFee = formData.travel_fee ? parseFloat(formData.travel_fee) : 0;
      const totalPrice = formData.total_price ? parseFloat(formData.total_price) : (basePrice + travelFee);
      
      // Calculate subtotal_before_vat (required field)
      const subtotalBeforeVat = totalPrice || 0;
      const vatAmount = subtotalBeforeVat * 0.17; // 17% VAT in Israel
      
      const submitData: any = {
        // Required fields - always send with defaults
        event_status: formData.event_status,
        event_type: formData.event_type,
        total_working_hours: formData.total_working_hours ? parseInt(formData.total_working_hours) : 0,
        base_package_price: basePrice,
        travel_fee: travelFee,
        subtotal_before_vat: subtotalBeforeVat,
        vat_amount: vatAmount,
        total_price: totalPrice,
        payment_status: formData.payment_status || 'pending',
        deposit_paid: formData.deposit_paid || false,
        technicians_assigned: formData.technicians_assigned || false,
        equipment_prepared: formData.equipment_prepared || false,
      };

      // Optional fields - only send if provided
      if (formData.event_code) submitData.event_code = formData.event_code;
      if (formData.event_date) submitData.event_date = formData.event_date;
      if (formData.event_location) submitData.event_location = formData.event_location;
      if (formData.artist_name) submitData.artist_name = formData.artist_name;
      if (formData.estimated_guests) submitData.estimated_guests = parseInt(formData.estimated_guests);
      if (formData.event_start_time) submitData.event_start_time = `${formData.event_start_time}:00`;
      if (formData.event_end_time) submitData.event_end_time = `${formData.event_end_time}:00`;
      if (formData.load_in_time) submitData.load_in_time = `${formData.load_in_time}:00`;
      if (formData.load_out_time) submitData.load_out_time = `${formData.load_out_time}:00`;
      if (formData.sound_check_time) submitData.sound_check_time = `${formData.sound_check_time}:00`;
      if (formData.notes) submitData.special_notes = formData.notes;
      if (formData.client_id && formData.client_id.trim()) submitData.client_id = formData.client_id;
      if (formData.lead_id && formData.lead_id.trim()) submitData.lead_id = formData.lead_id;

      if (mode === 'create') {
        await createEvent(submitData);
        toast.success('Event created successfully');
      } else {
        await updateEvent(initialData.event_id, submitData);
        toast.success('Event updated successfully');
      }
      
      onSubmit();
    } catch (error: any) {
      console.error('Failed to save event:', error);
      toast.error(error.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Auto-calculate total price when base price or travel fee changes
  useEffect(() => {
    const basePrice = parseFloat(formData.base_package_price) || 0;
    const travelFee = parseFloat(formData.travel_fee) || 0;
    const total = basePrice + travelFee;
    if (total > 0) {
      setFormData(prev => ({ ...prev, total_price: total.toString() }));
    }
  }, [formData.base_package_price, formData.travel_fee]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {mode === 'create' ? 'Create New Event' : 'Edit Event'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Add a new event to the system.' 
                : 'Update event information.'}
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
          {/* Basic Event Information */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Basic Event Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Event Code
                </label>
                <input
                  type="text"
                  name="event_code"
                  value={formData.event_code}
                  onChange={handleChange}
                  placeholder="EVT-2024-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Client ID (Optional)
                </label>
                <input
                  type="text"
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  placeholder="UUID (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if not linked to a client</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Lead ID (Optional)
                </label>
                <input
                  type="text"
                  name="lead_id"
                  value={formData.lead_id}
                  onChange={handleChange}
                  placeholder="UUID (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if not linked to a lead</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Artist/Event Name
                </label>
                <input
                  type="text"
                  name="artist_name"
                  value={formData.artist_name}
                  onChange={handleChange}
                  placeholder="Concert Event"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Event Type
                </label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="Concert">Concert</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Festival">Festival</option>
                  <option value="Conference">Conference</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Event Status
                </label>
                <select
                  name="event_status"
                  value={formData.event_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  <Users className="inline w-4 h-4 mr-1" />
                  Estimated Guests
                </label>
                <input
                  type="number"
                  name="estimated_guests"
                  value={formData.estimated_guests}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Event Location
                </label>
                <input
                  type="text"
                  name="event_location"
                  value={formData.event_location}
                  onChange={handleChange}
                  placeholder="Main Arena, Tel Aviv"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
            </div>
          </div>

          {/* Timing Information */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Event Timing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Load-in Time
                </label>
                <input
                  type="time"
                  name="load_in_time"
                  value={formData.load_in_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Sound Check Time
                </label>
                <input
                  type="time"
                  name="sound_check_time"
                  value={formData.sound_check_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Event Start Time
                </label>
                <input
                  type="time"
                  name="event_start_time"
                  value={formData.event_start_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Event End Time
                </label>
                <input
                  type="time"
                  name="event_end_time"
                  value={formData.event_end_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Load-out Time
                </label>
                <input
                  type="time"
                  name="load_out_time"
                  value={formData.load_out_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Total Working Hours
                </label>
                <input
                  type="number"
                  name="total_working_hours"
                  value={formData.total_working_hours}
                  onChange={handleChange}
                  placeholder="8"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                <p className="text-xs text-gray-500 mt-1">Total hours from load-in to load-out</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Base Package Price (₪)
                </label>
                <input
                  type="number"
                  name="base_package_price"
                  value={formData.base_package_price}
                  onChange={handleChange}
                  placeholder="40000"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Travel Fee (₪)
                </label>
                <input
                  type="number"
                  name="travel_fee"
                  value={formData.travel_fee}
                  onChange={handleChange}
                  placeholder="2000"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Total Price (₪)
                </label>
                <input
                  type="number"
                  name="total_price"
                  value={formData.total_price}
                  onChange={handleChange}
                  placeholder="50000"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Checkboxes */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Event Status</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="deposit_paid"
                  checked={formData.deposit_paid}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-black">Deposit Paid</span>
                  <p className="text-xs text-gray-500">Client has paid the deposit amount</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="technicians_assigned"
                  checked={formData.technicians_assigned}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-black">Technicians Assigned</span>
                  <p className="text-xs text-gray-500">All required technicians have been assigned</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="equipment_prepared"
                  checked={formData.equipment_prepared}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-black">Equipment Prepared</span>
                  <p className="text-xs text-gray-500">All equipment is ready for the event</p>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Additional Notes
            </h3>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Special requirements, notes, or instructions..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
