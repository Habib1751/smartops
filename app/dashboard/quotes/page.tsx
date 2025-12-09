'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quotes Management</h1>
        <p className="text-gray-600 mt-1">Generate and manage quotes for leads</p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <AlertCircle size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quotes Section</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Quote generation functionality will be available here. API integration pending.
          </p>
        </div>
      </div>
    </div>
  );
}
