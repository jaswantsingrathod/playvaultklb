import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Gamepad2, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please provide both username/email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(identifier, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Connection failed. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setIdentifier('admin@playvaultklb.com');
    setPassword('PlayVault@2025!');
  };

  return (
    <div className="min-h-screen bg-vault-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-purple-700/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl bg-vault-card border border-purple-500/30 p-8 shadow-2xl shadow-purple-950/40">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <img
              src="/logo.jpeg"
              alt="PlayVaultKLB"
              className="h-16 w-auto mx-auto mb-4 object-contain rounded-2xl shadow-glow-sm border border-purple-500/30 p-1 bg-vault-surface"
            />
            <h1 className="font-gaming font-extrabold text-2xl text-white tracking-wider">
              PLAY<span className="text-purple-400">VAULT</span> ADMIN
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              Secure Management Portal for PlayVaultKLB
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Admin Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="admin@playvaultklb.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-sm outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-sm outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all transform active:scale-95 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 pt-5 border-t border-purple-500/15 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-purple-400 hover:text-purple-300 underline font-medium"
            >
              Use Initial Seed Credentials (admin@playvaultklb.com)
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
