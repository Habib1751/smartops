'use client';

import React, { useMemo, useState } from 'react';
import { mockCustomers } from '@/data/mockData';

export default function CustomersTable() {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q) return mockCustomers;
    return mockCustomers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q));
  }, [q]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Customers</h2>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone" className="px-3 py-2 border rounded-lg" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600 border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Email</th>
              <th className="py-2">Orders</th>
              <th className="py-2">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-3 text-sm">{c.name}</td>
                <td className="py-3 text-sm">{c.phone}</td>
                <td className="py-3 text-sm">{c.email}</td>
                <td className="py-3 text-sm">{c.totalOrders}</td>
                <td className="py-3 text-sm">{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
