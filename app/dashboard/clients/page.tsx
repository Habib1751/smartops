'use client';

import React, { useState } from 'react';
import { mockClients } from '@/data/mockData';
import { Search, MessageSquare, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.phone.includes(searchQuery);
    const matchesTier = filterTier === 'all' || client.loyalty_tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'new':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients Management</h1>
          <p className="text-gray-600 mt-1">Manage client relationships and loyalty</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="vip">VIP</option>
            <option value="premium">Premium</option>
            <option value="new">New</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tier</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Events</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Avg Value</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Event</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredClients.map((client) => (
                <tr key={client.client_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{client.name}</td>
                  <td className="px-6 py-4 text-sm">{client.phone}</td>
                  <td className="px-6 py-4 text-sm">{client.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(client.loyalty_tier)}`}>
                      {client.loyalty_tier.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-semibold">{client.total_events_count}</td>
                  <td className="px-6 py-4 text-sm font-semibold">${client.total_revenue_generated.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">${client.average_event_value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{client.last_event_date}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toast.success(`Message sent to ${client.name}`)}
                      className="p-2 text-whatsapp-green hover:bg-green-50 rounded-lg"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
