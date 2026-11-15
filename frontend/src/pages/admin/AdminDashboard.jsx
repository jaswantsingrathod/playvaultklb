import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  CalendarDays,
  FolderTree,
  CircleDollarSign,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Activity,
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-pulse">
        <div className="h-24 sm:h-28 rounded-2xl bg-vault-card/60" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 sm:h-32 rounded-2xl bg-vault-card/60" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const latestGames = data?.latestGames || [];
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-950/60 via-vault-card to-vault-surface border border-purple-500/20 p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] sm:text-xs font-semibold mb-1.5 border border-purple-500/30">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>PlayVaultKLB Control Center</span>
            </div>
            <h2 className="font-gaming font-extrabold text-xl sm:text-3xl text-white tracking-wide">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl">
              Manage your PlayStation 5 games, configure game-specific pricing engine tiers, update rental packages, and monitor customer activity in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/admin/games"
              className="flex-1 sm:flex-initial px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-glow-sm transition-all whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Game</span>
            </Link>

            <Link
              to="/admin/pricing"
              className="flex-1 sm:flex-initial px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-vault-surface hover:bg-vault-card text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
            >
              <CircleDollarSign className="w-3.5 h-3.5" />
              <span>Pricing</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid - Responsive 2 cols on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Games */}
        <div className="rounded-2xl bg-vault-card border border-purple-500/15 p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Games</span>
            <div className="p-1.5 sm:p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-4 flex items-baseline justify-between">
            <span className="font-gaming font-extrabold text-2xl sm:text-3xl text-white">{stats.totalGames || 0}</span>
            <div className="text-[10px] sm:text-xs text-emerald-400 font-semibold">{stats.activeGames || 0} Active</div>
          </div>
          <div className="mt-2 pt-2 border-t border-purple-500/10 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>In Stock: {stats.availableGames || 0}</span>
            <span>Rented: {stats.rentedGames || 0}</span>
          </div>
        </div>

        {/* Rental Plans */}
        <div className="rounded-2xl bg-vault-card border border-purple-500/15 p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">Rental Plans</span>
            <div className="p-1.5 sm:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-4 flex items-baseline justify-between">
            <span className="font-gaming font-extrabold text-2xl sm:text-3xl text-white">{stats.totalPlans || 0}</span>
            <div className="text-[10px] sm:text-xs text-cyan-400 font-semibold">{stats.activePlans || 0} Active</div>
          </div>
          <div className="mt-2 pt-2 border-t border-purple-500/10 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>Official Plans</span>
            <Link to="/admin/rental-plans" className="text-cyan-400 hover:underline">Manage</Link>
          </div>
        </div>

        {/* Pricing Tiers Configured */}
        <div className="rounded-2xl bg-vault-card border border-purple-500/15 p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">Pricing Engine</span>
            <div className="p-1.5 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CircleDollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-4 flex items-baseline justify-between">
            <span className="font-gaming font-extrabold text-2xl sm:text-3xl text-white">{stats.activePricings || 0}</span>
            <div className="text-[10px] sm:text-xs text-emerald-400 font-semibold">Active Tiers</div>
          </div>
          <div className="mt-2 pt-2 border-t border-purple-500/10 text-[10px] text-zinc-400 flex items-center justify-between">
            <span>Avg: ₹{stats.avgHourlyPrice || 50}/hr</span>
            <span>₹{stats.avgDailyPrice || 350}/day</span>
          </div>
        </div>

        {/* Categories & Media */}
        <div className="rounded-2xl bg-vault-card border border-purple-500/15 p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400">Assets</span>
            <div className="p-1.5 sm:p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <FolderTree className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-4 flex items-baseline justify-between">
            <span className="font-gaming font-extrabold text-2xl sm:text-3xl text-white">{stats.totalCategories || 0}</span>
            <div className="text-[10px] sm:text-xs text-pink-400 font-semibold">{stats.totalMedia || 0} Media</div>
          </div>
          <div className="mt-2 pt-2 border-t border-purple-500/10 text-[10px] text-zinc-400 flex items-center justify-between">
            <Link to="/admin/categories" className="text-purple-400 hover:underline">Categories</Link>
            <Link to="/admin/media" className="text-pink-400 hover:underline">Media</Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Latest Games & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
        {/* Latest Games (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-vault-card border border-purple-500/15 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h3 className="font-gaming font-bold text-lg sm:text-xl text-white">Live Games Catalog</h3>
            </div>
            <Link to="/admin/games" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-purple-500/10">
            {latestGames.length > 0 ? (
              latestGames.map((game) => (
                <div key={game._id} className="py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="w-9 h-11 sm:w-11 sm:h-13 rounded-lg object-cover bg-vault-surface border border-zinc-800 shrink-0"
                      onError={(e) => {
                        e.target.src = '/logo.jpeg';
                      }}
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-white truncate">{game.title}</h4>
                      <div className="text-[10px] sm:text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5 truncate">
                        <span className="text-purple-400 font-medium">{game.genre}</span>
                        <span>•</span>
                        <span>₹{game.hourlyPrice}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {game.isAvailable ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] sm:text-[10px] font-bold border border-emerald-500/20">
                        Available
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] sm:text-[10px] font-bold border border-amber-500/20">
                        Rented
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-zinc-400">No games found.</div>
            )}
          </div>
        </div>

        {/* Recent Admin Activity Logs (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-vault-card border border-purple-500/15 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <h3 className="font-gaming font-bold text-lg sm:text-xl text-white">Recent Activities</h3>
              </div>
              <Link to="/admin/logs" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
                Full Log
              </Link>
            </div>

            <div className="space-y-2.5 sm:space-y-3.5">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((log) => (
                  <div key={log._id} className="p-2.5 sm:p-3 rounded-xl bg-vault-surface/60 border border-purple-500/10 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-purple-300 text-[11px] sm:text-xs">{log.action}</span>
                      <span className="text-[9px] sm:text-[10px] text-zinc-500">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-[10px] sm:text-[11px] line-clamp-1">{log.details || log.module}</p>
                    <div className="mt-1 text-[9px] sm:text-[10px] text-zinc-500 flex items-center justify-between">
                      <span>Module: {log.module}</span>
                      <span>By: {log.adminName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-zinc-400">No recent logs recorded.</div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-500/10 text-center">
            <span className="text-[11px] text-zinc-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Actions logged in MongoDB</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
