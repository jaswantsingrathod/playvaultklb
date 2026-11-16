import React from 'react';
import { Gamepad2, Library, CalendarDays, MessageSquare, Headphones, ShieldCheck, Zap, Disc3, Tv, Flame } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Original PS5 Hardware',
      description:
        'Authentic Sony PlayStation 5 consoles equipped with ultra-fast custom SSDs, hardware-accelerated ray tracing, and 4K output up to 120 FPS.',
      tag: 'Flagship Console',
      color: 'from-purple-600/30 to-purple-800/30 text-purple-400 border-purple-500/40',
      glyph: '△',
    },
    {
      icon: Disc3,
      title: 'Top Blockbuster Games',
      description:
        'Massive curated library including GTA V, EA Sports FC 24, God of War Ragnarök, Marvel’s Spider-Man 2, Tekken 8, and Mortal Kombat 1.',
      tag: 'Updated & Pre-Installed',
      color: 'from-cyan-600/30 to-blue-800/30 text-cyan-400 border-cyan-500/40',
      glyph: '◯',
    },
    {
      icon: CalendarDays,
      title: 'Hourly & Multi-Day Passes',
      description:
        'From single-hour intense sessions and all-night weekend parties to 7-day extended vacation passes. Rent exactly how long you want.',
      tag: 'Zero Lock-In',
      color: 'from-emerald-600/30 to-teal-800/30 text-emerald-400 border-emerald-500/40',
      glyph: '✕',
    },
    {
      icon: MessageSquare,
      title: 'Direct WhatsApp Booking',
      description:
        'No confusing sign-up forms or payment gateways. Simply tap our WhatsApp button, choose your preferred slot, and we confirm in minutes.',
      tag: 'Fast Dispatch',
      color: 'from-green-600/30 to-emerald-800/30 text-emerald-400 border-emerald-500/40',
      glyph: '▢',
    },
    {
      icon: Headphones,
      title: 'Doorstep Setup in Kalaburagi',
      description:
        'We deliver right to your doorstep in Kalaburagi, hook up HDMI 2.1 to your TV, calibrate the display, and ensure everything runs 100%.',
      tag: 'Turnkey Setup',
      color: 'from-pink-600/30 to-purple-800/30 text-pink-400 border-pink-500/40',
      glyph: '△',
    },
    {
      icon: ShieldCheck,
      title: 'Sanitized & Tested Gear',
      description:
        'Every console and DualSense wireless controller is deep-cleaned, sanitized, and performance-tested after every single rental.',
      tag: '100% Inspected',
      color: 'from-amber-600/30 to-orange-800/30 text-amber-400 border-amber-500/40',
      glyph: '◯',
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative bg-[#06040e] border-y border-purple-500/15 overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-gaming font-bold uppercase tracking-wider mb-3 shadow-glow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>The PlayVaultKLB Advantage</span>
          </div>
          <h2 className="font-gaming font-extrabold text-3xl sm:text-5xl text-white tracking-wide uppercase">
            Engineered For <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Pure Gaming</span>
          </h2>
          <p className="mt-3 text-zinc-300 text-xs sm:text-sm md:text-base px-2">
            Everything you need for an unforgettable PlayStation 5 session delivered straight to your living room in Kalaburagi.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl bg-vault-card/85 border border-purple-500/20 hover:border-purple-400/60 p-6 transition-all duration-300 hover:shadow-glow-md hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                {/* PlayStation Glyph Watermark */}
                <div className="absolute -bottom-4 -right-2 text-purple-500/[0.05] group-hover:text-purple-500/[0.1] font-black text-8xl select-none transition-colors pointer-events-none">
                  {feat.glyph}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} border flex items-center justify-center shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-gaming font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#070510] border border-purple-500/30 text-purple-300 group-hover:border-purple-400 transition-colors">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-gaming font-extrabold text-xl text-white tracking-wide group-hover:text-purple-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-purple-500/15 flex items-center gap-2 text-xs text-purple-400 font-gaming font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>KLB Verified Hardware</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
