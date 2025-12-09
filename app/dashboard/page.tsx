'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle, Users, Zap, Package, DollarSign, TrendingUp } from 'lucide-react';
import QuickActions from '@/components/dashboard/QuickActions';
import { fetchLeads } from '@/lib/api';

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await fetchLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };
  const statCards = [
    {
      title: 'Total Events',
      value: 0,
      icon: <CheckCircle className="text-green-600" size={24} />,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Leads',
      value: leads.length,
      icon: <Briefcase className="text-blue-600" size={24} />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Confirmed Events',
      value: 0,
      icon: <TrendingUp className="text-purple-600" size={24} />,
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Available Technicians',
      value: 0,
      icon: <Users className="text-orange-600" size={24} />,
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Available Equipment',
      value: 0,
      icon: <Package className="text-indigo-600" size={24} />,
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Monthly Revenue',
      value: '$0K',
      icon: <DollarSign className="text-green-600" size={24} />,
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome to SmartOps - Your event management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">{/* ... */}
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`${stat.bgColor} p-3 sm:p-4 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Leads */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Leads</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : leads.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {leads.slice(0, 3).map((lead, index) => (
              <div key={lead.id || lead.lead_id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{lead.name || lead.event_location}</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {lead.eventDate || lead.event_date} • {lead.eventType || lead.event_type}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${
                  (lead.priority || lead.priority_level) === 'high' ? 'bg-red-100 text-red-800' :
                  (lead.priority || lead.priority_level) === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {(lead.priority || lead.priority_level || 'low').toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No leads found</p>
        )}
      </div>
    </div>
  );
}
