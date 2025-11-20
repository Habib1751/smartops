'use client';

import React, { useMemo, useState } from 'react';
import { mockProducts } from '@/data/mockData';

export default function ProductsTable() {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q) return mockProducts;
    return mockProducts.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Inventory</h2>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKU or name" className="px-3 py-2 border rounded-lg" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600 border-b">
              <th className="py-2">SKU</th>
              <th className="py-2">Name</th>
              <th className="py-2">Category</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Min</th>
              <th className="py-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className={`border-b ${p.quantity <= p.minStock ? 'bg-red-50' : ''}`}>
                <td className="py-3 text-sm">{p.sku}</td>
                <td className="py-3 text-sm">{p.name}</td>
                <td className="py-3 text-sm">{p.category}</td>
                <td className="py-3 text-sm font-medium">{p.quantity}</td>
                <td className="py-3 text-sm">{p.minStock}</td>
                <td className="py-3 text-sm">{p.warehouse?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
