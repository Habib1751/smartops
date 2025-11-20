'use client';

import React, { useState } from 'react';
import { mockEquipment } from '@/data/mockData';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...new Set(mockEquipment.map((e) => e.category_name))];

  const filteredEquipment = mockEquipment.filter((eq) => {
    const matchesSearch = eq.equipment_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || eq.category_name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getMaintenanceColor = (lastDate: string, nextDate: string) => {
    const today = new Date();
    const next = new Date(nextDate);
    const daysUntil = Math.floor((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 7) return 'bg-red-50 text-red-800';
    if (daysUntil < 14) return 'bg-yellow-50 text-yellow-800';
    return 'bg-green-50 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-600 mt-1">Track equipment availability and maintenance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by equipment name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Equipment Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Units</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Assigned</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Condition</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Maintenance</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Next Maintenance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredEquipment.map((eq) => {
                const available = eq.quantity_total - eq.assigned_count;
                const mainColor = getMaintenanceColor(eq.last_maintenance_date, eq.next_maintenance_date);
                
                return (
                  <tr key={eq.equipment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{eq.equipment_name}</td>
                    <td className="px-6 py-4 text-sm">{eq.category_name}</td>
                    <td className="px-6 py-4 text-sm text-center">{eq.quantity_total}</td>
                    <td className="px-6 py-4 text-sm text-center text-orange-600 font-semibold">{eq.assigned_count}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {available}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {eq.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{eq.last_maintenance_date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${mainColor}`}>
                        {eq.next_maintenance_date}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
