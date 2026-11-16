import React from 'react';
import { ShieldCheck, HeartHandshake, MapPin, Gamepad2, Award, Zap } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';

const AboutUs = () => {
  const { settings } = useWebsite();

  return (
    <section id="about" className="py-16 sm:py-24 relative bg-[#06040e] border-t border-purple-500/15 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-700/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center">
          {/* Left Column: Story & Mission */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-gaming font-bold uppercase tracking-wider mb-3 shadow-glow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Kalaburagi Gaming Pioneers</span>
            </div>

            <h2 className="font-gaming font-extrabold text-3xl sm:text-5xl text-white tracking-wide uppercase leading-tight">
              {settings.aboutTitle || 'Kalaburagi’s Premier PlayStation 5 Service'}
            </h2>

            <p className="mt-4 sm:mt-6 text-zinc-300 text-xs sm:text-base leading-relaxed">
              {settings.aboutText ||
                'PlayVaultKLB was founded to give gaming enthusiasts in Kalaburagi seamless, affordable access to cutting-edge PlayStation 5 gaming. Whether you need a console for a weekend party, an all-night tournament with friends, or to experience the latest blockbuster titles in 4K HDR, we provide well-maintained PS5 consoles, extra controllers, and top-tier games delivered straight to your door.'}
            </p>

            <div className="mt-7 sm:mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-vault-card/90 border border-purple-500/20 hover:border-purple-400/50 transition-colors">
                <div className="flex items-center gap-2.5 text-purple-400 mb-1.5">
                  <Award className="w-5 h-5 shrink-0" />
                  <span className="font-gaming font-extrabold text-base text-white tracking-wide uppercase">Original Sony PS5</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Authentic Sony hardware with pristine DualSense wireless controllers.</p>
              </div>

              <div className="p-4 rounded-2xl bg-vault-card/90 border border-purple-500/20 hover:border-emerald-400/50 transition-colors">
                <div className="flex items-center gap-2.5 text-emerald-400 mb-1.5">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span className="font-gaming font-extrabold text-base text-white tracking-wide uppercase">Kalaburagi Local</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Fast delivery, installation, and on-call support anywhere across KLB city.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-vault-card/95 p-6 sm:p-9 shadow-2xl shadow-purple-950/40">
              {/* Subtle PlayStation glyphs */}
              <div className="absolute top-4 right-4 text-purple-500/[0.08] font-black text-6xl select-none pointer-events-none">
                △
              </div>

              <div className="flex items-center justify-between pb-5 border-b border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-glow-sm">
                    <Gamepad2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-gaming font-extrabold text-xl text-white tracking-wider">PLAYVAULT KLB</h3>
                    <p className="text-xs text-purple-300 font-gaming uppercase tracking-widest">Console Fleet • Kalaburagi</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-gaming font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Verified
                </span>
              </div>

              <div className="mt-6 space-y-4 text-xs text-zinc-300">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-vault-surface/80 border border-purple-500/15">
                  <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-gaming font-bold text-sm tracking-wide uppercase">Deep Cleaned & Sanitized</strong>
                    Every console, controller, and cable is fully sanitized, cleaned, and tested before every dispatch.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-vault-surface/80 border border-purple-500/15">
                  <HeartHandshake className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-gaming font-bold text-sm tracking-wide uppercase">White-Glove Doorstep Setup</strong>
                    We come to your place, connect HDMI & power, set up your preferred game, and ensure you are ready to play.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-vault-surface/80 border border-purple-500/15">
                  <MapPin className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-gaming font-bold text-sm tracking-wide uppercase">Fast Service Area Across KLB</strong>
                    <span>Serving Kalaburagi city, colleges, student hostels, and residential layouts.</span>
                    {settings.googleMapsUrl && (
                      <a
                        href={settings.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-semibold mt-1.5 block"
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
