import React, { useState } from 'react';
import { MessageSquare, Instagram, MapPin, Clock, Send, Sparkles, Mail, ExternalLink } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import { createWhatsAppUrl, cleanPhoneNumber } from '../../utils/whatsapp';

const ContactSection = () => {
  const { settings, whatsappNumber, instagramUrl } = useWebsite();

  const [form, setForm] = useState({
    name: '',
    duration: '1-Day Plan (8 Hours - ₹699)',
    preferredGame: 'GTA V',
    addressOrArea: '',
    customNote: '',
  });

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    const lines = [
      `🎮 *PLAYVAULT KLB - CUSTOM PS5 BOOKING INQUIRY* 🎮`,
      ``,
      `Hello! I would like to book a PS5 console rental with the following custom details:`,
      ``,
      form.name ? `👤 *Customer Name:* ${form.name}` : '',
      `⏱️ *Plan / Duration:* ${form.duration}`,
      form.preferredGame ? `🕹️ *Primary Game:* ${form.preferredGame}` : '',
      form.addressOrArea ? `📍 *Delivery Area:* ${form.addressOrArea}, Kalaburagi` : `📍 *Location:* Kalaburagi, Karnataka`,
      form.customNote ? `💬 *Additional Request / Controllers:* ${form.customNote}` : '',
      ``,
      `📦 *Included Hardware:*`,
      `  ✓ Sony PlayStation 5 4K Console`,
      `  ✓ DualSense Wireless Controller`,
      `  ✓ High-Speed HDMI 2.1 & Power Cables`,
      `  ✓ Doorstep Setup & Support in Kalaburagi`,
      ``,
      `Please confirm if this slot is available and let me know the delivery schedule!`,
    ].filter(Boolean).join('\n');

    const url = createWhatsAppUrl(whatsappNumber, lines);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directWhatsAppUrl = `https://wa.me/${cleanPhoneNumber(whatsappNumber)}`;

  return (
    <section id="contact" className="py-14 sm:py-24 relative bg-vault-bg border-t border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Fast & Friendly Contact</span>
          </div>
          <h2 className="font-gaming font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase">
            Get in Touch With Us
          </h2>
          <p className="mt-2.5 sm:mt-4 text-zinc-400 text-xs sm:text-sm md:text-base px-2">
            Have questions about console availability, game titles, or rental plans? We are ready to assist 24/7 on WhatsApp!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Cards: Official WhatsApp and Instagram Buttons */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            {/* Primary WhatsApp Card */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-vault-card to-vault-surface border border-emerald-500/30 p-5 sm:p-7 shadow-lg shadow-emerald-950/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 sm:mb-4">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              </div>
              <h3 className="font-gaming font-bold text-xl sm:text-2xl text-white">Official WhatsApp</h3>
              <p className="mt-1 text-xs text-zinc-300">
                Direct booking line, fastest responses, real-time availability checks.
              </p>
              <div className="mt-3 sm:mt-4 font-mono font-bold text-lg sm:text-xl text-emerald-400">
                +91 {whatsappNumber || '8904004036'}
              </div>
              <div className="mt-4 sm:mt-5">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Official Instagram Card */}
            <div className="rounded-2xl bg-gradient-to-br from-pink-950/30 via-vault-card to-vault-surface border border-pink-500/30 p-5 sm:p-7 shadow-lg shadow-pink-950/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 mb-3 sm:mb-4">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-gaming font-bold text-xl sm:text-2xl text-white">Instagram Community</h3>
              <p className="mt-1 text-xs text-zinc-300">
                Follow our official page for new game arrivals, rental highlights, and customer stories.
              </p>
              <div className="mt-3 sm:mt-4 font-mono font-semibold text-base sm:text-lg text-pink-400">
                {settings.instagramHandle || '@playvaultklb'}
              </div>
              <div className="mt-4 sm:mt-5">
                <a
                  href={instagramUrl || 'https://www.instagram.com/playvaultklb/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Instagram className="w-4 h-4 shrink-0" />
                  <span>Follow @playvaultklb</span>
                </a>
              </div>
            </div>

            {/* Details: Address, Email & Timing */}
            <div className="rounded-2xl bg-vault-surface/60 border border-purple-500/15 p-4 sm:p-5 text-xs text-zinc-300 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">{settings.address || 'Kalaburagi (Gulbarga), Karnataka, India'}</div>
                  {settings.googleMapsUrl && (
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline font-semibold mt-0.5 transition-colors"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <a
                    href={`mailto:${settings.contactEmail || 'Playvaultklb@gmail.com'}`}
                    className="truncate hover:text-cyan-300 hover:underline transition-colors block text-zinc-200"
                  >
                    {settings.contactEmail || 'Playvaultklb@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.workingHours || 'Everyday: 10:00 AM – 11:00 PM (WhatsApp 24/7)'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Booking Request Form (Constructs WhatsApp Msg) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-vault-card border border-purple-500/20 p-5 sm:p-8 shadow-xl">
              <div className="flex items-center gap-1.5 mb-1.5 text-purple-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Instant WhatsApp Inquiry Builder</span>
              </div>
              <h3 className="font-gaming font-bold text-xl sm:text-2xl text-white">
                Customize Your Rental Request
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Fill in your preferred setup below and click the button. It will open WhatsApp with your customized booking details pre-written for instant confirmation.
              </p>

              <form onSubmit={handleWhatsAppSend} className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">
                      Desired Rental Plan / Duration
                    </label>
                    <select
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white text-xs sm:text-sm outline-none transition-all"
                    >
                      <option value="1-Day Plan (8 Hours - ₹699)">1-Day Plan (8 Hours - ₹699)</option>
                      <option value="2-Days Plan (32 Hours - ₹1,399)">2-Days Plan (32 Hours - ₹1,399)</option>
                      <option value="3-Days Plan (56 Hours - ₹1,799)">3-Days Plan (56 Hours - ₹1,799 - Popular)</option>
                      <option value="4-Days Plan (80 Hours - ₹2,499)">4-Days Plan (80 Hours - ₹2,499)</option>
                      <option value="5-Days Plan (120 Hours - ₹2,999)">5-Days Plan (120 Hours - ₹2,999)</option>
                      <option value="6-Days Plan (144 Hours - ₹3,399)">6-Days Plan (144 Hours - ₹3,399)</option>
                      <option value="1-Week Plan (168 Hours - ₹3,999)">1-Week Plan (168 Hours - ₹3,999 - Best Value)</option>
                      <option value="Hourly Custom Quick Session">Hourly Custom Session (from ₹50/hr)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">
                      Primary Game You Want to Play
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GTA V, FIFA, God of War"
                      value={form.preferredGame}
                      onChange={(e) => setForm({ ...form, preferredGame: e.target.value })}
                      className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Delivery Area / Landmark in Kalaburagi
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sedam Road, MSK Mill, PDA College, Super Market"
                    value={form.addressOrArea}
                    onChange={(e) => setForm({ ...form, addressOrArea: e.target.value })}
                    className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Additional Notes / Extra Controllers
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Need an extra 2nd controller, specific date/time, or special setup request..."
                    value={form.customNote}
                    onChange={(e) => setForm({ ...form, customNote: e.target.value })}
                    className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-vault-surface border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                  <span>Send Booking Request via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
