import React from 'react';
import { ShieldCheck, HeartHandshake, MapPin, Gamepad2, Award, Sparkles } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';

const AboutUs = () => {
  const { settings } = useWebsite();

  return (
    <section id="about" className="py-14 sm:py-24 relative bg-vault-surface/30 border-t border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Column: Story & Mission */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>About PlayVaultKLB</span>
            </div>

            <h2 className="font-gaming font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase leading-tight">
              {settings.aboutTitle || 'Kalaburagi’s Premier PS5 Rental Service'}
            </h2>

            <p className="mt-4 sm:mt-6 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed">
              {settings.aboutText ||
                'PlayVaultKLB was founded to give gaming enthusiasts in Kalaburagi seamless, affordable access to cutting-edge PlayStation 5 gaming. Whether you need a console for a weekend party, an all-night tournament with friends, or to experience the latest blockbuster titles in 4K HDR, we provide well-maintained PS5 consoles, extra controllers, and top-tier games delivered straight to your door.'}
            </p>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-vault-card border border-purple-500/15">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Award className="w-4 h-4 shrink-0" />
                  <span className="font-gaming font-bold text-sm sm:text-base text-white">Genuine Hardware</span>
                </div>
                <p className="text-xs text-zinc-400">Authentic Sony PS5 consoles and pristine DualSense wireless controllers.</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-vault-card border border-purple-500/15">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="font-gaming font-bold text-sm sm:text-base text-white">Kalaburagi Local</span>
                </div>
                <p className="text-xs text-zinc-400">Fast delivery, installation, and on-call support anywhere across KLB.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 bg-vault-card p-5 sm:p-8 shadow-2xl shadow-purple-950/30">
              <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-purple-500/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Gamepad2 className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="font-gaming font-bold text-lg sm:text-xl text-white">PLAYVAULT KLB</h3>
                    <p className="text-xs text-zinc-400">Premium PlayStation 5 Rentals</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                  Verified
                </span>
              </div>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-vault-surface/60">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Safe & Sanitized Equipment</strong>
                    All equipment is sanitized, deep-cleaned, and tested before and after every rental session.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-vault-surface/60">
                  <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Zero Stress Doorstep Service</strong>
                    We bring the PS5 to your location, connect HDMI & power, set up your preferred game, and ensure you are ready to play.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-vault-surface/60">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Service Area & Hub</strong>
                    <span>Serving Kalaburagi city and nearby educational / residential hubs.</span>
                    {settings.googleMapsUrl && (
                      <a
                        href={settings.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline font-semibold mt-1 block"
                      >
                        <span>Open Location in Google Maps ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
