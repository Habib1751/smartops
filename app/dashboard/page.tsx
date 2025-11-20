'use client';

import React from 'react';
import { mockStats, mockLeads } from '@/data/mockData';
import { Briefcase, CheckCircle, Users, Zap, Package, DollarSign, TrendingUp } from 'lucide-react';
import QuickActions from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  const statCards = [
    {
      title: 'Total Events',
      value: mockStats.totalEvents,
      icon: <CheckCircle className="text-green-600" size={24} />,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Leads',
      value: mockStats.pendingLeads,
      icon: <Briefcase className="text-blue-600" size={24} />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Confirmed Events',
      value: mockStats.confirmedEvents,
      icon: <TrendingUp className="text-purple-600" size={24} />,
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Available Technicians',
      value: mockStats.availableTechs,
      icon: <Users className="text-orange-600" size={24} />,
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Available Equipment',
      value: mockStats.availableEquipment,
      icon: <Package className="text-indigo-600" size={24} />,
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Monthly Revenue',
      value: `$${(mockStats.monthlyRevenue / 1000).toFixed(0)}K`,
      icon: <DollarSign className="text-green-600" size={24} />,
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to SmartOps - Your event management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`${stat.bgColor} p-4 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Leads */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>
        <div className="space-y-3">
          {mockLeads.slice(0, 3).map((lead) => (
            <div key={lead.lead_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{lead.event_location}</p>
                <p className="text-sm text-gray-600">{lead.event_date} • {lead.event_type}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                lead.priority_level === 'high' ? 'bg-red-100 text-red-800' :
                lead.priority_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {lead.priority_level.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
