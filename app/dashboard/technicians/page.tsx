'use client';

import React, { useState } from 'react';
import { mockTechnicians } from '@/data/mockData';
import { Search, Star, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TechniciansPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTechnicians = mockTechnicians.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.phone.includes(searchQuery) ||
      tech.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getAvailabilityColor = (available: boolean) => {
    return available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technicians Management</h1>
          <p className="text-gray-600 mt-1">Manage and track technician availability</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnicians.map((tech) => (
          <div key={tech.technician_id} className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{tech.specialization.replace(/_/g, ' ')}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(tech.is_available)}`}>
                {tech.is_available ? 'Available' : 'Busy'}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(tech.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">{tech.rating}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b">
              <div className="text-center">
                <p className="text-xs text-gray-600">Events Completed</p>
                <p className="font-semibold text-lg">{tech.total_events}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Hourly Rate</p>
                <p className="font-semibold">${tech.hourly_rate}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => toast.success(`Call ${tech.name}`)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Phone size={16} />
                {tech.phone}
              </button>
              <button
                onClick={() => toast.success(`Email sent to ${tech.name}`)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Mail size={16} />
                {tech.email}
              </button>
            </div>

            {/* Actions */}
            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
              Assign to Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
