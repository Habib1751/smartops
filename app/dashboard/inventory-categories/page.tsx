'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, FolderOpen, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  category_id: string;
  category_name: string;
  description: string;
  sort_order: number;
}

export default function InventoryCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
    sort_order: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory_categories');
      const data = await response.json();
      
      if (data.data) {
        setCategories(data.data);
        setFilteredCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = categories;

    if (searchQuery) {
      filtered = filtered.filter(cat =>
        cat.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        category_name: category.category_name,
        description: category.description,
        sort_order: category.sort_order
      });
    } else {
      setEditingCategory(null);
      setFormData({
        category_name: '',
        description: '',
        sort_order: categories.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      category_name: '',
      description: '',
      sort_order: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        const response = await fetch(`/api/inventory_categories?category_id=${editingCategory.category_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          toast.success('Category updated successfully');
          fetchCategories();
          handleCloseModal();
        } else {
          toast.error('Failed to update category');
        }
      } else {
        // Create new category
        const response = await fetch('/api/inventory_categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          
          // Show success message with new ID if available
          if (result.data?.category_id) {
            toast.success(
              <div>
                <p className="font-semibold">Category created successfully!</p>
                <p className="text-sm text-gray-600">ID: {result.data.category_id}</p>
              </div>,
              { duration: 4000 }
            );
            console.log('✅ New category ID:', result.data.category_id);
          } else {
            toast.success('Category created successfully');
          }
          
          fetchCategories();
          handleCloseModal();
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Create category failed:', response.status, errorData);
          toast.error(errorData.error || `Failed to create category (${response.status})`);
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    // Show custom confirmation dialog
    setDeleteConfirm({ id: categoryId, name: categoryName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await fetch(`/api/inventory_categories?category_id=${deleteConfirm.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success(
          <div>
            <p className="font-semibold">Category deleted successfully!</p>
            <p className="text-sm text-gray-600">{deleteConfirm.name}</p>
          </div>,
          { duration: 3000 }
        );
        fetchCategories();
        setDeleteConfirm(null);
      } else {
        const error = await response.json().catch(() => ({}));
        console.error('Delete category failed:', response.status, error);
        toast.error(error.error || error.message || `Failed to delete category (${response.status})`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('An error occurred: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Categories</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin">
            <FolderOpen size={32} className="text-blue-600" />
          </div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Categories</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage equipment categories and organization</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-xs sm:text-sm font-semibold">Total Categories</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{categories.length}</p>
          </div>
          <FolderOpen className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Categories List */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first category'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              <Plus size={20} />
              Add First Category
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCategories.map(category => (
                  <tr key={category.category_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                        {category.sort_order}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <Package size={20} className="text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-900">{category.category_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{category.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.category_id, category.category_name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredCategories.map(category => (
            <div key={category.category_id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Package size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.category_name}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      Order: {category.sort_order}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.category_id, category.category_name)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Heavy Machinery"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Category description..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order || ''}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  min="1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Delete Category
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 text-center mb-4">
                Are you sure you want to delete this category?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Category Name:</p>
                <p className="text-lg font-semibold text-red-800">{deleteConfirm.name}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-yellow-800 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>This will fail if equipment items are using this category.</span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
