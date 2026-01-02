'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  DollarSign, 
  User, 
  CheckCircle, 
  Clock, 
  XCircle,
  Send,
  Edit2,
  Trash2,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  fetchAssignments, 
  createAssignment, 
  updateAssignment, 
  deleteAssignment,
  bulkSendInvitations,
  bulkUpdatePayment
} from '@/lib/api';
import toast from 'react-hot-toast';
import AssignmentModal from '@/components/assignments/AssignmentModal';

type Assignment = {
  assignment_id: string;
  event_id: string;
  technician_id: string;
  technician_name: string;
  technician_phone: string;
  event_code: string;
  artist_name: string | null;
  event_type: string;
  event_status: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  event_location: string;
  venue_name: string;
  role_for_event: string;
  call_time: string;
  estimated_finish_time: string | null;
  agreed_rate: number;
  total_hours_worked: number | null;
  total_payment: number;
  payment_status: 'pending' | 'approved' | 'paid' | 'disputed';
  payment_date: string | null;
  attendance_status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  performance_rating: number | null;
  notes: string | null;
  invitation_sent: boolean;
  invitation_sent_date: string | null;
  confirmed: boolean;
  confirmed_date: string | null;
  confirmation_method: string | null;
  created_at: string;
  updated_at: string | null;
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; assignmentId: string | null; name: string }>({ isOpen: false, assignmentId: null, name: '' });
  
  // Filters
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter assignments based on search term and filters
  const filteredAssignments = assignments.filter((assignment) => {
    if (!searchTerm && !paymentStatusFilter && !attendanceStatusFilter) return true;
    
    const matchesSearch = !searchTerm || (
      assignment.technician_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.artist_name && assignment.artist_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      assignment.event_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.event_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.role_for_event.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesPaymentStatus = !paymentStatusFilter || assignment.payment_status === paymentStatusFilter;
    const matchesAttendanceStatus = !attendanceStatusFilter || assignment.attendance_status === attendanceStatusFilter;
    
    return matchesSearch && matchesPaymentStatus && matchesAttendanceStatus;
  });

  // Initial load
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: 1,
        per_page: 100,
      };
      
      const response = await fetchAssignments(params);
      
      if (response?.data) {
        setAssignments(response.data);
      } else if (Array.isArray(response)) {
        // If response is directly an array
        setAssignments(response);
      } else {
        setAssignments([]);
      }

    
    } catch (error: any) {
      console.error('❌ Error fetching assignments:', error);
      setError(error.message || 'Failed to fetch assignments');
      setAssignments([]);
    } finally{
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (assignmentData: any) => {
    try {
      await createAssignment(assignmentData);
      toast.success('Assignment created successfully');
      setIsModalOpen(false);
      setEditingAssignment(null);
      loadAssignments();
    } catch (error: any) {
      console.error('❌ Error creating assignment:', error);
      
      // Provide specific error messages
      if (error.message && error.message.includes('uuid')) {
        toast.error('Invalid UUID format. Please check Event ID and Technician ID.', {
          duration: 5000,
        });
      } else if (error.message && error.message.includes('column e.event_name')) {
        toast.error('Backend Error: CREATE endpoint needs SQL fix. Contact backend team.', {
          duration: 6000,
        });
      } else {
        toast.error('Failed to create assignment: ' + error.message, {
          duration: 5000,
        });
      }
    }
  };

  const handleEditAssignment = async (assignmentData: any) => {
    if (!editingAssignment) return;
    
    try {
      await updateAssignment(editingAssignment.assignment_id, assignmentData);
      toast.success('Assignment updated successfully');
      setIsModalOpen(false);
      setEditingAssignment(null);
      loadAssignments();
    } catch (error: any) {
      console.error('❌ Error updating assignment:', error);
      
      // Provide specific error messages
      if (error.message && error.message.includes('uuid')) {
        toast.error('Invalid UUID format. Please check Event ID and Technician ID.', {
          duration: 5000,
        });
      } else {
        toast.error('Failed to update assignment: ' + error.message);
      }
    }
  };

  const handleDeleteAssignment = (id: string) => {
    const assignment = assignments.find(a => a.assignment_id === id);
    const eventDisplay = assignment?.artist_name || assignment?.event_code || 'event';
    const name = assignment ? `${assignment.technician_name} for ${eventDisplay}` : 'this assignment';
    
    setDeleteConfirmation({ isOpen: true, assignmentId: id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.assignmentId) return;
    
    try {
      await deleteAssignment(deleteConfirmation.assignmentId);
      toast.success('Assignment deleted successfully');
      setDeleteConfirmation({ isOpen: false, assignmentId: null, name: '' });
      loadAssignments();
    } catch (error: any) {
      console.error('❌ Error deleting assignment:', error);
      toast.error('Failed to delete assignment: ' + error.message);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, assignmentId: null, name: '' });
  };

  const handleBulkSendInvitations = async () => {
    if (selectedAssignments.length === 0) {
      toast.error('Please select assignments first');
      return;
    }
    
    try {
      await bulkSendInvitations(selectedAssignments);
      toast.success(`Invitations sent to ${selectedAssignments.length} technician(s)`);
      setSelectedAssignments([]);
      loadAssignments();
    } catch (error: any) {
      console.error('❌ Error sending invitations:', error);
      toast.error('Failed to send invitations: ' + error.message);
    }
  };

  const handleBulkUpdatePayment = async (status: string) => {
    if (selectedAssignments.length === 0) {
      toast.error('Please select assignments first');
      return;
    }
    
    try {
      const paymentDate = status === 'paid' ? new Date().toISOString().split('T')[0] : undefined;
      await bulkUpdatePayment(selectedAssignments, status, paymentDate);
      toast.success(`Payment status updated for ${selectedAssignments.length} assignment(s)`);
      setSelectedAssignments([]);
      loadAssignments();
    } catch (error: any) {
      console.error('❌ Error updating payment:', error);
      toast.error('Failed to update payment: ' + error.message);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedAssignments(prev => 
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAssignments.length === filteredAssignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(filteredAssignments.map(a => a.assignment_id));
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (assignment: Assignment) => {
    setModalMode('edit');
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      disputed: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getAttendanceStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-gray-100 text-gray-800 border-gray-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      no_show: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date;
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    return time;
  };

  // Calculate stats
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.payment_status === 'pending').length,
    paid: assignments.filter(a => a.payment_status === 'paid').length,
    confirmed: assignments.filter(a => a.attendance_status === 'confirmed').length,
    totalAmount: assignments.reduce((sum, a) => sum + (Number(a.total_payment) || 0), 0),
    pendingAmount: assignments.filter(a => a.payment_status === 'pending').reduce((sum, a) => sum + (Number(a.total_payment) || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 w-5 h-5 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Assignments</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <button
                onClick={loadAssignments}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Assignments Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage crew assignments and payments</p>
        </div>
        <button 
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto" 
          onClick={openCreateModal}
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assignments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.confirmed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payment</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">${stats.pendingAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">${stats.totalAmount.toFixed(0)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by technician, event, venue, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Status</label>
              <select
                value={attendanceStatusFilter}
                onChange={(e) => setAttendanceStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedAssignments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                {selectedAssignments.length} assignment(s) selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={handleBulkSendInvitations}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                Send Invitations
              </button>
              <button
                onClick={() => handleBulkUpdatePayment('approved')}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Approve Payment
              </button>
              <button
                onClick={() => handleBulkUpdatePayment('paid')}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Mark as Paid
              </button>
              <button
                onClick={() => setSelectedAssignments([])}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={filteredAssignments.length > 0 && selectedAssignments.length === filteredAssignments.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role & Schedule
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Calendar className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-lg font-semibold mb-2">No assignments found</p>
                      <p className="text-sm">
                        {searchTerm || paymentStatusFilter || attendanceStatusFilter
                          ? 'Try adjusting your filters'
                          : 'Click "New Assignment" to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment.assignment_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAssignments.includes(assignment.assignment_id)}
                        onChange={() => toggleSelection(assignment.assignment_id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{assignment.technician_name}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {assignment.technician_phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {assignment.artist_name || assignment.event_code}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {assignment.event_location || assignment.venue_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(assignment.event_date)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.role_for_event}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(assignment.call_time)}
                            {assignment.estimated_finish_time && ` - ${formatTime(assignment.estimated_finish_time)}`}
                          </div>
                        </div>
                        {assignment.total_hours_worked && (
                          <div className="text-xs text-gray-500 mt-1">
                            {assignment.total_hours_worked}h worked
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          ${(Number(assignment.total_payment) || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Rate: ${Number(assignment.agreed_rate) || 0}/hr
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPaymentStatusColor(assignment.payment_status)}`}>
                          {assignment.payment_status}
                        </span>
                        <br />
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getAttendanceStatusColor(assignment.attendance_status)}`}>
                          {assignment.attendance_status}
                        </span>
                        {assignment.performance_rating && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                            ⭐ {assignment.performance_rating}/5
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(assignment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.assignment_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === 'create' ? handleCreateAssignment : handleEditAssignment}
        initialData={modalMode === 'edit' ? editingAssignment : undefined}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
                  <p className="text-red-100 text-sm mt-0.5">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p className="text-gray-700 text-base leading-relaxed">
                Are you sure you want to delete the assignment for <span className="font-semibold text-gray-900">{deleteConfirmation.name}</span>?
              </p>
              <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">
                    This will permanently remove this assignment from the system. All associated data will be lost.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
