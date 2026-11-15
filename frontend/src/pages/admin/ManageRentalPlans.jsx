import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Flame,
} from 'lucide-react';
import api from '../../services/api';

const ManageRentalPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const res = await api.get('/rental-plans/admin');
      if (res.data.success) {
        setPlans(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

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
      } else {
        await api.post('/rental-plans/admin', payload);
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
      setDeleteConfirmationId(null);
      fetchPlans();
    } catch (err) {
      console.error('Delete failed:', err);
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

      {/* Plans Table */}
      <div className="rounded-2xl bg-vault-card border border-purple-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-vault-surface/80 border-b border-purple-500/15 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
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
                  <td colSpan="8" className="py-10 text-center text-zinc-400">Loading plans...</td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-zinc-400">No rental plans found.</td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-vault-surface/40 transition-colors">
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
                ))
              )}
            </tbody>
          </table>
        </div>
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
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3-Days Plan, Weekend Gaming"
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
                    placeholder="e.g. 3 Days, 48 Hours"
                    value={formData.durationLabel}
                    onChange={(e) => setFormData({ ...formData, durationLabel: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Total Hours *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="56"
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="1799"
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
                    placeholder="2199"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Our most demanded rental package"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Plan Inclusions (One item per line)
                </label>
                <textarea
                  rows="3"
                  value={formData.inclusions}
                  onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-sans"
                  placeholder="PS5 Console (Disk/Digital)&#10;1 DualSense Wireless Controller&#10;24/7 Support&#10;GTA VI Included"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular, Best Value"
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

              <div className="flex items-center gap-4 sm:gap-6 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded bg-vault-surface border-zinc-700 text-purple-600 focus:ring-0"
                  />
                  <span className="text-zinc-200">Popular (Glowing Card)</span>
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
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-glow-sm"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm" onClick={() => setDeleteConfirmationId(null)}>
          <div className="w-full max-w-sm bg-vault-card border border-rose-500/30 rounded-2xl p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-gaming font-bold text-lg text-white">Delete Rental Plan?</h3>
            <p className="mt-1.5 text-xs text-zinc-300">
              Are you sure you want to remove this rental plan from the website?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button onClick={() => setDeleteConfirmationId(null)} className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmationId)} className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRentalPlans;
