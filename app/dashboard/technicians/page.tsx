'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Phone, Mail, Calendar, DollarSign, User, Building2, MapPin, TrendingUp, Award, Zap, Edit2, Trash2 } from 'lucide-react';
import { fetchTechnicians, createTechnician, updateTechnician, deleteTechnician } from '@/lib/api';
import toast from 'react-hot-toast';
import TechnicianModal from '@/components/technicians/TechnicianModal';

type Technician = {
  technician_id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  skill_level: 'junior' | 'intermediate' | 'senior' | 'expert';
  specializations: string[];
  hourly_rate: number;
  daily_rate: number;
  overtime_rate: number | null;
  travel_rate: number | null;
  certifications: string[];
  license_expiry_date: string | null;
  preferred_notification_method: string;
  whatsapp_number: string | null;
  notes: string | null;
  total_events_worked: number;
  average_rating: number | null;
  reliability_score: number;
  is_active: boolean;
  availability_calendar: any;
  created_at: string;
  updated_at: string | null;
};

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Filter technicians based on search term
  const filteredTechnicians = technicians.filter((technician) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      technician.name.toLowerCase().includes(search) ||
      technician.phone.toLowerCase().includes(search) ||
      technician.email?.toLowerCase().includes(search) ||
      technician.role.toLowerCase().includes(search) ||
      technician.specializations.some(s => s.toLowerCase().includes(search))
    );
  });

  // Initial load
  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: 1,
        per_page: 100,
        is_active: true,
      };
      
      const response = await fetchTechnicians(params);
      
      if (response?.data) {
        setTechnicians(response.data);
      } else if (!response) {
        setTechnicians([]);
        setError('No data received from API');
      } else {
        setTechnicians([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching technicians:', error);
      setError(error.message || 'Failed to fetch technicians');
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTechnician = async (technicianData: any) => {
    try {
      await createTechnician(technicianData);
      toast.success('Technician created successfully');
      setIsModalOpen(false);
      setEditingTechnician(null);
      loadTechnicians();
    } catch (error: any) {
      console.error('❌ Error creating technician:', error);
      toast.error('Failed to create technician: ' + error.message);
    }
  };

  const handleEditTechnician = async (technicianData: any) => {
    if (!editingTechnician) return;
    
    try {
      console.log('📤 Sending update data:', JSON.stringify(technicianData, null, 2));
      await updateTechnician(editingTechnician.technician_id, technicianData);
      toast.success('Technician updated successfully');
      setIsModalOpen(false);
      setEditingTechnician(null);
      loadTechnicians();
    } catch (error: any) {
      console.error('❌ Error updating technician:', error);
      console.error('❌ Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      toast.error('Failed to update technician: ' + error.message);
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    const technician = technicians.find(t => t.technician_id === id);
    const name = technician?.name || 'this technician';
    
    if (!confirm(`Are you sure you want to deactivate ${name}? They will be soft-deleted.`)) {
      return;
    }
    
    try {
      await deleteTechnician(id, true);
      toast.success('Technician deactivated successfully');
      loadTechnicians();
    } catch (error: any) {
      console.error('❌ Error deleting technician:', error);
      toast.error('Failed to delete technician: ' + error.message);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingTechnician(null);
    setIsModalOpen(true);
  };

  const openEditModal = (technician: Technician) => {
    setModalMode('edit');
    setEditingTechnician(technician);
    setIsModalOpen(true);
  };

  const getSkillLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      junior: 'bg-gray-100 text-gray-800',
      intermediate: 'bg-blue-100 text-blue-800',
      senior: 'bg-purple-100 text-purple-800',
      expert: 'bg-amber-100 text-amber-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date;
    }
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === '') return '-';
    return value;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading technicians...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Technicians</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <p className="text-xs text-red-500 mt-2">Check browser console (F12) for details</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info - HIDDEN for production/client view */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 text-sm">Development Mode</p>
              <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                <div>
                  <span className="text-blue-600">Total Leads:</span>
                  <span className="ml-2 font-bold text-blue-900">{leads.length}</span>
                </div>
                <div>
                  <span className="text-blue-600">Status:</span>
                  <span className="ml-2 font-bold text-blue-900">{loading ? '⏳ Loading' : '✅ Loaded'}</span>
                </div>
                <div>
                  <span className="text-blue-600">Data Source:</span>
                  <span className="ml-2 font-bold text-blue-900">External API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Technicians Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your crew and technicians</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto" onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Add Technician
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Technicians</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{technicians.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Active</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-900 mt-1">
                {technicians.filter(t => t.is_active).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-900 mt-1">
                {technicians.length > 0 ? (technicians.reduce((sum, t) => sum + (Number(t.average_rating) || 0), 0) / technicians.length).toFixed(1) : '0.0'}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Events</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-900 mt-1">
                {technicians.reduce((sum, t) => sum + t.total_events_worked, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search technicians by name, role, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Technicians List - Card Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTechnicians.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-8 sm:p-12">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <User className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 text-gray-300" />
              <p className="text-lg sm:text-xl font-semibold mb-2">No technicians found</p>
              <p className="text-xs sm:text-sm text-center">
                {searchTerm 
                  ? 'Try adjusting your search' 
                  : 'Click "Add Technician" to get started'}
              </p>
            </div>
          </div>
        ) : (
          filteredTechnicians.map((technician) => (
            <div
              key={technician.technician_id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                {/* Header - Name and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center shadow-md ${
                      technician.is_active 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                        : 'bg-gray-400'
                    }`}>
                      <User className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{technician.name}</h3>
                      <p className="text-sm text-gray-600">{technician.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          technician.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {technician.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSkillLevelColor(technician.skill_level)}`}>
                          {technician.skill_level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{technician.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{technician.email}</span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Rate/hr</div>
                    <div className="text-sm font-bold text-gray-900">${technician.hourly_rate}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Rating</div>
                    <div className="text-sm font-bold text-gray-900">
                      {technician.average_rating ? `⭐ ${Number(technician.average_rating).toFixed(1)}` : 'N/A'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Events</div>
                    <div className="text-sm font-bold text-gray-900">{technician.total_events_worked}</div>
                  </div>
                </div>

                {/* Specializations */}
                {technician.specializations && technician.specializations.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-600 mb-2">Specializations</div>
                    <div className="flex flex-wrap gap-1">
                      {technician.specializations.slice(0, 3).map((spec, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800">
                          {spec}
                        </span>
                      ))}
                      {technician.specializations.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                          +{technician.specializations.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(technician)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTechnician(technician.technician_id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Footer Info */}
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Created: {formatDate(technician.created_at)}</span>
                    {technician.license_expiry_date && (
                      <span>License: {new Date(technician.license_expiry_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Technician Modal */}
      <TechnicianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === 'create' ? handleCreateTechnician : handleEditTechnician}
        initialData={modalMode === 'edit' ? editingTechnician : undefined}
        mode={modalMode}
      />
    </div>
  );
}
