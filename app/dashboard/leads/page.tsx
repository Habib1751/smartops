'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Phone, Mail, Calendar, DollarSign, User, Building2, MapPin, TrendingUp, MessageSquare } from 'lucide-react';
import { fetchLeads } from '@/lib/api';

type Lead = {
  // Core identification
  lead_id: string;
  client_id: string | null;
  phone: string;
  
  // Lead info
  lead_source: string;
  lead_status: string;
  priority_level: string;
  priority_score: number;
  
  // Event details
  event_type: string | null;
  event_date: string | null;
  event_location: string | null;
  distance_zone: string | null;
  distance_km: number | null;
  estimated_guests: number | null;
  
  // Technical details
  technical_requirements: string | null;
  artist_name: string | null;
  technical_rider_url: string | null;
  electricity_requirements: string | null;
  
  // Scheduling
  load_in_time: string | null;
  sound_check_time: string | null;
  event_start_time: string | null;
  event_end_time: string | null;
  load_out_time: string | null;
  total_working_hours: number | null;
  
  // Venue details
  is_outdoor: boolean;
  stage_size: string | null;
  special_constraints: string | null;
  
  // Follow-up
  missing_fields: string | null;
  last_followup_date: string | null;
  followup_count: number;
  
  // Availability
  availability_checked: boolean;
  availability_status: string | null;
  availability_details: string | null;
  
  // Timestamps & messages
  created_at: string;
  updated_at: string;
  message_count: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    loadLeads();
  }, []);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        loadLeads();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const loadLeads = async () => {
    console.log('🔄 loadLeads START');
    setLoading(true);
    setError(null);
    
    try {
      const params: { search?: string } = {};
      if (searchTerm) params.search = searchTerm;
      
      console.log('🔍 Fetching leads with params:', params);
      const rawData = await fetchLeads(params);
      console.log('📦 Raw API response:', rawData);
      console.log('📊 Response type:', typeof rawData, 'Is Array:', Array.isArray(rawData));
      
      if (!rawData) {
        console.warn('⚠️ No data received from API');
        setLeads([]);
        setError('No data received from API');
        return;
      }
      
      const mappedData = Array.isArray(rawData) ? rawData.map(mapExternalLead) : [];
      console.log('✅ Mapped leads data:', mappedData);
      console.log('📈 Total leads:', mappedData.length);
      
      setLeads(mappedData);
    } catch (error: any) {
      console.error('❌ Error fetching leads:', error);
      setError(error.message || 'Failed to fetch leads');
      setLeads([]);
    } finally {
      setLoading(false);
      console.log('🏁 loadLeads END');
    }
  };

  // Map external API fields - return data as-is from backend
  const mapExternalLead = (lead: any): Lead => {
    console.log('🔄 Mapping lead from API:', lead);
    // Return the lead data exactly as it comes from the API
    return lead as Lead;
  };

  // Since we're now doing server-side filtering, no need for client-side filter
  const filteredLeads = leads;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-purple-100 text-purple-800',
      proposal_sent: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      won: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'text-red-600',
      normal: 'text-yellow-600',
      medium: 'text-yellow-600',
      low: 'text-green-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Not set';
    try {
      return new Date(date).toLocaleString();
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="text-gray-600">Loading leads ...</p>
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
              <h3 className="font-semibold text-red-800">Error Loading Leads</h3>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and track your sales leads</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          New Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{leads.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {leads.reduce((sum, l) => sum + parseInt(l.message_count || '0'), 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">WhatsApp</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {leads.filter(l => l.lead_source === 'whatsapp').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
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
            placeholder="Search leads by phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Leads List - Card Design */}
      <div className="space-y-3 sm:space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <User className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 text-gray-300" />
              <p className="text-lg sm:text-xl font-semibold mb-2">No leads found</p>
              <p className="text-xs sm:text-sm text-center">
                {searchTerm 
                  ? 'Try adjusting your search' 
                  : 'No leads available yet'}
              </p>
            </div>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead.lead_id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
              onClick={() => window.location.href = `/dashboard/leads/${lead.lead_id}/messages`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  {/* Left Side - Contact Info */}
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                    <div className="flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                      <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{lead.phone}</h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
                          <span className="capitalize">{formatValue(lead.lead_source)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <span className="hidden sm:inline">Created {formatDate(lead.created_at)}</span>
                          <span className="sm:hidden">{new Date(lead.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className={`font-semibold ${getPriorityColor(lead.priority_level)}`}>
                            {lead.priority_level.toUpperCase()}
                          </span>
                          <span className="text-gray-400 hidden sm:inline">•</span>
                          <span className="text-gray-500 hidden sm:inline">Score: {lead.priority_score}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-2 font-mono truncate">
                        ID: {lead.lead_id}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto sm:ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/dashboard/leads/${lead.lead_id}/messages`;
                      }}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md text-sm sm:text-base w-full sm:w-auto"
                    >
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">View Chat</span>
                      {lead.message_count && parseInt(lead.message_count) > 0 && (
                        <span className="ml-1 px-2 sm:px-2.5 py-0.5 bg-white text-green-700 text-xs rounded-full font-bold">
                          {lead.message_count}
                        </span>
                      )}
                    </button>
                    
                    {lead.followup_count > 0 && (
                      <div className="text-xs text-gray-500 text-right">
                        <div>Follow-ups: <span className="font-semibold text-gray-700">{lead.followup_count}</span></div>
                        {lead.last_followup_date && (
                          <div className="mt-0.5 hidden sm:block">Last: {formatDate(lead.last_followup_date)}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
}
