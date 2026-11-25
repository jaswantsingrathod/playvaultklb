import React from 'react';
import { Search, CalendarCheck, MessageSquare, ShieldCheck, Trophy, Sparkles, Zap, ChevronRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Pick Your Games',
      description: 'Browse our catalog of 30+ PS5 AAA titles including GTA V, FIFA, God of War, Spider-Man 2, and Tekken 8.',
      icon: Search,
      glyph: '△',
    },
    {
      step: '02',
      title: 'Choose Rental Pass',
      description: 'Select a rental pass from 1-Day (24 hrs) up to 7-Day passes tailored to your gaming schedule.',
      icon: CalendarCheck,
      glyph: '◯',
    },
    {
      step: '03',
      title: 'Tap to WhatsApp Us',
      description: 'Click any WhatsApp button to connect directly with our Kalaburagi team with your pre-filled inquiry.',
      icon: MessageSquare,
      glyph: '✕',
    },
    {
      step: '04',
      title: 'Doorstep Delivery',
      description: 'Share your address. We dispatch our technician to deliver, connect, and calibrate the PS5 to your TV.',
      icon: ShieldCheck,
      glyph: '▢',
    },
    {
      step: '05',
      title: 'Game in 4K 120Hz',
      description: 'Power on, grab the DualSense wireless controller, and dive into true next-generation console gaming!',
      icon: Trophy,
      glyph: '△',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 relative bg-[#07050f] overflow-hidden">
      {/* Dynamic ambient lights */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-purple-700/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-gaming font-bold uppercase tracking-wider mb-3 shadow-glow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Frictionless 5-Step Process</span>
          </div>
          <h2 className="font-gaming font-extrabold text-3xl sm:text-5xl text-white tracking-wide uppercase">
            How Renting <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Works</span>
          </h2>
          <p className="mt-3 text-zinc-300 text-xs sm:text-sm md:text-base px-2">
            From picking your favorite game to playing in your living room—here is how effortless renting a PS5 is with PlayVaultKLB.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl bg-vault-card/85 border border-purple-500/20 hover:border-purple-400/60 p-5 hover:bg-vault-card transition-all duration-300 hover:shadow-glow-md hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                {/* PlayStation Glyph Watermark */}
                <div className="absolute -bottom-3 -right-1 text-purple-500/[0.05] group-hover:text-purple-500/[0.12] font-black text-7xl select-none transition-colors pointer-events-none">
                  {item.glyph}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-gaming font-black text-3xl text-purple-500/40 group-hover:text-purple-400 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:border-purple-400 group-hover:shadow-glow-sm transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-gaming font-extrabold text-lg sm:text-xl text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center gap-1.5 text-[11px] font-gaming font-bold uppercase tracking-wider text-purple-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Phase {idx + 1} of 5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
