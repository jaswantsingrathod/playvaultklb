import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  FolderTree,
  CircleDollarSign,
  CalendarDays,
  FileText,
  Image as ImageIcon,
  PhoneCall,
  Share2,
  UserCheck,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Games', path: '/admin/games', icon: Gamepad2 },
    { name: 'Game Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Rental Pricing', path: '/admin/pricing', icon: CircleDollarSign },
    { name: 'Rental Plans', path: '/admin/rental-plans', icon: CalendarDays },
    { name: 'Website Content', path: '/admin/content', icon: FileText },
    { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { name: 'Contact Settings', path: '/admin/contact', icon: PhoneCall },
    { name: 'Social Media', path: '/admin/social', icon: Share2 },
    { name: 'Admin Profile', path: '/admin/profile', icon: UserCheck },
    { name: 'Security & Logs', path: '/admin/logs', icon: ShieldAlert },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const currentMenu = menuItems.find((m) => m.path === location.pathname) || { name: 'Admin Portal' };

  return (
    <div className="min-h-screen bg-vault-bg text-vault-text flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-vault-surface border-r border-purple-500/15 shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-purple-500/15">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <img
              src="/logo.jpeg"
              alt="PlayVault Logo"
              className="h-8 w-auto object-contain rounded-lg border border-purple-500/30 shadow-glow-sm bg-vault-card p-0.5"
            />
            <div>
              <span className="font-gaming font-extrabold text-xl text-white tracking-wider">
                PLAY<span className="text-purple-400">VAULT</span>
              </span>
              <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ADMIN
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Management Modules
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-glow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-vault-card'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </div>

        {/* Admin User Info & Logout Footer */}
        <div className="p-3 border-t border-purple-500/15 bg-vault-card/50">
          <div className="flex items-center gap-2.5 px-2 py-1.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-900 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-bold shrink-0">
              {admin?.username ? admin.username.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{admin?.fullName || admin?.username || 'Admin'}</div>
              <div className="text-[10px] text-zinc-400 truncate">{admin?.email || 'admin@playvaultklb.com'}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 sm:h-16 bg-vault-surface/80 backdrop-blur-md border-b border-purple-500/15 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-vault-card border border-zinc-800 text-zinc-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-gaming font-bold text-base sm:text-xl text-white tracking-wide truncate">
              {currentMenu.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Public Website */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all whitespace-nowrap"
            >
              <span className="hidden xs:inline">View Public Site</span>
              <span className="xs:hidden">Site</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>

            {/* Quick user avatar */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-800">
              <div className="w-7 h-7 rounded-full bg-purple-900/80 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xs text-zinc-300 font-medium truncate max-w-[100px]">{admin?.username || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)}>
            <div
              className="w-64 max-w-[80vw] bg-vault-surface border-r border-purple-500/20 flex flex-col h-full animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-purple-500/15">
                <div className="flex items-center gap-2">
                  <img src="/logo.jpeg" alt="Logo" className="h-7 w-auto object-contain rounded-lg border border-purple-500/30" />
                  <span className="font-gaming font-bold text-base text-white">PLAYVAULT ADMIN</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-vault-card'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-3 border-t border-purple-500/15">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/20 border border-rose-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Outlet with Responsive Padding */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
