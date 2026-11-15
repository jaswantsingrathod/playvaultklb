import React, { useState, useEffect } from 'react';
import { ShieldAlert, Filter, Activity, Clock, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard/logs', {
        params: {
          module: moduleFilter !== 'all' ? moduleFilter : undefined,
          limit: 100,
        },
      });
      if (res.data.success) {
        setLogs(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-2xl text-white tracking-wide">
            Security & Activity Audit Logs
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Complete tamper-evident log of all admin operations stored in MongoDB.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-xl bg-vault-card border border-purple-500/20 hover:border-purple-400 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Module filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {['all', 'Auth', 'Games', 'Categories', 'Pricing', 'RentalPlans', 'Settings', 'Media'].map(
          (m) => (
            <button
              key={m}
              onClick={() => setModuleFilter(m)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                moduleFilter === m
                  ? 'bg-purple-600 text-white'
                  : 'bg-vault-card text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {m}
            </button>
          )
        )}
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-vault-card border border-purple-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vault-surface/80 border-b border-purple-500/15 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
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
                  <td colSpan="6" className="py-12 text-center text-zinc-400">Loading activity logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-zinc-400">No activity logs recorded for this module.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-vault-surface/40 transition-colors">
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
                      {log.adminName || 'Admin'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-zinc-500">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
