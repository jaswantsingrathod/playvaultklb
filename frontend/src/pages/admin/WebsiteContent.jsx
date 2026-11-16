import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useWebsite } from '../../context/WebsiteContext';
import ImageUploadCropper from '../../components/admin/ImageUploadCropper';

const WebsiteContent = () => {
  const { refreshSettings } = useWebsite();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    siteName: 'PlayVaultKLB',
    tagline: 'Premium PS5 Rental Services',
    heroHeading: 'YOUR NEXT GAMING SESSION STARTS HERE.',
    heroSubheading:
      'Experience premium PlayStation 5 gaming without the commitment of buying a console. Pick your favourite games, choose your rental duration and start playing.',
    heroBadge: '⚡ Ultra-Fast 4K PS5 Gaming • Kalaburagi / KLB',
    heroBgImage: '',
    announcementText: '🎮 Weekend slots filling fast! Book your PS5 console on WhatsApp now.',
    announcementActive: true,
    aboutTitle: 'About PlayVaultKLB',
    aboutText: '',
    termsText: '',
    privacyText: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings/admin');
        if (res.data.success && res.data.data) {
          setForm((prev) => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSavedSuccess(false);

    try {
      setSaving(true);
      const res = await api.put('/settings/admin', form);
      if (res.data.success) {
        toast.success('Website content and CMS updated successfully!');
        setSavedSuccess(true);
        refreshSettings();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      const errText = err.response?.data?.message || 'Failed to update website content.';
      toast.error(errText);
      setError(errText);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading website content CMS...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-2xl text-white tracking-wide">
            Website Content & CMS
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Update marketing headlines, hero text, announcement banner, about us, terms, and policies.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-glow-sm transition-all"
        >
          {saving ? 'Saving...' : (
            <>
              <Save className="w-4 h-4" />
              <span>Save CMS Changes</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website content updated successfully! Public website is immediately updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Brand Identity */}
        <div className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-4">
          <h3 className="font-gaming font-bold text-lg text-white uppercase tracking-wider text-purple-300">
            Brand Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Website Title</label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-4">
          <h3 className="font-gaming font-bold text-lg text-white uppercase tracking-wider text-purple-300">
            Cinematic Hero Section
          </h3>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Hero Top Badge Text</label>
            <input
              type="text"
              value={form.heroBadge}
              onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Main Headline</label>
            <input
              type="text"
              value={form.heroHeading}
              onChange={(e) => setForm({ ...form, heroHeading: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-gaming text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Supporting Description</label>
            <textarea
              rows="3"
              value={form.heroSubheading}
              onChange={(e) => setForm({ ...form, heroSubheading: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none resize-none"
            />
          </div>

          <div>
            <ImageUploadCropper
              label="Hero Background Image"
              value={form.heroBgImage}
              onChange={(url) => setForm((prev) => ({ ...prev, heroBgImage: url }))}
              aspect={16 / 9}
              tag="website-banner"
              helperText="16:9 widescreen format recommended for homepage hero background"
            />
          </div>
        </div>

        {/* Announcement Ticker Banner */}
        <div className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-gaming font-bold text-lg text-white uppercase tracking-wider text-purple-300">
              Top Notification / Announcement Banner
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.announcementActive}
                onChange={(e) => setForm({ ...form, announcementActive: e.target.checked })}
                className="rounded bg-vault-surface border-zinc-700 text-purple-600 focus:ring-0"
              />
              <span className="text-zinc-300 font-semibold">Enable Banner</span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={form.announcementText}
              onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
            />
          </div>
        </div>

        {/* About Us Content */}
        <div className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-4">
          <h3 className="font-gaming font-bold text-lg text-white uppercase tracking-wider text-purple-300">
            About Us Story
          </h3>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">About Us Section Title</label>
            <input
              type="text"
              value={form.aboutTitle}
              onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">About Us Content</label>
            <textarea
              rows="4"
              value={form.aboutText}
              onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Terms & Conditions & Privacy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-3">
            <h3 className="font-gaming font-bold text-base text-white uppercase tracking-wider text-purple-300">
              Rental Terms & Conditions
            </h3>
            <textarea
              rows="6"
              value={form.termsText}
              onChange={(e) => setForm({ ...form, termsText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none resize-none font-sans"
            />
          </div>

          <div className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-3">
            <h3 className="font-gaming font-bold text-base text-white uppercase tracking-wider text-purple-300">
              Customer Privacy Policy
            </h3>
            <textarea
              rows="6"
              value={form.privacyText}
              onChange={(e) => setForm({ ...form, privacyText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none resize-none font-sans"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default WebsiteContent;
