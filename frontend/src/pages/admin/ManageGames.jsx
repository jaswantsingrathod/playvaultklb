import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Star,
  Coins,
  Flame,
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  Square,
  MinusSquare,
  Archive,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import TablePagination from '../../components/admin/TablePagination';
import ImageUploadCropper from '../../components/admin/ImageUploadCropper';

const ManageGames = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Server-side pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Bulk selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const initialFormState = {
    title: '',
    slug: '',
    description: '',
    coverImage: '',
    bannerImage: '',
    genre: 'Action',
    category: '',
    platform: 'PS5',
    hourlyPrice: 50,
    dailyPrice: 350,
    specialPrice: '',
    isAvailable: true,
    isFeatured: false,
    isActive: true,
    rating: 4.8,
    releaseYear: 2024,
    tags: '4K HDR, DualSense, 60 FPS',
    players: '1-2 Players',
    storageRequired: '75 GB',
    displayOrder: 0,
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchGamesAndCategories = async () => {
    try {
      setLoading(true);
      const [gamesRes, catRes] = await Promise.all([
        api.get('/games/admin/all', {
          params: {
            page,
            limit,
            search: search.trim() || undefined,
            category: filterCategory || undefined,
            status: filterStatus !== 'all' ? filterStatus : undefined,
          },
        }),
        api.get('/categories/admin'),
      ]);

      if (gamesRes.data.success) {
        setGames(gamesRes.data.data || []);
        setTotal(gamesRes.data.total ?? 0);
        setTotalPages(gamesRes.data.totalPages ?? 1);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamesAndCategories();
  }, [page, limit, search, filterCategory, filterStatus]);

  // Bulk selection helpers
  const allPageSelected = games.length > 0 && games.every((g) => selectedIds.includes(g._id));
  const somePageSelected = games.some((g) => selectedIds.includes(g._id)) && !allPageSelected;

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPage = () => {
    if (allPageSelected) {
      const pageIds = new Set(games.map((g) => g._id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = games.map((g) => g._id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async (permanent = false) => {
    if (selectedIds.length === 0) return;
    try {
      setBulkDeleting(true);
      const res = await api.post('/games/admin/bulk-delete', {
        ids: selectedIds,
        permanent,
      });

      if (res.data.success) {
        const msg = permanent
          ? `Permanently deleted ${selectedIds.length} game(s) successfully.`
          : `Archived ${selectedIds.length} game(s) successfully.`;
        toast.success(msg);
        setActionFeedback({
          type: 'success',
          text: msg,
        });
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
        fetchGamesAndCategories();
      }
    } catch (err) {
      console.error('Bulk delete failed:', err);
      const errMsg = err.response?.data?.message || 'Bulk delete failed. Please try again.';
      toast.error(errMsg);
      setActionFeedback({
        type: 'error',
        text: errMsg,
      });
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleOpenAdd = () => {
    setEditingGame(null);
    setFormData({
      ...initialFormState,
      category: categories[0]?._id || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (game) => {
    setEditingGame(game);
    setFormData({
      title: game.title || '',
      slug: game.slug || '',
      description: game.description || '',
      coverImage: game.coverImage || '',
      bannerImage: game.bannerImage || '',
      genre: game.genre || 'Action',
      category: game.category?._id || game.category || '',
      platform: game.platform || 'PS5',
      hourlyPrice: game.hourlyPrice || 50,
      dailyPrice: game.dailyPrice || 350,
      specialPrice: game.specialPrice || '',
      isAvailable: game.isAvailable !== undefined ? game.isAvailable : true,
      isFeatured: game.isFeatured !== undefined ? game.isFeatured : false,
      isActive: game.isActive !== undefined ? game.isActive : true,
      rating: game.rating || 4.8,
      releaseYear: game.releaseYear || 2024,
      tags: Array.isArray(game.tags) ? game.tags.join(', ') : '',
      players: game.players || '1-2 Players',
      storageRequired: game.storageRequired || '75 GB',
      displayOrder: game.displayOrder || 0,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (game, field) => {
    try {
      const updatedValue = !game[field];
      await api.put(`/games/admin/${game._id}`, {
        [field]: updatedValue,
      });

      setGames((prev) =>
        prev.map((g) => (g._id === game._id ? { ...g, [field]: updatedValue } : g))
      );
      toast.success(`${game.title} updated.`);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      toast.error('Failed to update game status.');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.coverImage || !formData.genre) {
      const err = 'Game Title, Cover Image, and Genre are required.';
      setFormError(err);
      toast.error(err);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        hourlyPrice: Number(formData.hourlyPrice),
        dailyPrice: Number(formData.dailyPrice),
        specialPrice: formData.specialPrice ? Number(formData.specialPrice) : null,
        rating: Number(formData.rating),
        releaseYear: Number(formData.releaseYear),
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      };

      if (editingGame) {
        await api.put(`/games/admin/${editingGame._id}`, payload);
        toast.success(`Game "${formData.title}" updated successfully!`);
      } else {
        await api.post('/games/admin', payload);
        toast.success(`Game "${formData.title}" added to vault!`);
      }

      setIsModalOpen(false);
      fetchGamesAndCategories();
    } catch (err) {
      const errText = err.response?.data?.message || 'Error saving game details.';
      setFormError(errText);
      toast.error(errText);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (permanent = false) => {
    if (!deleteConfirmationId) return;
    try {
      await api.delete(`/games/admin/${deleteConfirmationId}?permanent=${permanent}`);
      const msg = permanent ? 'Game permanently deleted.' : 'Game archived successfully.';
      toast.success(msg);
      setActionFeedback({
        type: 'success',
        text: msg,
      });
      setSelectedIds((prev) => prev.filter((id) => id !== deleteConfirmationId));
      setDeleteConfirmationId(null);
      fetchGamesAndCategories();
    } catch (err) {
      console.error('Delete failed:', err);
      const errMsg = err.response?.data?.message || 'Delete operation failed.';
      toast.error(errMsg);
      setActionFeedback({
        type: 'error',
        text: errMsg,
      });
    }
  };



  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-xl sm:text-2xl text-white tracking-wide">
            Manage PlayStation 5 Games
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1">
            Add, update, activate/deactivate, and configure pricing models for all games.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-glow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Game</span>
        </button>
      </div>

      {/* Action Banner (Success or Error Feedback) */}
      {actionFeedback && (
        <div
          className={`p-3 rounded-2xl text-xs flex items-center justify-between gap-2 border transition-all ${
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
          <button
            onClick={() => setActionFeedback(null)}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-vault-card border border-purple-500/15 flex flex-wrap items-center gap-2.5 sm:gap-4">
        <div className="flex-1 min-w-[180px] relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search game title or genre..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs outline-none"
          />
        </div>

        <select
          value={filterCategory}
          onChange={handleCategoryChange}
          className="px-2.5 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 text-white text-xs outline-none focus:border-purple-400"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={handleStatusChange}
          className="px-2.5 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 text-white text-xs outline-none focus:border-purple-400"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="available">Available in Stock</option>
          <option value="rented">Currently Rented</option>
        </select>
      </div>

      {/* Bulk Actions Bar (Shown when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-200 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{selectedIds.length} Selected</span>
            </div>
            <span className="text-xs text-zinc-300 hidden sm:inline">
              Selected across pages. You can batch-delete or archive selected games.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearSelection}
              className="px-3 py-1.5 rounded-xl bg-vault-surface hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold transition-all"
            >
              Clear Selection
            </button>

            <button
              onClick={() => setIsBulkDeleteOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-sm transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Games Table with Horizontal Scroll Wrapper */}
      <div className="rounded-2xl bg-vault-card border border-purple-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
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
                <th className="py-2.5 px-3 sm:px-4">Genre / Category</th>
                <th className="py-2.5 px-3 sm:px-4">Base Pricing</th>
                <th className="py-2.5 px-3 sm:px-4">Pricing Engine</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Availability</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Featured</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Status</th>
                <th className="py-2.5 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-zinc-400">
                    Loading games from database...
                  </td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-zinc-400">
                    No games found matching criteria. Click "Add New Game" to create one.
                  </td>
                </tr>
              ) : (
                games.map((game) => {
                  const isSelected = selectedIds.includes(game._id);
                  return (
                    <tr
                      key={game._id}
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
                          onClick={() => handleToggleSelect(game._id)}
                          className="text-zinc-400 hover:text-purple-400 transition-colors p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Game Cover & Title */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={game.coverImage}
                            alt={game.title}
                            className="w-9 h-12 rounded-lg object-cover bg-vault-surface border border-zinc-800 shrink-0"
                            onError={(e) => {
                              e.target.src = '/logo.jpeg';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-white text-xs sm:text-sm truncate max-w-[180px]">
                              {game.title}
                            </div>
                            <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                              <span className="text-purple-300 font-medium">{game.platform || 'PS5'}</span>
                              <span>•</span>
                              <span className="flex items-center text-yellow-400 gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-current" /> {game.rating || 4.8}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Genre / Category */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="font-medium text-white">{game.genre}</div>
                        <div className="text-[10px] text-zinc-400">{game.category?.name || 'General'}</div>
                      </td>

                      {/* Base Pricing */}
                      <td className="py-3 px-3 sm:px-4 font-mono">
                        <div className="text-emerald-400 font-bold">₹{game.hourlyPrice}/hr</div>
                        <div className="text-[10px] text-zinc-400">₹{game.dailyPrice}/day</div>
                      </td>

                      {/* Pricing Engine Link */}
                      <td className="py-3 px-3 sm:px-4">
                        <Link
                          to={`/admin/pricing?gameId=${game._id}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 text-[10px] font-semibold transition-colors"
                        >
                          <Coins className="w-3 h-3 shrink-0" />
                          <span>{game.pricingCount || 0} Tiers</span>
                        </Link>
                      </td>

                      {/* Available Toggle */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(game, 'isAvailable')}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-all ${
                            game.isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {game.isAvailable ? 'Available' : 'Rented'}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(game, 'isFeatured')}
                          className={`p-1 rounded-lg border transition-all ${
                            game.isFeatured
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-zinc-800 text-zinc-600 border-zinc-700'
                          }`}
                          title="Toggle Featured"
                        >
                          <Flame className="w-3 h-3 fill-current" />
                        </button>
                      </td>

                      {/* Active/Inactive Toggle */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(game, 'isActive')}
                          className={`w-7 h-3.5 rounded-full transition-colors relative inline-block ${
                            game.isActive ? 'bg-purple-600' : 'bg-zinc-700'
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                              game.isActive ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(game)}
                            className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-purple-400 text-zinc-400 hover:text-white transition-colors"
                            title="Edit Game"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmationId(game._id)}
                            className="p-1.5 rounded-lg bg-vault-surface border border-zinc-800 hover:border-rose-400 text-zinc-400 hover:text-rose-400 transition-colors"
                            title="Delete Game"
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
          onLimitChange={handleLimitChange}
          entityName="games"
        />
      </div>

      {/* Add / Edit Game Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-vault-card border border-purple-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-y-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-purple-500/15 mb-4 sm:mb-6">
              <h3 className="font-gaming font-bold text-lg sm:text-2xl text-white truncate pr-2">
                {editingGame ? `Edit Game: ${editingGame.title}` : 'Add New PS5 Game'}
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

            <form onSubmit={handleSubmitForm} className="space-y-3.5 sm:space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Game Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Theft Auto V"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">URL Slug (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. grand-theft-auto-v"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Cinematic description of gameplay, graphics, haptics..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ImageUploadCropper
                  label="Cover Image (Vertical Poster)"
                  required
                  value={formData.coverImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                  aspect={3 / 4}
                  tag="game-cover"
                  helperText="Aspect ratio 3:4 portrait optimal for game box cover"
                />

                <ImageUploadCropper
                  label="Banner Image (Widescreen)"
                  value={formData.bannerImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, bannerImage: url }))}
                  aspect={16 / 9}
                  tag="game-banner"
                  helperText="Aspect ratio 16:9 cinematic widescreen header"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Genre *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Action-Adventure"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Platform</label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="p-3 sm:p-4 rounded-xl bg-vault-surface/60 border border-purple-500/15">
                <div className="font-semibold text-white mb-2 text-xs uppercase tracking-wider text-purple-300">
                  Base Rates (Pricing engine creates duration tiers)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Hourly Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.hourlyPrice}
                      onChange={(e) => setFormData({ ...formData, hourlyPrice: e.target.value })}
                      className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-card border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Daily Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.dailyPrice}
                      onChange={(e) => setFormData({ ...formData, dailyPrice: e.target.value })}
                      className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-card border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Special Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Optional"
                      value={formData.specialPrice}
                      onChange={(e) => setFormData({ ...formData, specialPrice: e.target.value })}
                      className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-card border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Extra specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Rating (1 to 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Players</label>
                  <input
                    type="text"
                    value={formData.players}
                    onChange={(e) => setFormData({ ...formData, players: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Storage Required</label>
                  <input
                    type="text"
                    value={formData.storageRequired}
                    onChange={(e) => setFormData({ ...formData, storageRequired: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded bg-vault-surface border-zinc-700 text-purple-600 focus:ring-0"
                  />
                  <span className="text-zinc-200">Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-vault-surface border-zinc-700 text-purple-600 focus:ring-0"
                  />
                  <span className="text-zinc-200">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
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
                  disabled={submitting}
                  className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-glow-sm"
                >
                  {submitting ? 'Saving...' : editingGame ? 'Update Game' : 'Save Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Dialog */}
      {deleteConfirmationId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setDeleteConfirmationId(null)}
        >
          <div
            className="w-full max-w-sm bg-vault-card border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-gaming font-bold text-lg sm:text-xl text-white">Confirm Removal</h3>
            <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to remove this game? Choose soft archive or permanent deletion.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2 sm:gap-2.5">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(false)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
              >
                Archive
              </button>
              <button
                onClick={() => handleDelete(true)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {isBulkDeleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => !bulkDeleting && setIsBulkDeleteOpen(false)}
        >
          <div
            className="w-full max-w-md bg-vault-card border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-rose-400 mb-2">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="font-gaming font-bold text-lg sm:text-xl text-white">
                Bulk Remove Games
              </h3>
            </div>

            <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
              You have selected <span className="font-bold text-white text-sm">{selectedIds.length}</span> games.
              Choose whether to soft-archive them (hide from users) or permanently wipe them and their pricing tiers from the database.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-vault-surface border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Archive className="w-3.5 h-3.5" />
                <span>Archive Option (Recommended)</span>
              </div>
              <p>Hides games from catalog and disables booking while preserving historical data.</p>
              <div className="flex items-center gap-2 text-rose-400 font-semibold pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Permanent Delete</span>
              </div>
              <p>Irreversible deletion of games and associated pricing matrices.</p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
              <button
                type="button"
                disabled={bulkDeleting}
                onClick={() => setIsBulkDeleteOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={bulkDeleting}
                onClick={() => handleBulkDelete(false)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive ({selectedIds.length})</span>
              </button>

              <button
                type="button"
                disabled={bulkDeleting}
                onClick={() => handleBulkDelete(true)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-glow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{bulkDeleting ? 'Deleting...' : `Delete (${selectedIds.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGames;
