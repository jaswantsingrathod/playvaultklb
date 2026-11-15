import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Flame,
  Search,
  CheckCircle2,
  AlertCircle,
  CheckSquare,
  Square,
  MinusSquare,
} from 'lucide-react';
import api from '../../services/api';
import TablePagination from '../../components/admin/TablePagination';
import BulkActionBar from '../../components/admin/BulkActionBar';
import BulkDeleteModal from '../../components/admin/BulkDeleteModal';

const ManageRentalPlans = () => {
  const [plans, setPlans] = useState([]);
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
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [formError, setFormError] = useState('');

  const initialPlanState = {
    name: '',
    slug: '',
    durationLabel: '1 Day',
    durationHours: 8,
    price: 699,
    originalPrice: '',
    description: '',
    inclusions: [
      'PlayStation 5 Console (Disk/Digital)',
      '1 DualSense Wireless Controller',
      '24/7 Dedicated Support',
      'GTA VI / Top AAA Games Included',
      'Ultra High Speed HDMI 2.1 Cable',
    ].join('\n'),
    badge: '',
    isPopular: false,
    isActive: true,
    displayOrder: 1,
  };

  const [formData, setFormData] = useState(initialPlanState);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rental-plans/admin', {
        params: {
          page,
          limit,
          search: search.trim() || undefined,
        },
      });
      if (res.data.success) {
        setPlans(res.data.data || []);
        setTotal(res.data.total ?? 0);
        setTotalPages(res.data.totalPages ?? 1);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [page, limit, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Bulk selection helpers
  const allPageSelected = plans.length > 0 && plans.every((p) => selectedIds.includes(p._id));
  const somePageSelected = plans.some((p) => selectedIds.includes(p._id)) && !allPageSelected;

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPage = () => {
    if (allPageSelected) {
      const pageIds = new Set(plans.map((p) => p._id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = plans.map((p) => p._id);
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
      const res = await api.post('/rental-plans/admin/bulk-delete', { ids: selectedIds });
      if (res.data.success) {
        setActionFeedback({
          type: 'success',
          text: `Successfully deleted ${selectedIds.length} rental plans.`,
        });
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
        fetchPlans();
      }
    } catch (err) {
      console.error('Bulk delete failed:', err);
      setActionFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete selected rental plans.',
      });
      setIsBulkDeleteOpen(false);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      ...initialPlanState,
      displayOrder: plans.length + 1,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      slug: plan.slug || '',
      durationLabel: plan.durationLabel || '',
      durationHours: plan.durationHours || 8,
      price: plan.price || 0,
      originalPrice: plan.originalPrice || '',
      description: plan.description || '',
      inclusions: Array.isArray(plan.inclusions) ? plan.inclusions.join('\n') : '',
      badge: plan.badge || '',
      isPopular: plan.isPopular !== undefined ? plan.isPopular : false,
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      displayOrder: plan.displayOrder || 0,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (plan) => {
    try {
      const updated = !plan.isActive;
      await api.put(`/rental-plans/admin/${plan._id}`, { isActive: updated });
      setPlans((prev) =>
        prev.map((p) => (p._id === plan._id ? { ...p, isActive: updated } : p))
      );
    } catch (err) {
      console.error('Failed to toggle plan status:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.durationLabel || formData.price === undefined) {
      setFormError('Please fill in Plan Name, Duration Label, and Rental Price.');
      return;
    }

    try {
      const payload = {
        ...formData,
        durationHours: Number(formData.durationHours),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        inclusions: formData.inclusions.split('\n').map((i) => i.trim()).filter(Boolean),
      };

      if (editingPlan) {
        await api.put(`/rental-plans/admin/${editingPlan._id}`, payload);
        setActionFeedback({ type: 'success', text: `Rental plan "${formData.name}" updated successfully.` });
      } else {
        await api.post('/rental-plans/admin', payload);
        setActionFeedback({ type: 'success', text: `Rental plan "${formData.name}" created successfully.` });
      }

      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving rental plan.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/rental-plans/admin/${id}`);
      setActionFeedback({ type: 'success', text: 'Rental plan deleted successfully.' });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      setDeleteConfirmationId(null);
      fetchPlans();
    } catch (err) {
      console.error('Delete failed:', err);
      setActionFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to delete rental plan.' });
      setDeleteConfirmationId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-xl sm:text-2xl text-white tracking-wide">
            Rental Plans Management
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1">
            Configure official packages, rental duration, pricing, inclusions, and popular badges.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-glow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Plan</span>
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
            placeholder="Search plan name, duration, or badge..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs outline-none"
          />
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        entityName="rental plans"
        onClear={handleClearSelection}
        onDelete={() => setIsBulkDeleteOpen(true)}
      />

      {/* Plans Table */}
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
                <th className="py-2.5 px-3 sm:px-4">Plan Name</th>
                <th className="py-2.5 px-3 sm:px-4">Duration</th>
                <th className="py-2.5 px-3 sm:px-4">Price</th>
                <th className="py-2.5 px-3 sm:px-4">Inclusions</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Badge</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Popular</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Active</th>
                <th className="py-2.5 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-zinc-400">Loading plans from database...</td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-zinc-400">No rental plans found. Click "Create Plan" to add one.</td>
                </tr>
              ) : (
                plans.map((plan) => {
                  const isSelected = selectedIds.includes(plan._id);
                  return (
                    <tr
                      key={plan._id}
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
                          onClick={() => handleToggleSelect(plan._id)}
                          className="text-zinc-400 hover:text-purple-400 transition-colors p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="font-bold text-white text-xs sm:text-sm">{plan.name}</div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1">{plan.description}</div>
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-3 sm:px-4 font-mono">
                        <div className="font-semibold text-purple-300">{plan.durationLabel}</div>
                        <div className="text-[10px] text-zinc-400">{plan.durationHours} Hours</div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3 sm:px-4 font-mono">
                        <div className="font-gaming font-bold text-sm sm:text-base text-emerald-400">
                          ₹{plan.price.toLocaleString()}
                        </div>
                        {plan.originalPrice && (
                          <div className="text-[10px] text-zinc-500 line-through">
                            ₹{plan.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Inclusions count */}
                      <td className="py-3 px-3 sm:px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-vault-surface border border-zinc-800 text-zinc-300 text-[10px] sm:text-[11px]">
                          {plan.inclusions?.length || 0} Items
                        </span>
                      </td>

                      {/* Badge */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        {plan.badge ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                            {plan.badge}
                          </span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Popular */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        {plan.isPopular ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold flex items-center justify-center gap-0.5 w-max mx-auto">
                            <Flame className="w-2.5 h-2.5 text-amber-400 fill-current" />
                            <span>Popular</span>
                          </span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Active */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(plan)}
                          className={`w-7 h-3.5 rounded-full transition-colors relative inline-block ${
                            plan.isActive ? 'bg-purple-600' : 'bg-zinc-700'
                          }`}
                          title="Toggle Active"
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                              plan.isActive ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(plan)}
                            className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-purple-400 text-zinc-400 hover:text-white"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmationId(plan._id)}
                            className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-rose-400 text-zinc-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
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
          entityName="rental plans"
        />
      </div>

      {/* Add / Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div
            className="w-full max-w-2xl bg-vault-card border border-purple-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-y-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-purple-500/15 mb-4 sm:mb-6">
              <h3 className="font-gaming font-bold text-lg sm:text-2xl text-white truncate pr-2">
                {editingPlan ? `Edit: ${editingPlan.name}` : 'Create Rental Plan'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-2.5 sm:p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Day Weekend Blitz, 3 Days Pro Session"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Duration Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24 Hours, 3 Days, 7 Days"
                    value={formData.durationLabel}
                    onChange={(e) => setFormData({ ...formData, durationLabel: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Duration (Hours) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Rental Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Discount reference"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Brief Description</label>
                <input
                  type="text"
                  placeholder="e.g. Perfect for weekend marathons with buddies"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Inclusions (One per line)
                </label>
                <textarea
                  rows="4"
                  placeholder="PlayStation 5 Console&#10;1 DualSense Controller&#10;HDMI 2.1 Cable"
                  value={formData.inclusions}
                  onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Popular, Best Value, 20% OFF"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded bg-vault-surface border-zinc-700 text-purple-600 focus:ring-0"
                  />
                  <span className="text-zinc-200">Highlight as Popular</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-vault-surface border-zinc-700 text-purple-600 focus:ring-0"
                  />
                  <span className="text-zinc-200">Active</span>
                </label>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-purple-500/15 flex items-center justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-glow-sm"
                >
                  {editingPlan ? 'Update Plan' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm" onClick={() => setDeleteConfirmationId(null)}>
          <div className="w-full max-w-sm bg-vault-card border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-gaming font-bold text-lg sm:text-xl text-white">Delete Rental Plan?</h3>
            <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete this rental plan? This cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2 sm:gap-2.5">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmationId)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        count={selectedIds.length}
        entityName="rental plans"
        loading={bulkDeleting}
      />
    </div>
  );
};

export default ManageRentalPlans;
