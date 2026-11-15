import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const GameCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Gamepad2',
    displayOrder: 0,
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories/admin');
      if (res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'Gamepad2',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      icon: cat.icon || 'Gamepad2',
      displayOrder: cat.displayOrder || 0,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Category Name is required.');
      return;
    }

    try {
      if (editingCategory) {
        await api.put(`/categories/admin/${editingCategory._id}`, formData);
      } else {
        await api.post('/categories/admin', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving category.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/admin/${id}`);
      setDeleteConfirmationId(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-2xl text-white tracking-wide">
            Game Categories
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Organize games into dynamic categories displayed on the public website filters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-glow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl bg-vault-card border border-purple-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vault-surface/80 border-b border-purple-500/15 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Assigned Games</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-zinc-400">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-zinc-400">No categories found.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-vault-surface/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-300">
                      {cat.slug}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-vault-surface border border-zinc-700 text-zinc-300 font-bold">
                        {cat.gameCount || 0} Games
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400">
                      {cat.displayOrder || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        cat.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}>
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-purple-400 text-zinc-400 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationId(cat._id)}
                          className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-rose-400 text-zinc-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-vault-card border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/15 mb-4">
              <h3 className="font-gaming font-bold text-xl text-white">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Open World, Fighting"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Slug (URL identifier)</label>
                <input
                  type="text"
                  placeholder="e.g. open-world"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded bg-vault-surface border-zinc-700 text-purple-600 focus:ring-0"
                />
                <label htmlFor="catActive" className="text-zinc-300 cursor-pointer">Active on Public Website</label>
              </div>

              <div className="pt-4 border-t border-purple-500/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-vault-card border border-rose-500/30 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-gaming font-bold text-xl text-white">Delete Category?</h3>
            <p className="mt-2 text-xs text-zinc-300">
              Categories with assigned games cannot be deleted. Are you sure you want to proceed?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirmationId(null)} className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmationId)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCategories;
