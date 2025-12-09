'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  mode: 'create' | 'edit';
}

export default function InventoryModal({ isOpen, onClose, onSubmit, initialData, mode }: InventoryModalProps) {
  const [formData, setFormData] = useState({
    category_id: 1,
    equipment_name: '',
    equipment_code: '',
    equipment_type: '',
    brand: '',
    model: '',
    ownership_type: 'Owned',
    quantity_total: 0,
    quantity_available: 0,
    is_available: true,
    daily_rental_value: 0,
    replacement_cost: 0,
    depreciation_rate: 0,
    condition_status: 'Good',
    last_maintenance_date: '',
    next_maintenance_date: '',
    maintenance_notes: '',
    specifications: '',
    power_requirements: '',
    weight_kg: 0,
    dimensions: '',
    storage_location: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        category_id: initialData.category_id || 1,
        equipment_name: initialData.equipment_name || '',
        equipment_code: initialData.equipment_code || '',
        equipment_type: initialData.equipment_type || '',
        brand: initialData.brand || '',
        model: initialData.model || '',
        ownership_type: initialData.ownership_type || 'Owned',
        quantity_total: initialData.quantity_total || 0,
        quantity_available: initialData.quantity_available || 0,
        is_available: initialData.is_available !== false,
        daily_rental_value: initialData.daily_rental_value || 0,
        replacement_cost: initialData.replacement_cost || 0,
        depreciation_rate: initialData.depreciation_rate || 0,
        condition_status: initialData.condition_status || 'Good',
        last_maintenance_date: initialData.last_maintenance_date || '',
        next_maintenance_date: initialData.next_maintenance_date || '',
        maintenance_notes: initialData.maintenance_notes || '',
        specifications: initialData.specifications || '',
        power_requirements: initialData.power_requirements || '',
        weight_kg: initialData.weight_kg || 0,
        dimensions: initialData.dimensions || '',
        storage_location: initialData.storage_location || '',
        notes: initialData.notes || '',
      });
    } else {
      // Reset form for create mode
      setFormData({
        category_id: 1,
        equipment_name: '',
        equipment_code: '',
        equipment_type: '',
        brand: '',
        model: '',
        ownership_type: 'Owned',
        quantity_total: 0,
        quantity_available: 0,
        is_available: true,
        daily_rental_value: 0,
        replacement_cost: 0,
        depreciation_rate: 0,
        condition_status: 'Good',
        last_maintenance_date: '',
        next_maintenance_date: '',
        maintenance_notes: '',
        specifications: '',
        power_requirements: '',
        weight_kg: 0,
        dimensions: '',
        storage_location: '',
        notes: '',
      });
    }
  }, [initialData, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New Equipment' : 'Edit Equipment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="equipment_name"
                value={formData.equipment_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Excavator CAT 320"
              />
            </div>

            {/* Equipment Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Code
              </label>
              <input
                type="text"
                name="equipment_code"
                value={formData.equipment_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., EXC-001"
              />
            </div>

            {/* Category ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Equipment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Type
              </label>
              <input
                type="text"
                name="equipment_type"
                value={formData.equipment_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Heavy Machinery"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Caterpillar"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 320"
              />
            </div>

            {/* Ownership Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ownership Type
              </label>
              <select
                name="ownership_type"
                value={formData.ownership_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Owned">Owned</option>
                <option value="Leased">Leased</option>
                <option value="Rented">Rented</option>
              </select>
            </div>

            {/* Quantity Total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity_total"
                value={formData.quantity_total}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Quantity Available */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Quantity
              </label>
              <input
                type="number"
                name="quantity_available"
                value={formData.quantity_available}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Condition Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition Status <span className="text-red-500">*</span>
              </label>
              <select
                name="condition_status"
                value={formData.condition_status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Maintenance Required">Maintenance Required</option>
              </select>
            </div>

            {/* Daily Rental Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Rental Value ($)
              </label>
              <input
                type="number"
                name="daily_rental_value"
                value={formData.daily_rental_value}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Replacement Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Replacement Cost ($)
              </label>
              <input
                type="number"
                name="replacement_cost"
                value={formData.replacement_cost}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Storage Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Location
              </label>
              <input
                type="text"
                name="storage_location"
                value={formData.storage_location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Warehouse A"
              />
            </div>

            {/* Last Maintenance Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Maintenance Date
              </label>
              <input
                type="date"
                name="last_maintenance_date"
                value={formData.last_maintenance_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Next Maintenance Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Maintenance Date
              </label>
              <input
                type="date"
                name="next_maintenance_date"
                value={formData.next_maintenance_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Weight (kg) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 10m x 3m x 3m"
              />
            </div>
          </div>

          {/* Specifications - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specifications
            </label>
            <textarea
              name="specifications"
              value={formData.specifications}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Technical specifications..."
            />
          </div>

          {/* Maintenance Notes - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance Notes
            </label>
            <textarea
              name="maintenance_notes"
              value={formData.maintenance_notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Maintenance history and notes..."
            />
          </div>

          {/* Notes - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Any additional information..."
            />
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
              {mode === 'create' ? 'Create Equipment' : 'Update Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
