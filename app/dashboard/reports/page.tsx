'use client';

import React from 'react';
import { mockStats, mockEvents, mockClients, mockLeads } from '@/data/mockData';
import { BarChart3, TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';

export default function ReportsPage() {
  // Calculate statistics
  const totalRevenue = mockEvents.reduce((sum, e) => sum + e.total_price, 0);
  const averageEventValue = mockEvents.length > 0 ? totalRevenue / mockEvents.length : 0;
  const vipClients = mockClients.filter((c) => c.loyalty_tier === 'vip').length;
  const conversionRate = mockLeads.length > 0 ? ((mockEvents.length / mockLeads.length) * 100).toFixed(1) : 0;

  const reportCards = [
    {
      title: 'Monthly Revenue',
      value: `$${(mockStats.monthlyRevenue / 1000).toFixed(0)}K`,
      icon: <DollarSign className="text-green-600" size={24} />,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Events',
      value: mockStats.totalEvents,
      icon: <CheckCircle className="text-blue-600" size={24} />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Avg Event Value',
      value: `$${averageEventValue.toFixed(0)}`,
      icon: <TrendingUp className="text-purple-600" size={24} />,
      bgColor: 'bg-purple-50',
    },
    {
      title: 'VIP Clients',
      value: vipClients,
      icon: <Users className="text-orange-600" size={24} />,
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Business performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Event Analytics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="font-semibold">{mockStats.totalEvents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Confirmed Events</span>
                <span className="font-semibold">{mockStats.confirmedEvents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(mockStats.confirmedEvents / mockStats.totalEvents) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Pending Leads</span>
                <span className="font-semibold">{mockStats.pendingLeads}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="font-semibold">{conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${conversionRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Resource Utilization</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Available Technicians</span>
                <span className="font-semibold">{mockStats.availableTechs}</span>
              </div>
              <p className="text-xs text-gray-500">Out of 4 total</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Equipment Available</span>
                <span className="font-semibold">{mockStats.availableEquipment}</span>
              </div>
              <p className="text-xs text-gray-500">Out of 30+ items</p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-semibold mb-2">Utilization Rate</p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Technicians</p>
                  <div className="text-lg font-bold">75%</div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Equipment</p>
                  <div className="text-lg font-bold">83%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">November 2025 Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Total Revenue</p>
            <p className="text-lg font-bold mt-1">${mockStats.monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Events Completed</p>
            <p className="text-lg font-bold mt-1">{mockStats.confirmedEvents}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">New Clients</p>
            <p className="text-lg font-bold mt-1">{mockClients.filter((c) => c.loyalty_tier === 'new').length}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Active Leads</p>
            <p className="text-lg font-bold mt-1">{mockStats.pendingLeads}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
