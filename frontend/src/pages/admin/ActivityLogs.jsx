import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Filter,
  Activity,
  Clock,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  CheckSquare,
  Square,
  MinusSquare,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import TablePagination from '../../components/admin/TablePagination';
import BulkActionBar from '../../components/admin/BulkActionBar';
import BulkDeleteModal from '../../components/admin/BulkDeleteModal';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('all');
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

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard/logs', {
        params: {
          page,
          limit,
          module: moduleFilter !== 'all' ? moduleFilter : undefined,
          search: search.trim() || undefined,
        },
      });
      if (res.data.success) {
        setLogs(res.data.data || []);
        setTotal(res.data.total ?? 0);
        setTotalPages(res.data.totalPages ?? 1);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter, page, limit, search]);

  const handleModuleSelect = (mod) => {
    setModuleFilter(mod);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Bulk selection helpers
  const allPageSelected = logs.length > 0 && logs.every((l) => selectedIds.includes(l._id));
  const somePageSelected = logs.some((l) => selectedIds.includes(l._id)) && !allPageSelected;

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPage = () => {
    if (allPageSelected) {
      const pageIds = new Set(logs.map((l) => l._id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = logs.map((l) => l._id);
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
      const res = await api.post('/admin/dashboard/logs/bulk-delete', { ids: selectedIds });
      if (res.data.success) {
        toast.success(`Successfully deleted ${selectedIds.length} audit log entries.`);
        setActionFeedback({
          type: 'success',
          text: `Successfully deleted ${selectedIds.length} audit log entries.`,
        });
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
        fetchLogs();
      }
    } catch (err) {
      console.error('Bulk delete logs failed:', err);
      const errText = err.response?.data?.message || 'Failed to delete selected log entries.';
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-xl sm:text-2xl text-white tracking-wide">
            Security & Activity Audit Logs
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1">
            Complete tamper-evident log of all admin operations stored in MongoDB.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-vault-card border border-purple-500/20 hover:border-purple-400 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
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

      {/* Search & Module filter bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-vault-card border border-purple-500/15 space-y-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, details, or IP address..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {['all', 'Auth', 'Games', 'Categories', 'RentalPlans', 'Settings', 'Media'].map(
            (m) => (
              <button
                key={m}
                onClick={() => handleModuleSelect(m)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all shrink-0 ${
                  moduleFilter === m
                    ? 'bg-purple-600 text-white shadow-glow-sm'
                    : 'bg-vault-surface text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {m}
              </button>
            )
          )}
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        entityName="audit log entries"
        onClear={handleClearSelection}
        onDelete={() => setIsBulkDeleteOpen(true)}
      />

      {/* Logs Table */}
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
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10 font-sans">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    Loading activity logs from database...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    No activity logs recorded matching criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isSelected = selectedIds.includes(log._id);
                  return (
                    <tr
                      key={log._id}
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
                          onClick={() => handleToggleSelect(log._id)}
                          className="text-zinc-400 hover:text-purple-400 transition-colors p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-zinc-300">
                        {log.module}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 max-w-md">
                        {log.details || '—'}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {log.adminName || log.admin?.username || 'Admin'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-zinc-500">
                        {log.ipAddress || '127.0.0.1'}
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
          entityName="audit logs"
        />
      </div>

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        count={selectedIds.length}
        entityName="audit log entries"
        loading={bulkDeleting}
      />
    </div>
  );
};

export default ActivityLogs;
