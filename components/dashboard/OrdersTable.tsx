'use client';

import React from 'react';
import { mockOrders } from '@/data/mockData';

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Orders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600 border-b">
              <th className="py-2">Order #</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Status</th>
              <th className="py-2">Total</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="py-3 text-sm">{o.orderNumber}</td>
                <td className="py-3 text-sm">{o.customer.name}</td>
                <td className="py-3 text-sm">{o.status}</td>
                <td className="py-3 text-sm">${o.totalAmount.toFixed(2)}</td>
                <td className="py-3 text-sm">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
