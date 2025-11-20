'use client';

import React from 'react';
import { mockStats, mockProducts } from '@/data/mockData';
import { Package, ShoppingCart, Users, MessageSquare, AlertCircle } from 'lucide-react';

export default function Overview() {
  const lowStock = mockProducts.filter((p) => p.quantity <= p.minStock + 5).slice(0,6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Products" value={mockStats.totalProducts} icon={<Package size={20} className="text-blue-600" />} />
        <Card title="Pending Orders" value={mockStats.pendingOrders} icon={<ShoppingCart size={20} className="text-purple-600" />} />
        <Card title="Unread Messages" value={mockStats.unreadMessages} icon={<MessageSquare size={20} className="text-green-600" />} badge={mockStats.unreadMessages > 0} />
        <Card title="Total Customers" value={mockStats.totalCustomers} icon={<Users size={20} className="text-orange-600" />} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Low Stock Items</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lowStock.length === 0 && <p className="text-sm text-gray-600">No low stock items.</p>}
          {lowStock.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-sm text-gray-600">SKU: {p.sku} — Qty: {p.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Min: {p.minStock}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, badge }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg relative">
          {icon}
          {badge && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
        </div>
      </div>
    </div>
  );
}
