'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { mockEquipment } from '@/data/mockData';
import toast from 'react-hot-toast';

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = mockEquipment.filter((product: any) => {
    const matchesSearch = product.equipment_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.equipment_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category_name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(mockEquipment.map((p: any) => p.category_name))] as string[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your products and stock levels</p>
        </div>
        <button 
          onClick={() => toast.success('Add product form! (Backend needed)')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Equipment ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Equipment Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Assigned</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Next Maintenance</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product: any) => (
                <tr key={product.equipment_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{product.equipment_id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.equipment_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {product.category_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.quantity_total}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.quantity_total - (product.available_quantity || 0)} in use
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(product.next_maintenance_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toast.success('Edit equipment! (Backend needed)')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => toast.error('Delete equipment! (Backend needed)')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredProducts.length} of {mockEquipment.length} equipment items
      </div>
    </div>
  );
}
