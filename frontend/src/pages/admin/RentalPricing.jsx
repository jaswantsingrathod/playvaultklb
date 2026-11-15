import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CircleDollarSign,
  Plus,
  Edit2,
  Trash2,
  X,
  Gamepad2,
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

const RentalPricing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGameId = searchParams.get('gameId') || '';

  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(initialGameId);
  const [pricingTiers, setPricingTiers] = useState([]);
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
  const [editingTier, setEditingTier] = useState(null);
  const [formError, setFormError] = useState('');
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const initialTierState = {
    game: '',
    durationHours: 1,
    title: '1 Hour Quick Play',
    price: 50,
    originalPrice: '',
    pricingType: 'hourly',
    description: '',
    badge: '',
    isPopular: false,
    isActive: true,
    displayOrder: 1,
  };

  const [formData, setFormData] = useState(initialTierState);

  // Fetch games list
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get('/games/admin/all?limit=100');
        if (res.data.success) {
          setGames(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load games for pricing:', err);
      }
    };
    fetchGames();
  }, []);

  // Fetch pricing tiers with server-side pagination & search
  const fetchPricing = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search: search.trim() || undefined,
      };
      if (selectedGameId) params.gameId = selectedGameId;

      const res = await api.get('/pricing/admin', { params });
      if (res.data.success) {
        setPricingTiers(res.data.data || []);
        setTotal(res.data.total ?? 0);
        setTotalPages(res.data.totalPages ?? 1);
      }
    } catch (err) {
      console.error('Failed to fetch pricing:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [selectedGameId, page, limit, search]);

  const handleGameSelect = (id) => {
    setSelectedGameId(id);
    setPage(1);
    if (id) {
      setSearchParams({ gameId: id });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Bulk selection helpers
  const allPageSelected = pricingTiers.length > 0 && pricingTiers.every((t) => selectedIds.includes(t._id));
  const somePageSelected = pricingTiers.some((t) => selectedIds.includes(t._id)) && !allPageSelected;

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPage = () => {
    if (allPageSelected) {
      const pageIds = new Set(pricingTiers.map((t) => t._id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = pricingTiers.map((t) => t._id);
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
      const res = await api.post('/pricing/admin/bulk-delete', { ids: selectedIds });
      if (res.data.success) {
        setActionFeedback({
          type: 'success',
          text: `Successfully deleted ${selectedIds.length} pricing tiers.`,
        });
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
        fetchPricing();
      }
    } catch (err) {
      console.error('Bulk delete failed:', err);
      setActionFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete selected pricing tiers.',
      });
      setIsBulkDeleteOpen(false);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTier(null);
    setFormData({
      ...initialTierState,
      game: selectedGameId || games[0]?._id || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tier) => {
    setEditingTier(tier);
    setFormData({
      game: tier.game?._id || tier.game || '',
      durationHours: tier.durationHours || 1,
      title: tier.title || '',
      price: tier.price || 0,
      originalPrice: tier.originalPrice || '',
      pricingType: tier.pricingType || 'hourly',
      description: tier.description || '',
      badge: tier.badge || '',
      isPopular: tier.isPopular !== undefined ? tier.isPopular : false,
      isActive: tier.isActive !== undefined ? tier.isActive : true,
      displayOrder: tier.displayOrder || 0,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (tier) => {
    try {
      const updated = !tier.isActive;
      await api.put(`/pricing/admin/${tier._id}`, {
        isActive: updated,
      });
      setPricingTiers((prev) =>
        prev.map((t) => (t._id === tier._id ? { ...t, isActive: updated } : t))
      );
    } catch (err) {
      console.error('Failed to toggle pricing tier:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.game || !formData.title || formData.price === undefined) {
      setFormError('Please select a Game, enter a Tier Title, and specify the Price.');
      return;
    }

    try {
      const payload = {
        ...formData,
        durationHours: Number(formData.durationHours),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      };

      if (editingTier) {
        await api.put(`/pricing/admin/${editingTier._id}`, payload);
        setActionFeedback({ type: 'success', text: `Pricing tier "${formData.title}" updated successfully.` });
      } else {
        await api.post('/pricing/admin', payload);
        setActionFeedback({ type: 'success', text: `Pricing tier "${formData.title}" created successfully.` });
      }

      setIsModalOpen(false);
      fetchPricing();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving pricing tier.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pricing/admin/${id}`);
      setActionFeedback({ type: 'success', text: 'Pricing tier deleted successfully.' });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      setDeleteConfirmationId(null);
      fetchPricing();
    } catch (err) {
      setActionFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete pricing tier.',
      });
      setDeleteConfirmationId(null);
    }
  };

  const selectedGameObj = games.find((g) => g._id === selectedGameId);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-xl sm:text-2xl text-white tracking-wide">
            Rental Pricing Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1">
            Configure flexible duration packages (1hr, 2hr, daily, weekend passes) for any game.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-glow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Pricing Tier</span>
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

      {/* Game Filter & Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-vault-card border border-purple-500/15 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tier title or badge..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs outline-none"
          />
        </div>

        <div className="flex items-center gap-2 min-w-[240px]">
          <span className="text-xs text-zinc-400 whitespace-nowrap">Filter Game:</span>
          <select
            value={selectedGameId}
            onChange={(e) => handleGameSelect(e.target.value)}
            className="flex-1 px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white text-xs outline-none"
          >
            <option value="">All Games ({games.length})</option>
            {games.map((g) => (
              <option key={g._id} value={g._id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>

        {selectedGameObj && (
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2">
            <span>Base:</span>
            <span className="font-bold text-white">₹{selectedGameObj.hourlyPrice}/hr</span>
            <span>•</span>
            <span className="font-bold text-emerald-400">₹{selectedGameObj.dailyPrice}/day</span>
          </div>
        )}
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        entityName="pricing tiers"
        onClear={handleClearSelection}
        onDelete={() => setIsBulkDeleteOpen(true)}
      />

      {/* Pricing Tiers Table */}
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
                <th className="py-2.5 px-3 sm:px-4">Game</th>
                <th className="py-2.5 px-3 sm:px-4">Tier Title</th>
                <th className="py-2.5 px-3 sm:px-4">Duration</th>
                <th className="py-2.5 px-3 sm:px-4">Rental Price</th>
                <th className="py-2.5 px-3 sm:px-4">Type</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Badge</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Active</th>
                <th className="py-2.5 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-zinc-400">
                    Loading pricing tiers from database...
                  </td>
                </tr>
              ) : pricingTiers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-zinc-400">
                    No pricing tiers configured. Click "Add Pricing Tier" to create one.
                  </td>
                </tr>
              ) : (
                pricingTiers.map((tier) => {
                  const isSelected = selectedIds.includes(tier._id);
                  return (
                    <tr
                      key={tier._id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-purple-950/30 hover:bg-purple-950/40'
                          : 'hover:bg-vault-surface/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 sm:px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(tier._id)}
                          className="text-zinc-400 hover:text-purple-400 transition-colors p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Game */}
                      <td className="py-2.5 px-3 sm:px-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          {tier.game?.coverImage && (
                            <img
                              src={tier.game.coverImage}
                              alt=""
                              className="w-6 h-8 rounded object-cover border border-zinc-800 shrink-0"
                              onError={(e) => {
                                e.target.src = '/logo.jpeg';
                              }}
                            />
                          )}
                          <span className="truncate max-w-[150px]">{tier.game?.title || 'Unknown Game'}</span>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-2.5 px-3 sm:px-4">
                        <div className="font-bold text-purple-300">{tier.title}</div>
                        {tier.description && (
                          <div className="text-[10px] text-zinc-400 truncate max-w-[150px]">{tier.description}</div>
                        )}
                      </td>

                      {/* Duration */}
                      <td className="py-2.5 px-3 sm:px-4 font-mono">
                        <span className="px-2 py-0.5 rounded bg-vault-surface border border-zinc-800 text-zinc-300 text-[11px]">
                          {tier.durationHours} {tier.durationHours === 1 ? 'Hour' : 'Hours'}
                        </span>
                      </td>

                      {/* Rental Price */}
                      <td className="py-2.5 px-3 sm:px-4 font-mono">
                        <div className="font-gaming font-bold text-sm sm:text-base text-emerald-400">
                          ₹{tier.price}
                        </div>
                        {tier.originalPrice && (
                          <div className="text-[10px] text-zinc-500 line-through">
                            ₹{tier.originalPrice}
                          </div>
                        )}
                      </td>

                      {/* Type */}
                      <td className="py-2.5 px-3 sm:px-4 uppercase text-[10px] font-semibold text-zinc-400">
                        {tier.pricingType || 'hourly'}
                      </td>

                      {/* Badge */}
                      <td className="py-2.5 px-3 sm:px-4 text-center">
                        {tier.badge ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                            {tier.badge}
                          </span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Active Switch */}
                      <td className="py-2.5 px-3 sm:px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(tier)}
                          className={`w-7 h-3.5 rounded-full transition-colors relative inline-block ${
                            tier.isActive ? 'bg-emerald-600' : 'bg-zinc-700'
                          }`}
                          title="Enable / Disable Tier"
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                              tier.isActive ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 sm:px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(tier)}
                            className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-purple-400 text-zinc-400 hover:text-white"
                            title="Edit Tier"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmationId(tier._id)}
                            className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-rose-400 text-zinc-400 hover:text-rose-400"
                            title="Delete Tier"
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
          entityName="pricing tiers"
        />
      </div>

      {/* Add / Edit Tier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div
            className="w-full max-w-lg bg-vault-card border border-purple-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-y-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-3.5">
              <h3 className="font-gaming font-bold text-lg sm:text-xl text-white">
                {editingTier ? 'Edit Pricing Tier' : 'Add Pricing Tier'}
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

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Target Game *</label>
                <select
                  required
                  value={formData.game}
                  onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                >
                  <option value="">Select Game</option>
                  {games.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.title} (Base: ₹{g.hourlyPrice}/hr)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Duration (Hours) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Pricing Type</label>
                  <select
                    value={formData.pricingType}
                    onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  >
                    <option value="hourly">Hourly (1 hr)</option>
                    <option value="multi-hour">Multi-Hour (2-5 hrs)</option>
                    <option value="daily">Daily (24 hrs)</option>
                    <option value="weekly">Weekly (168 hrs)</option>
                    <option value="package">Package</option>
                    <option value="promotional">Promo</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Tier Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 Hours Duo Pass, 3 Hours Marathon"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Price (₹) *</label>
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
                    placeholder="Strikethrough"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Save 15%, Popular, Best Value"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded bg-vault-surface border-zinc-700 text-purple-600 focus:ring-0"
                  />
                  <span className="text-zinc-200">Popular</span>
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

              <div className="pt-3 border-t border-purple-500/15 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Save Tier
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
            <h3 className="font-gaming font-bold text-lg text-white">Delete Pricing Tier?</h3>
            <p className="mt-1.5 text-xs text-zinc-300">
              This will remove this pricing option from the game.
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

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        count={selectedIds.length}
        entityName="pricing tiers"
        loading={bulkDeleting}
      />
    </div>
  );
};

export default RentalPricing;
