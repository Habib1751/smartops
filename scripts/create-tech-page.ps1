$content = @'
'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Phone, Mail, Award, TrendingUp, User, DollarSign, Calendar, Zap, Edit2, Trash2 } from 'lucide-react';
import { fetchTechnicians, createTechnician, updateTechnician, deleteTechnician } from '@/lib/api';
import toast from 'react-hot-toast';
import TechnicianModal from '@/components/technicians/TechnicianModal';

type Technician = {
  technician_id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  skill_level: string;
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
  const [skillLevelFilter, setSkillLevelFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;

  // Initial load
  useEffect(() => {
    loadTechnicians();
  }, [currentPage, skillLevelFilter, activeFilter]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (searchTerm !== undefined) {
      const timer = setTimeout(() => {
        setCurrentPage(1); // Reset to first page on search
        loadTechnicians();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const loadTechnicians = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: currentPage,
        per_page: perPage,
        is_active: activeFilter,
      };
      if (searchTerm) params.search = searchTerm;
      if (skillLevelFilter) params.skill_level = skillLevelFilter;
      
      const response = await fetchTechnicians(params);
      
      if (response?.data) {
        setTechnicians(response.data);
        setTotal(response.total || 0);
        setTotalPages(response.total_pages || 1);
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
      const response = await createTechnician(technicianData);
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
      await updateTechnician(editingTechnician.technician_id, technicianData);
      toast.success('Technician updated successfully');
      setIsModalOpen(false);
      setEditingTechnician(null);
      loadTechnicians();
    } catch (error: any) {
      console.error('❌ Error updating technician:', error);
      toast.error('Failed to update technician: ' + error.message);
    }
  };

  const handleDeleteTechnician = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate ${name}? They will be soft-deleted.`)) {
      return;
    }
    
    try {
      await deleteTechnician(id, true); // Soft delete
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

  if (loading && technicians.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading technicians...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rest of the component continues in next message due to length */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technicians</h1>
          <p className="text-gray-600 mt-1">Manage your crew and technicians</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Technician
        </button>
      </div>
      
      <TechnicianModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTechnician(null);
        }}
        onSubmit={modalMode === 'create' ? handleCreateTechnician : handleEditTechnician}
        initialData={editingTechnician}
        mode={modalMode}
      />
    </div>
  );
}
'@

Set-Content -Path "app\dashboard\technicians\page.tsx" -Value $content -Encoding UTF8
Write-Host "Technicians page created successfully!"
