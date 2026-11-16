import React from 'react';
import { Gamepad2, Sparkles, Shield, Clock, Flame, ChevronDown, Zap, Tv, Disc3, Trophy } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import { getGeneralInquiryUrl } from '../../utils/whatsapp';

const Hero = () => {
  const { settings, whatsappNumber } = useWebsite();

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const bookingUrl = getGeneralInquiryUrl(
    'I want to rent a PS5 console in Kalaburagi. Please confirm console availability and today’s rental slots.',
    whatsappNumber
  );

  return (
    <section id="home" className="relative min-h-[88vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-20">
      {/* Dynamic Cyber / Next-Gen Gaming Background (NO generic AI dots!) */}
      <div className="absolute inset-0 bg-[#06040d] z-0 pointer-events-none overflow-hidden">
        {/* DualSense Oceanic Blue & Neon Purple Ambient Spotlights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] sm:w-[900px] h-[350px] sm:h-[500px] bg-gradient-to-b from-purple-600/25 via-indigo-600/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -left-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-purple-700/15 rounded-full blur-[130px] pointer-events-none" />

        {/* Ambient PlayStation Controller Glyphs (△ ◯ ✕ ▢) Watermarks */}
        <div className="absolute top-12 left-[8%] text-purple-500/[0.07] font-black text-7xl sm:text-9xl select-none rotate-12">
          △
        </div>
        <div className="absolute top-28 right-[10%] text-cyan-400/[0.07] font-black text-6xl sm:text-8xl select-none -rotate-12">
          ◯
        </div>
        <div className="absolute bottom-24 left-[12%] text-blue-500/[0.07] font-black text-6xl sm:text-8xl select-none -rotate-6">
          ✕
        </div>
        <div className="absolute bottom-20 right-[14%] text-pink-500/[0.07] font-black text-7xl sm:text-9xl select-none rotate-12">
          ▢
        </div>

        {/* Cyberpunk Angular Tech Accent Lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Live Radar Pulse Gaming Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vault-card/90 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-semibold tracking-wide mb-5 sm:mb-7 shadow-glow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white font-gaming tracking-widest uppercase font-bold text-[11px] sm:text-xs">
            {settings.heroBadge || 'KALABURAGI • PS5 READY FOR SAME-DAY DISPATCH'}
          </span>
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-current ml-0.5" />
        </div>

        {/* Hero Headline - Aggressive Next-Gen Gaming Typography */}
        <h1 className="font-gaming font-extrabold text-3.5xl sm:text-6xl lg:text-7xl tracking-wide sm:tracking-wider text-white uppercase max-w-5xl mx-auto leading-tight sm:leading-none">
          UNLEASH <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">NEXT-GEN</span> POWER.
          <br />
          <span className="text-2xl sm:text-4xl lg:text-5xl text-zinc-200 font-bold block mt-2 sm:mt-3">
            {settings.heroHeading || 'PLAYSTATION 5 RENTALS IN KALABURAGI'}
          </span>
        </h1>

        {/* Supporting Gamer Text */}
        <p className="mt-4 sm:mt-6 text-xs sm:text-base lg:text-lg text-zinc-300 max-w-3xl mx-auto font-normal leading-relaxed px-2">
          {settings.heroSubheading ||
            'Skip the ₹55,000 console price tag. Rent authentic Sony PlayStation 5 consoles, DualSense controllers, and 4K blockbuster games with doorstep delivery anywhere in Kalaburagi.'}
        </p>

        {/* High-Voltage Action Buttons */}
        <div className="mt-8 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto w-full">
          {/* Primary High-Impact WhatsApp Button */}
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-gaming font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-emerald-950/60 hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 group"
          >
            <span>Book PS5 on WhatsApp</span>
            <span className="text-emerald-100 group-hover:translate-x-1.5 transition-transform">→</span>
          </a>

          {/* Secondary Console Exploration Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleScroll('games')}
              className="flex-1 sm:flex-initial px-5 py-3.5 sm:px-7 sm:py-4 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 hover:text-white font-gaming font-bold text-xs sm:text-sm tracking-wider uppercase border border-purple-500/30 hover:border-purple-400 transition-all flex items-center justify-center gap-2 shadow-glow-sm"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Explore 30+ Games</span>
            </button>

            <button
              onClick={() => handleScroll('plans')}
              className="flex-1 sm:flex-initial px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl bg-vault-card hover:bg-vault-cardHover text-zinc-300 hover:text-white font-gaming font-bold text-xs sm:text-sm tracking-wider uppercase border border-zinc-800 hover:border-purple-500/40 transition-all text-center"
            >
              <span>Rental Plans</span>
            </button>
          </div>
        </div>

        {/* PlayStation 5 Hardware Specs HUD Bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-purple-500/20 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-card/70 border border-purple-500/15 hover:border-purple-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 shrink-0">
              <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-gaming font-extrabold text-white uppercase tracking-wider truncate">4K HDR @ 120Hz</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Ray-Tracing Ready</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-card/70 border border-purple-500/15 hover:border-cyan-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-gaming font-extrabold text-white uppercase tracking-wider truncate">DualSense Haptics</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Adaptive Triggers</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-card/70 border border-purple-500/15 hover:border-emerald-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
              <Disc3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-gaming font-extrabold text-white uppercase tracking-wider truncate">Ultra SSD Speed</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Zero Load Times</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-vault-card/70 border border-purple-500/15 hover:border-pink-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-pink-500/15 text-pink-400 shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-gaming font-extrabold text-white uppercase tracking-wider truncate">Doorstep Setup</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Kalaburagi Citywide</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator with PlayStation triangle */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <button
            onClick={() => handleScroll('games')}
            className="text-zinc-500 hover:text-purple-400 transition-colors animate-bounce p-2 flex flex-col items-center gap-1"
            aria-label="Scroll down to games"
          >
            <span className="text-[9px] font-gaming uppercase tracking-widest text-zinc-500">Scroll to Games</span>
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
