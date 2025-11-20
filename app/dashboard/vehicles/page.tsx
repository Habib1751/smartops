'use client';

import React, { useState } from 'react';
import { mockVehicles } from '@/data/mockData';
import { Search, Truck, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicle_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.plate_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getAvailabilityColor = (available: boolean) => {
    return available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getServiceStatus = (nextDate: string) => {
    const today = new Date();
    const next = new Date(nextDate);
    const daysUntil = Math.floor((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 7) return { color: 'bg-red-50 text-red-800', label: 'Service Due' };
    if (daysUntil < 30) return { color: 'bg-yellow-50 text-yellow-800', label: 'Service Soon' };
    return { color: 'bg-green-50 text-green-800', label: 'OK' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicles Management</h1>
          <p className="text-gray-600 mt-1">Track transport fleet and maintenance schedules</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vehicle type or plate number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVehicles.map((vehicle) => {
          const serviceStatus = getServiceStatus(vehicle.next_service_date);
          
          return (
            <div key={vehicle.vehicle_id} className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Truck size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{vehicle.vehicle_type}</h3>
                    <p className="text-sm text-gray-600">{vehicle.plate_number}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(vehicle.is_available)}`}>
                  {vehicle.is_available ? 'Available' : 'In Use'}
                </span>
              </div>

              {/* Capacity */}
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-semibold text-lg">{vehicle.capacity_kg.toLocaleString()} kg</p>
              </div>

              {/* Maintenance */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Last Service</p>
                  <p className="text-sm font-medium">{vehicle.last_service_date}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Next Service</p>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${serviceStatus.color}`}>
                    {vehicle.next_service_date} - {serviceStatus.label}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toast.success(`Assigned ${vehicle.plate_number} to event`)}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                >
                  Assign
                </button>
                <button
                  onClick={() => toast.success(`Maintenance scheduled for ${vehicle.plate_number}`)}
                  className="flex-1 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-sm rounded-lg flex items-center justify-center gap-2"
                >
                  <Wrench size={16} />
                  Maintenance
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
