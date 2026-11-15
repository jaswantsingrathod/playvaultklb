import React, { useState, useEffect } from 'react';
import { Share2, Save, Instagram, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { useWebsite } from '../../context/WebsiteContext';

const SocialSettings = () => {
  const { refreshSettings } = useWebsite();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    instagramUrl: 'https://www.instagram.com/playvaultklb/',
    instagramHandle: '@playvaultklb',
    facebookUrl: '',
    youtubeUrl: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings/admin');
        if (res.data.success && res.data.data) {
          setForm({
            instagramUrl: res.data.data.instagramUrl || 'https://www.instagram.com/playvaultklb/',
            instagramHandle: res.data.data.instagramHandle || '@playvaultklb',
            facebookUrl: res.data.data.facebookUrl || '',
            youtubeUrl: res.data.data.youtubeUrl || '',
          });
        }
      } catch (err) {
        console.error('Failed to load social settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setSaving(true);
      const res = await api.put('/settings/admin', form);
      if (res.data.success) {
        setSuccess(true);
        refreshSettings();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update social media settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading social settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-2xl text-white tracking-wide">
            Social Media Settings
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your official PlayVaultKLB Instagram profile link and community social accounts.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-glow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Social links updated successfully! All navigation and footer links now point to this page.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-6 text-xs">
        {/* Instagram Profile Box */}
        <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-pink-400 font-bold uppercase tracking-wider text-xs">
              <Instagram className="w-4 h-4" />
              <span>Official Instagram Integration</span>
            </div>

            {form.instagramUrl && (
              <a
                href={form.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>Test Profile Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Official Instagram URL *</label>
              <input
                type="url"
                required
                placeholder="https://www.instagram.com/playvaultklb/"
                value={form.instagramUrl}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Instagram Display Handle</label>
              <input
                type="text"
                placeholder="@playvaultklb"
                value={form.instagramHandle}
                onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Other Social Networks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Facebook Page (Optional)</label>
            <input
              type="url"
              placeholder="https://facebook.com/..."
              value={form.facebookUrl}
              onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">YouTube Channel (Optional)</label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SocialSettings;
