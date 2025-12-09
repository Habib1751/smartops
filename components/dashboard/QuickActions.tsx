"use client";

import React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={() => router.push('/dashboard/leads')} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          + New Lead
        </button>
        <button 
          onClick={() => router.push('/dashboard/inventory')} 
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
        >
          Manage Inventory
        </button>
        <button 
          onClick={() => toast.info('Quote generation coming soon')} 
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
        >
          Generate Quote
        </button>
        <button 
          onClick={() => router.push('/dashboard/reports')} 
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm"
        >
          View Reports
        </button>
      </div>
    </div>
  );
}

