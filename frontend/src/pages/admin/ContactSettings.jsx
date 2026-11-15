import React, { useState, useEffect } from 'react';
import { PhoneCall, Save, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import { useWebsite } from '../../context/WebsiteContext';

const ContactSettings = () => {
  const { refreshSettings } = useWebsite();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    whatsappNumber: '8904004036',
    whatsappCountryCode: '91',
    whatsappMessageTemplate: '',
    contactPhone: '+91 8904004036',
    contactEmail: 'Playvaultklb@gmail.com',
    googleMapsUrl: "https://www.google.com/maps/place/17%C2%B017'53.7%22N+76%C2%B049'49.0%22E/@17.2983117,76.829671,19z/data=!4m4!3m3!8m2!3d17.29825!4d76.8302778?hl=en&entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D",
    address: 'Kalaburagi (Gulbarga), Karnataka, India',
    workingHours: 'Everyday: 10:00 AM – 11:00 PM (WhatsApp 24/7)',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings/admin');
        if (res.data.success && res.data.data) {
          setForm({
            whatsappNumber: res.data.data.whatsappNumber || '8904004036',
            whatsappCountryCode: res.data.data.whatsappCountryCode || '91',
            whatsappMessageTemplate: res.data.data.whatsappMessageTemplate || '',
            contactPhone: res.data.data.contactPhone || '+91 8904004036',
            contactEmail: res.data.data.contactEmail || 'Playvaultklb@gmail.com',
            googleMapsUrl: res.data.data.googleMapsUrl || "https://www.google.com/maps/place/17%C2%B017'53.7%22N+76%C2%B049'49.0%22E/@17.2983117,76.829671,19z/data=!4m4!3m3!8m2!3d17.29825!4d76.8302778?hl=en&entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D",
            address: res.data.data.address || 'Kalaburagi (Gulbarga), Karnataka, India',
            workingHours: res.data.data.workingHours || 'Everyday: 10:00 AM – 11:00 PM (WhatsApp 24/7)',
          });
        }
      } catch (err) {
        console.error('Failed to load contact settings:', err);
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
      setError(err.response?.data?.message || 'Failed to update contact settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading contact settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-gaming font-extrabold text-2xl text-white tracking-wide">
            Contact & WhatsApp Settings
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure the primary business WhatsApp number and contact channels. All booking redirects update dynamically.
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
          <span>Contact settings updated successfully! All booking buttons now target this number.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-vault-card border border-purple-500/15 space-y-5 text-xs">
        {/* WhatsApp Specific */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Primary WhatsApp Booking Line</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Country Code</label>
              <input
                type="text"
                placeholder="91"
                value={form.whatsappCountryCode}
                onChange={(e) => setForm({ ...form, whatsappCountryCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-zinc-300 mb-1">WhatsApp Number (10 Digits) *</label>
              <input
                type="text"
                required
                placeholder="8904004036"
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono text-sm"
              />
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                Target URL: https://wa.me/{form.whatsappCountryCode}{form.whatsappNumber}
              </span>
            </div>
          </div>
        </div>

        {/* General Direct Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Display Phone Number</label>
            <input
              type="text"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Contact Email Address</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-zinc-300 mb-1">Physical Location / Service Base</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-semibold text-zinc-300">Google Maps Location Link</label>
            {form.googleMapsUrl && (
              <a
                href={form.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Test in Google Maps ↗
              </a>
            )}
          </div>
          <input
            type="url"
            placeholder="https://www.google.com/maps/place/..."
            value={form.googleMapsUrl}
            onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none font-mono text-[11px]"
          />
          <span className="text-[10px] text-zinc-500 mt-1 block">
            Used across the website in footer, contact, and about sections so users can navigate directly to your shop/hub.
          </span>
        </div>

        <div>
          <label className="block font-semibold text-zinc-300 mb-1">Operating / Support Hours</label>
          <input
            type="text"
            value={form.workingHours}
            onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white outline-none"
          />
        </div>
      </form>
    </div>
  );
};

export default ContactSettings;
