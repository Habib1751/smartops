'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, Zap, Package, AlertCircle, CheckCircle, Clock, TrendingUp, X, Calendar, MapPin, Wrench, Info } from 'lucide-react';
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
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-600 mt-1">View and track all available equipment</p>
        </div>
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

                {/* Footer Action */}
                <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(eq.equipment_id)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    View Details
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
    </div>
  );
}
