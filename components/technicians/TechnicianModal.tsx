'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  mode: 'create' | 'edit';
}

export default function TechnicianModal({ isOpen, onClose, onSubmit, initialData, mode }: TechnicianModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    skill_level: 'intermediate',
    specializations: [] as string[],
    hourly_rate: 0,
    daily_rate: 0,
    overtime_rate: 0,
    travel_rate: 0,
    certifications: [] as string[],
    license_expiry_date: '',
    preferred_notification_method: 'whatsapp',
    whatsapp_number: '',
    notes: '',
    average_rating: 0,
    total_events_worked: 0,
  });

  const [specializationInput, setSpecializationInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        role: initialData.role || '',
        skill_level: initialData.skill_level || 'intermediate',
        specializations: initialData.specializations || [],
        hourly_rate: initialData.hourly_rate || 0,
        daily_rate: initialData.daily_rate || 0,
        overtime_rate: initialData.overtime_rate || 0,
        travel_rate: initialData.travel_rate || 0,
        certifications: initialData.certifications || [],
        license_expiry_date: initialData.license_expiry_date || '',
        preferred_notification_method: initialData.preferred_notification_method || 'whatsapp',
        whatsapp_number: initialData.whatsapp_number || '',
        notes: initialData.notes || '',
        average_rating: initialData.average_rating || 0,
        total_events_worked: initialData.total_events_worked || 0,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        phone: '',
        email: '',
        role: '',
        skill_level: 'intermediate',
        specializations: [],
        hourly_rate: 0,
        daily_rate: 0,
        overtime_rate: 0,
        travel_rate: 0,
        certifications: [],
        license_expiry_date: '',
        preferred_notification_method: 'whatsapp',
        whatsapp_number: '',
        notes: '',
        average_rating: 0,
        total_events_worked: 0,
      });
    }
  }, [initialData, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name?.trim()) {
      alert('Name is required');
      return;
    }
    if (!formData.phone?.trim()) {
      alert('Phone is required');
      return;
    }
    if (!formData.role?.trim()) {
      alert('Role is required');
      return;
    }
    
    // Clean the data before submitting
    const cleanedData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || null,
      role: formData.role.trim(),
      skill_level: formData.skill_level,
      specializations: formData.specializations.filter(s => s.trim()),
      hourly_rate: formData.hourly_rate || 0,
      daily_rate: formData.daily_rate || 0,
      overtime_rate: formData.overtime_rate || null,
      travel_rate: formData.travel_rate || null,
      certifications: formData.certifications.filter(c => c.trim()),
      license_expiry_date: formData.license_expiry_date?.trim() || null,
      preferred_notification_method: formData.preferred_notification_method,
      whatsapp_number: formData.whatsapp_number?.trim() || null,
      notes: formData.notes?.trim() || null,
      average_rating: formData.average_rating || 0,
      total_events_worked: formData.total_events_worked || 0,
    };
    
    console.log('🔵 Form submitting cleaned data:', cleanedData);
    onSubmit(cleanedData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const addSpecialization = () => {
    if (specializationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, specializationInput.trim()]
      }));
      setSpecializationInput('');
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (certificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }));
      setCertificationInput('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New Technician' : 'Edit Technician'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., John Doe"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Equipment Operator"
                />
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="skill_level"
                  value={formData.skill_level}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="junior">Junior</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="senior">Senior</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* License Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry Date
                </label>
                <input
                  type="date"
                  name="license_expiry_date"
                  value={formData.license_expiry_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Preferred Notification Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Notification
                </label>
                <select
                  name="preferred_notification_method"
                  value={formData.preferred_notification_method}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Rates & Compensation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50.00"
                />
              </div>

              {/* Daily Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Rate <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="daily_rate"
                  value={formData.daily_rate}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="400.00"
                />
              </div>

              {/* Overtime Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overtime Rate
                </label>
                <input
                  type="number"
                  name="overtime_rate"
                  value={formData.overtime_rate}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="75.00"
                />
              </div>

              {/* Travel Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Rate
                </label>
                <input
                  type="number"
                  name="travel_rate"
                  value={formData.travel_rate}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25.00"
                />
              </div>

              {/* Average Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Rating
                </label>
                <input
                  type="number"
                  name="average_rating"
                  value={formData.average_rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
                <p className="text-xs text-gray-500 mt-1">Rating from 0 to 5 (e.g., 4.5)</p>
              </div>

              {/* Total Events Worked */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Events Worked
                </label>
                <input
                  type="number"
                  name="total_events_worked"
                  value={formData.total_events_worked}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Number of events this technician has worked</p>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Specializations</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={specializationInput}
                onChange={(e) => setSpecializationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Excavation, Crane Operation"
              />
              <button
                type="button"
                onClick={addSpecialization}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpecialization(index)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Certifications</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={certificationInput}
                onChange={(e) => setCertificationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., CDL, OSHA"
              />
              <button
                type="button"
                onClick={addCertification}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="hover:text-green-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about this technician..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'create' ? 'Create Technician' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
