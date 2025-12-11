'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, Zap, Package, AlertCircle, CheckCircle, Clock, TrendingUp, X, Calendar, MapPin, Wrench, Info, Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Equipment {
  equipment_id: string;
  category_name: string;
  equipment_name: string;
  equipment_code: string;
  brand: string;
  model: string;
  quantity_total: number;
  quantity_available: number;
  condition_status: string;
  daily_rental_value: string;
}

interface EquipmentDetails extends Equipment {
  category_id: string;
  equipment_type: string;
  ownership_type: string;
  is_available: boolean;
  replacement_cost: string;
  depreciation_rate: string;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  maintenance_notes: string | null;
  specifications: any;
  power_requirements: string;
  weight_kg: string;
  dimensions: string;
  storage_location: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assignments: Assignment[];
}

interface Assignment {
  assignment_id: string;
  event_id: string;
  equipment_id: string;
  quantity_assigned: number;
  assigned_date: string;
  returned_date: string | null;
  condition_on_return: string | null;
  damage_notes: string | null;
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<{ category_id: string; category_name: string }[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentDetails | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState({
    equipment_name: '',
    equipment_code: '',
    brand: '',
    model: '',
    category_id: '',
    quantity_total: 0,
    quantity_available: 0,
    condition_status: 'good',
    daily_rental_value: '',
  });

  useEffect(() => {
    fetchEquipment();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/inventory_categories');
      const data = await response.json();
      
      if (data.data) {
        setCategoryList(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      const data = await response.json();
      
      if (data.data) {
        setEquipment(data.data);
        setFilteredEquipment(data.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.data.map((eq: Equipment) => eq.category_name))];
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipmentDetails = async (equipmentId: string) => {
    try {
      setDetailsLoading(true);
      const response = await fetch(`/api/inventory?equipment_id=${equipmentId}`);
      const data = await response.json();
      
      if (data.data) {
        setSelectedEquipment(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch equipment details:', error);
      toast.error('Failed to load equipment details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = (equipmentId: string) => {
    fetchEquipmentDetails(equipmentId);
  };

  const handleCloseModal = () => {
    setSelectedEquipment(null);
  };

  const handleOpenFormModal = (equipment?: EquipmentDetails) => {
    if (equipment) {
      setEditingEquipment(equipment);
      setFormData({
        equipment_name: equipment.equipment_name,
        equipment_code: equipment.equipment_code,
        brand: equipment.brand,
        model: equipment.model,
        category_id: equipment.category_id,
        quantity_total: equipment.quantity_total,
        quantity_available: equipment.quantity_available,
        condition_status: equipment.condition_status,
        daily_rental_value: equipment.daily_rental_value,
      });
    } else {
      setEditingEquipment(null);
      setFormData({
        equipment_name: '',
        equipment_code: '',
        brand: '',
        model: '',
        category_id: '',
        quantity_total: 0,
        quantity_available: 0,
        condition_status: 'good',
        daily_rental_value: '',
      });
    }
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingEquipment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingEquipment 
        ? `/api/inventory?equipment_id=${editingEquipment.equipment_id}`
        : '/api/inventory';
      
      const method = editingEquipment ? 'PUT' : 'POST';
      
      console.log(`${method} ${url}`, formData);
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`${method} failed:`, response.status, errorData);
        throw new Error(errorData.error || errorData.message || `Failed to save equipment (${response.status})`);
      }

      const result = await response.json();
      
      // Show success message with new ID if creating
      if (!editingEquipment && result.data?.equipment_id) {
        toast.success(
          <div>
            <p className="font-semibold">Equipment created successfully!</p>
            <p className="text-sm text-gray-600">ID: {result.data.equipment_id}</p>
          </div>,
          { duration: 4000 }
        );
        console.log('✅ New equipment ID:', result.data.equipment_id);
      } else {
        toast.success('Equipment updated successfully');
      }
      
      handleCloseFormModal();
      fetchEquipment();
    } catch (error) {
      console.error('Failed to save equipment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save equipment');
    }
  };

  const handleDelete = async (equipmentId: string, equipmentName: string) => {
    // Show custom confirmation dialog
    setDeleteConfirm({ id: equipmentId, name: equipmentName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      console.log('DELETE /api/inventory?equipment_id=' + deleteConfirm.id);
      
      const response = await fetch(`/api/inventory?equipment_id=${deleteConfirm.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete failed:', response.status, errorData);
        throw new Error(errorData.error || errorData.message || `Failed to delete equipment (${response.status})`);
      }

      toast.success(
        <div>
          <p className="font-semibold">Equipment deleted successfully!</p>
          <p className="text-sm text-gray-600">{deleteConfirm.name}</p>
        </div>,
        { duration: 3000 }
      );
      
      fetchEquipment();
      if (selectedEquipment?.equipment_id === deleteConfirm.id) {
        handleCloseModal();
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete equipment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete equipment');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  useEffect(() => {
    let filtered = equipment;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(eq =>
        eq.equipment_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.equipment_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(eq => eq.category_name === selectedCategory);
    }

    setFilteredEquipment(filtered);
  }, [searchQuery, selectedCategory, equipment]);

  const getConditionColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 100) return { color: 'text-green-600', icon: CheckCircle, label: 'Full Stock' };
    if (percentage >= 50) return { color: 'text-blue-600', icon: TrendingUp, label: 'Available' };
    if (percentage > 0) return { color: 'text-yellow-600', icon: Clock, label: 'Low Stock' };
    return { color: 'text-red-600', icon: AlertCircle, label: 'Out of Stock' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin">
            <Package size={32} className="text-blue-600" />
          </div>
          <p className="mt-4 text-gray-600">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and track all equipment inventory</p>
        </div>
        <button
          onClick={() => handleOpenFormModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Equipment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-semibold">Total Equipment</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{equipment.length}</p>
              <p className="text-xs text-gray-600 mt-1">Unique items</p>
            </div>
            <Package size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-semibold">Available Units</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {equipment.reduce((sum, eq) => sum + eq.quantity_available, 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Ready to use</p>
            </div>
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-semibold">Categories</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{categories.length}</p>
              <p className="text-xs text-gray-600 mt-1">Different types</p>
            </div>
            <TrendingUp size={32} className="text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by equipment name, code, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      {filteredEquipment.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Equipment Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map(eq => {
            const availability = getAvailabilityStatus(eq.quantity_available, eq.quantity_total);
            const AvailabilityIcon = availability.icon;
            
            return (
              <div key={eq.equipment_id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border-t-4 border-blue-500">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{eq.equipment_name}</h3>
                      <p className="text-sm text-gray-500">{eq.equipment_code}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {eq.category_name}
                    </span>
                  </div>

                  {/* Brand & Model */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">{eq.brand}</span> {eq.model}
                    </p>
                  </div>

                  {/* Quantity & Availability */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs text-gray-600 font-semibold">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{eq.quantity_total}</p>
                    </div>
                    <div className={`bg-blue-50 rounded p-3 border-l-4 border-blue-500`}>
                      <p className="text-xs text-gray-600 font-semibold">Available</p>
                      <p className="text-2xl font-bold text-blue-600">{eq.quantity_available}</p>
                    </div>
                  </div>

                  {/* Condition Status */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Condition</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getConditionColor(eq.condition_status)}`}>
                      {eq.condition_status.charAt(0).toUpperCase() + eq.condition_status.slice(1)}
                    </span>
                  </div>

                  {/* Availability Status */}
                  <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded">
                    <AvailabilityIcon size={18} className={availability.color} />
                    <span className={`text-sm font-semibold ${availability.color}`}>
                      {availability.label}
                    </span>
                  </div>

                  {/* Daily Rental Value */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Daily Rental Value</p>
                    <p className="text-2xl font-bold text-green-600">${eq.daily_rental_value}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                  <button
                    onClick={() => handleViewDetails(eq.equipment_id)}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleOpenFormModal(eq as EquipmentDetails)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Equipment"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(eq.equipment_id, eq.equipment_name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Equipment"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-gray-600 text-sm">
        Showing {filteredEquipment.length} of {equipment.length} equipment items
      </div>

      {/* Details Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedEquipment.equipment_name}</h2>
                <p className="text-sm text-gray-500">{selectedEquipment.equipment_code}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin">
                  <Package size={32} className="text-blue-600" />
                </div>
                <p className="mt-4 text-gray-600">Loading details...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info size={20} />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Category</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEquipment.category_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Equipment Type</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEquipment.equipment_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Brand</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEquipment.brand}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Model</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEquipment.model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Ownership</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEquipment.ownership_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Condition</p>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getConditionColor(selectedEquipment.condition_status)}`}>
                        {selectedEquipment.condition_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity & Availability */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package size={20} />
                    Quantity & Availability
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-xs text-gray-600 font-semibold mb-2">Total Quantity</p>
                      <p className="text-3xl font-bold text-blue-600">{selectedEquipment.quantity_total}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-xs text-gray-600 font-semibold mb-2">Available</p>
                      <p className="text-3xl font-bold text-green-600">{selectedEquipment.quantity_available}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <p className="text-xs text-gray-600 font-semibold mb-2">In Use</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {selectedEquipment.quantity_total - selectedEquipment.quantity_available}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap size={20} />
                    Financial Information
                  </h3>
                  <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Daily Rental</p>
                      <p className="text-xl font-bold text-green-600">${selectedEquipment.daily_rental_value}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Replacement Cost</p>
                      <p className="text-xl font-bold text-gray-900">${selectedEquipment.replacement_cost}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Depreciation Rate</p>
                      <p className="text-xl font-bold text-gray-900">{selectedEquipment.depreciation_rate}%</p>
                    </div>
                  </div>
                </div>

                {/* Maintenance */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Wrench size={20} />
                    Maintenance
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Last Maintenance</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Calendar size={16} />
                        {selectedEquipment.last_maintenance_date || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Next Maintenance</p>
                      <p className="text-sm font-medium text-orange-600 flex items-center gap-2">
                        <Calendar size={16} />
                        {selectedEquipment.next_maintenance_date || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {selectedEquipment.maintenance_notes && (
                    <div className="mt-2 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <p className="text-xs text-gray-600 font-semibold mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{selectedEquipment.maintenance_notes}</p>
                    </div>
                  )}
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Power Requirements</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEquipment.power_requirements || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Weight</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEquipment.weight_kg} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Dimensions</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEquipment.dimensions || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Storage Location</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <MapPin size={16} />
                        {selectedEquipment.storage_location || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {selectedEquipment.specifications && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Technical Specifications</p>
                      {typeof selectedEquipment.specifications === 'object' ? (
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(selectedEquipment.specifications).map(([key, value]) => (
                            <div key={key} className="bg-white rounded p-2">
                              <p className="text-xs text-gray-600 font-semibold capitalize">
                                {key.replace(/_/g, ' ')}
                              </p>
                              <p className="text-sm text-gray-900 font-medium">
                                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700">{selectedEquipment.specifications}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Assignments */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Assignment History</h3>
                  {selectedEquipment.assignments && selectedEquipment.assignments.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Event ID</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Quantity</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Assigned Date</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Returned Date</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Return Condition</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedEquipment.assignments.map((assignment) => (
                            <tr key={assignment.assignment_id} className="hover:bg-gray-100">
                              <td className="px-4 py-3 text-sm text-gray-900">{assignment.event_id}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{assignment.quantity_assigned}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{assignment.assigned_date}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {assignment.returned_date || <span className="text-orange-600 font-semibold">In Use</span>}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {assignment.condition_on_return ? (
                                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getConditionColor(assignment.condition_on_return)}`}>
                                    {assignment.condition_on_return}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">No assignment history available</p>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                {selectedEquipment.notes && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Notes</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedEquipment.notes}</p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="pt-4 border-t text-xs text-gray-500">
                  <p>Created: {new Date(selectedEquipment.created_at).toLocaleString()}</p>
                  <p>Last Updated: {new Date(selectedEquipment.updated_at).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Equipment Form Modal (Create/Edit) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseFormModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Equipment Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Equipment Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="equipment_name"
                      value={formData.equipment_name}
                      onChange={(e) => setFormData({ ...formData, equipment_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Equipment Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Equipment Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="equipment_code"
                      value={formData.equipment_code}
                      onChange={(e) => setFormData({ ...formData, equipment_code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {categoryList.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Condition Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Condition Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="condition_status"
                      value={formData.condition_status}
                      onChange={(e) => setFormData({ ...formData, condition_status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>

                  {/* Quantity Total */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity_total"
                      value={formData.quantity_total || ''}
                      onChange={(e) => setFormData({ ...formData, quantity_total: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  {/* Quantity Available */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Available Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity_available"
                      value={formData.quantity_available || ''}
                      onChange={(e) => setFormData({ ...formData, quantity_available: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  {/* Daily Rental Value */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Daily Rental Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="daily_rental_value"
                      value={formData.daily_rental_value}
                      onChange={(e) => setFormData({ ...formData, daily_rental_value: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={handleCloseFormModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {editingEquipment ? 'Update Equipment' : 'Add Equipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Delete Equipment
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 text-center mb-4">
                Are you sure you want to delete this equipment?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Equipment Name:</p>
                <p className="text-lg font-semibold text-red-800">{deleteConfirm.name}</p>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">
                This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Delete Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
