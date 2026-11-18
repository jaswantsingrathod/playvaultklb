import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Search,
  CheckSquare,
  Square,
  MinusSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import TablePagination from '../../components/admin/TablePagination';
import BulkActionBar from '../../components/admin/BulkActionBar';
import BulkDeleteModal from '../../components/admin/BulkDeleteModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';

const GameCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Server-side pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Modal states
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
      const res = await api.get('/categories/admin', {
        params: {
          page,
          limit,
          search: search.trim() || undefined,
        },
      });
      if (res.data.success) {
        setCategories(res.data.data || []);
        setTotal(res.data.total ?? 0);
        setTotalPages(res.data.totalPages ?? 1);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit, search]);

  // Bulk selection helpers
  const allPageSelected = categories.length > 0 && categories.every((c) => selectedIds.includes(c._id));
  const somePageSelected = categories.some((c) => selectedIds.includes(c._id)) && !allPageSelected;

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPage = () => {
    if (allPageSelected) {
      const pageIds = new Set(categories.map((c) => c._id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = categories.map((c) => c._id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setBulkDeleting(true);
      const res = await api.post('/categories/admin/bulk-delete', { ids: selectedIds });
      if (res.data.success) {
        toast.success(`Successfully deleted ${selectedIds.length} categories.`);
        setActionFeedback({
          type: 'success',
          text: `Successfully deleted ${selectedIds.length} categories.`,
        });
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
        fetchCategories();
      }
    } catch (err) {
      console.error('Bulk delete failed:', err);
      const errText = err.response?.data?.message || 'Failed to delete selected categories.';
      toast.error(errText);
      setActionFeedback({
        type: 'error',
        text: errText,
      });
      setIsBulkDeleteOpen(false);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

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
      toast.error('Category Name is required.');
      return;
    }

    try {
      if (editingCategory) {
        await api.put(`/categories/admin/${editingCategory._id}`, formData);
        toast.success(`Category "${formData.name}" updated successfully!`);
        setActionFeedback({ type: 'success', text: `Category "${formData.name}" updated successfully.` });
      } else {
        await api.post('/categories/admin', formData);
        toast.success(`Category "${formData.name}" created successfully!`);
        setActionFeedback({ type: 'success', text: `Category "${formData.name}" created successfully.` });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      const errText = err.response?.data?.message || 'Error saving category.';
      setFormError(errText);
      toast.error(errText);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/admin/${id}`);
      toast.success('Category deleted successfully.');
      setActionFeedback({ type: 'success', text: 'Category deleted successfully.' });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      setDeleteConfirmationId(null);
      fetchCategories();
    } catch (err) {
      const errText = err.response?.data?.message || 'Failed to delete category.';
      toast.error(errText);
      setActionFeedback({
        type: 'error',
        text: errText,
      });
      setDeleteConfirmationId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-xl sm:text-2xl text-white tracking-wide">
            Game Categories
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1">
            Organize games into dynamic categories displayed on the public website filters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-glow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {actionFeedback && (
        <div
          className={`p-3 rounded-2xl text-xs flex items-center justify-between gap-2 border ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{actionFeedback.text}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-vault-card border border-purple-500/15 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search category name or slug..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs outline-none"
          />
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        entityName="categories"
        onClear={handleClearSelection}
        onDelete={() => setIsBulkDeleteOpen(true)}
      />

      {/* Categories Table */}
      <div className="rounded-2xl bg-vault-card border border-purple-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-vault-surface/80 border-b border-purple-500/15 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 sm:px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAllPage}
                    className="text-zinc-400 hover:text-purple-400 transition-colors p-1"
                    title={allPageSelected ? 'Deselect all on this page' : 'Select all on this page'}
                  >
                    {allPageSelected ? (
                      <CheckSquare className="w-4 h-4 text-purple-400" />
                    ) : somePageSelected ? (
                      <MinusSquare className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
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
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    Loading categories from database...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    No categories found. Click "Add New Category" to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const isSelected = selectedIds.includes(cat._id);
                  return (
                    <tr
                      key={cat._id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-purple-950/30 hover:bg-purple-950/40'
                          : 'hover:bg-vault-surface/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(cat._id)}
                          className="text-zinc-400 hover:text-purple-400 transition-colors p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

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
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            cat.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                          }`}
                        >
                          {cat.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-purple-400 text-zinc-400 hover:text-white"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmationId(cat._id)}
                            className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-rose-400 text-zinc-400 hover:text-rose-400"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        <TablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
          entityName="categories"
        />
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

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirmationId}
        onClose={() => setDeleteConfirmationId(null)}
        onConfirm={() => handleDelete(deleteConfirmationId)}
        title="Delete Game Category?"
        itemName={categories.find((c) => c._id === deleteConfirmationId)?.name || 'Selected Category'}
        description="Categories with assigned games cannot be deleted. Are you sure you want to permanently delete this category?"
        confirmText="Confirm Delete"
      />

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        count={selectedIds.length}
        entityName="categories"
        loading={bulkDeleting}
      />
    </div>
  );
};

export default GameCategories;
