'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Package, AlertCircle } from 'lucide-react';
import { fetchInventory, createInventory, updateInventory, deleteInventory } from '@/lib/api';
import toast from 'react-hot-toast';
import InventoryModal from '@/components/inventory/InventoryModal';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadInventory();
  }, [limit, offset, searchQuery]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const params: any = { limit, offset };
      if (searchQuery) params.q = searchQuery;
      
      const response = await fetchInventory(params);
      console.log('📦 API Response:', response);
      
      // Handle response structure: { data: [...], meta: { limit, offset, returned, hasMore } }
      const data = response?.data || [];
      const meta = response?.meta || {};
      
      setInventory(data);
      
      // Calculate total from meta or use returned count
      const returned = meta.returned || data.length;
      const hasMore = meta.hasMore || false;
      setTotalItems(hasMore ? offset + returned + 1 : offset + returned);
      
      console.log('✅ Loaded inventory:', data.length, 'items');
    } catch (error: any) {
      console.error('❌ Error fetching inventory:', error);
      toast.error('Failed to load inventory: ' + error.message);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setModalMode('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to delete "${item.equipment_name || item.name}"?`)) {
      return;
    }

    try {
      const equipmentId = item.equipment_id || item.id;
      await deleteInventory(equipmentId);
      toast.success('Equipment deleted successfully');
      loadInventory();
    } catch (error: any) {
      console.error('❌ Error deleting equipment:', error);
      toast.error('Failed to delete equipment: ' + error.message);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (modalMode === 'create') {
        await createInventory(formData);
        toast.success('Equipment created successfully');
      } else {
        const equipmentId = selectedItem.equipment_id || selectedItem.id;
        await updateInventory(equipmentId, formData);
        toast.success('Equipment updated successfully');
      }
      setIsModalOpen(false);
      loadInventory();
    } catch (error: any) {
      console.error('❌ Error saving equipment:', error);
      toast.error('Failed to save equipment: ' + error.message);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setOffset(0); // Reset to first page on search
  };

  const handleNextPage = () => {
    if (offset + limit < totalItems) {
      setOffset(offset + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalItems / limit);

  if (loading && inventory.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your equipment and stock levels</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Equipment
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search equipment by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Items per page:</label>
            <select
              value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value)); setOffset(0); }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {inventory.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-500 mb-2">No equipment found</p>
            <p className="text-sm text-gray-400">
              {searchQuery ? 'Try adjusting your search' : 'Start by adding your first equipment'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Equipment</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Condition</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inventory.map((item: any) => {
                    const name = item.equipment_name || 'N/A';
                    const code = item.equipment_code || item.equipment_id || 'N/A';
                    const category = item.category_name || 'N/A';
                    const brand = item.brand || 'N/A';
                    const model = item.model || 'N/A';
                    const totalQty = item.quantity_total || 0;
                    const available = item.quantity_available || 0;
                    const condition = item.condition_status || 'N/A';
                    const location = item.storage_location || item.location || 'N/A';
                    const equipmentId = item.equipment_id;
                    const dailyRate = item.daily_rental_value || 0;

                    return (
                      <tr key={equipmentId} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="font-medium text-gray-900 text-sm">{name}</div>
                          <div className="text-xs text-gray-500">{code}</div>
                          {brand && brand !== 'N/A' && (
                            <div className="text-xs text-gray-400">{brand} {model}</div>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{category}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm">
                            <span className="font-medium text-green-600">{available}</span>
                            <span className="text-gray-400"> / </span>
                            <span className="text-gray-600">{totalQty}</span>
                          </div>
                          <div className="text-xs text-gray-500">{totalQty - available} in use</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                            condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                            condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                            condition === 'Maintenance Required' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {condition}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm text-gray-700">{location}</div>
                          {dailyRate > 0 && (
                            <div className="text-xs text-green-600 font-medium">${dailyRate}/day</div>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{offset + 1}</span> to <span className="font-medium">{Math.min(offset + limit, totalItems)}</span> of <span className="font-medium">{totalItems}</span> items
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={offset === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={offset + limit >= totalItems}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && inventory.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedItem}
        mode={modalMode}
      />
    </div>
  );
}
