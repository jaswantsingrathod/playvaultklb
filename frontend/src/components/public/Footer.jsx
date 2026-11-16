import React, { useState } from 'react';
import { Gamepad2, Instagram, MessageSquare, Phone, Mail, MapPin, X, ArrowUp } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import { cleanPhoneNumber } from '../../utils/whatsapp';

const Footer = () => {
  const { settings, whatsappNumber, instagramUrl } = useWebsite();
  const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const directWhatsAppUrl = `https://wa.me/${cleanPhoneNumber(whatsappNumber)}`;

  return (
    <footer className="bg-[#05030a] border-t border-purple-500/20 text-zinc-400 text-xs sm:text-sm relative overflow-hidden">
      {/* PlayStation Controller Glyphs */}
      <div className="absolute top-6 right-6 text-purple-500/[0.04] font-black text-8xl select-none pointer-events-none">
        △ ◯ ✕ ▢
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand Info */}
          <div className="sm:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img
                src={settings.logoUrl || '/logo.jpeg'}
                alt="PlayVaultKLB"
                className="h-9 sm:h-11 w-auto object-contain rounded-xl border border-purple-500/30 shadow-glow-sm bg-vault-card/80 p-0.5 shrink-0"
                onError={(e) => {
                  e.target.src = '/logo.jpeg';
                }}
              />
              <span className="font-gaming font-extrabold text-xl sm:text-2xl text-white tracking-wider">
                PLAY<span className="text-purple-400">VAULT</span>
                <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  KLB
                </span>
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Kalaburagi’s premier PlayStation 5 console and AAA game rental platform. Providing genuine next-gen hardware, sanitized controllers, and doorstep delivery for gaming sessions.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={instagramUrl || 'https://www.instagram.com/playvaultklb/'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-vault-card border border-purple-500/20 hover:border-pink-500 flex items-center justify-center text-zinc-400 hover:text-pink-400 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-vault-card border border-purple-500/20 hover:border-emerald-500 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors"
                title="WhatsApp"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-gaming font-bold text-white text-sm sm:text-base tracking-wider uppercase mb-3 sm:mb-4">
              Explore
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-purple-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#games" className="hover:text-purple-400 transition-colors">Games Catalogue</a>
              </li>
              <li>
                <a href="#plans" className="hover:text-purple-400 transition-colors">Rental Plans</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#about" className="hover:text-purple-400 transition-colors">About PlayVaultKLB</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-purple-400 transition-colors">Book on WhatsApp</a>
              </li>
            </ul>
          </div>

          {/* Rental Plans Overview */}
          <div>
            <h4 className="font-gaming font-bold text-white text-sm sm:text-base tracking-wider uppercase mb-3 sm:mb-4">
              Popular Plans
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs">
              <li>
                <a href="#plans" className="hover:text-purple-400 transition-colors">1-Day Plan (8 hrs) – ₹699</a>
              </li>
              <li>
                <a href="#plans" className="hover:text-purple-400 transition-colors">2-Days Plan (32 hrs) – ₹1,399</a>
              </li>
              <li>
                <a href="#plans" className="hover:text-purple-400 transition-colors">3-Days Plan (56 hrs) – ₹1,799</a>
              </li>
              <li>
                <a href="#plans" className="hover:text-purple-400 transition-colors">4-Days Plan (80 hrs) – ₹2,499</a>
              </li>
              <li>
                <a href="#plans" className="hover:text-purple-400 transition-colors">1-Week Plan (168 hrs) – ₹3,999</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-gaming font-bold text-white text-sm sm:text-base tracking-wider uppercase mb-3 sm:mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <a
                  href={settings.googleMapsUrl || "https://www.google.com/maps/place/17%C2%B017'53.7%22N+76%C2%B049'49.0%22E/@17.2983117,76.829671,19z/data=!4m4!3m3!8m2!3d17.29825!4d76.8302778?hl=en&entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-300 transition-colors"
                >
                  <span>{settings.address || 'Kalaburagi, Karnataka, India'}</span>
                  <span className="block text-[10px] text-purple-400 hover:underline">View on Google Maps ↗</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  +91 {whatsappNumber || '8904004036'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <a
                  href={`mailto:${settings.contactEmail || 'Playvaultklb@gmail.com'}`}
                  className="truncate hover:text-cyan-300 hover:underline transition-colors"
                >
                  {settings.contactEmail || 'Playvaultklb@gmail.com'}
                </a>
              </li>
              <li className="pt-1">
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                  ● WhatsApp Support 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-center sm:text-left text-[11px] sm:text-xs text-zinc-500">
            © {new Date().getFullYear()} PlayVaultKLB. All rights reserved. PlayStation is a registered trademark of Sony Interactive Entertainment Inc.
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-vault-card border border-zinc-800 hover:border-purple-500/40 text-zinc-400 hover:text-white transition-all"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal (Terms or Privacy) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div
            className="relative w-full max-w-lg bg-vault-card border border-purple-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
              <h3 className="font-gaming font-bold text-lg sm:text-xl text-white">
                {activeModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="mt-3 text-xs text-zinc-300 whitespace-pre-line overflow-y-auto leading-relaxed pr-1">
              {activeModal === 'terms'
                ? settings.termsText ||
                  '1. Valid government ID proof (Aadhaar / Driving License) required at the time of delivery.\n2. Security deposit is refundable upon return of undamaged equipment.\n3. Equipment must not be physically opened or modified.\n4. Late returns are charged according to standard hourly rates.\n5. Customer is responsible for equipment care during rental period.'
                : settings.privacyText ||
                  'PlayVaultKLB values your privacy. We collect customer contact and identification information solely for verification, booking processing, and delivery of rental gaming hardware. We never sell, rent, or share customer data with third parties.'}
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/10 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
