import React from 'react';
import { Gamepad2, Sparkles, Shield, Clock, Flame, ChevronDown } from 'lucide-react';
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
    <section id="home" className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20">
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 bg-vault-bg z-0 pointer-events-none">
        {/* Subtle Neon Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[250px] sm:h-[450px] bg-purple-700/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-600/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide mb-4 sm:mb-6 shadow-glow-sm max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 animate-pulse" />
          <span className="truncate">{settings.heroBadge || '⚡ Ultra-Fast 4K PS5 Gaming • Kalaburagi / KLB'}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-gaming font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-wide sm:tracking-wider text-white uppercase max-w-5xl mx-auto leading-tight">
          {settings.heroHeading || 'YOUR NEXT GAMING SESSION STARTS HERE.'}
        </h1>

        {/* Supporting Text */}
        <p className="mt-4 sm:mt-6 text-xs sm:text-base lg:text-lg text-zinc-300 max-w-3xl mx-auto font-normal leading-relaxed px-2">
          {settings.heroSubheading ||
            'Experience premium PlayStation 5 gaming without the commitment of buying a console. Pick your favourite games, choose your rental duration and start playing.'}
        </p>

        {/* Mobile-Friendly Call to Actions */}
        <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto w-full">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/50 hover:shadow-emerald-800/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>Book on WhatsApp</span>
            <span className="text-emerald-200 group-hover:translate-x-1 transition-transform">→</span>
          </a>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleScroll('games')}
              className="flex-1 sm:flex-initial px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 hover:text-white font-semibold text-xs sm:text-sm border border-purple-500/30 hover:border-purple-400 transition-all flex items-center justify-center gap-1.5"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Explore Games</span>
            </button>

            <button
              onClick={() => handleScroll('plans')}
              className="flex-1 sm:flex-initial px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-vault-card hover:bg-vault-cardHover text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm border border-zinc-800 hover:border-purple-500/40 transition-all text-center"
            >
              <span>Rental Plans</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-purple-500/15 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-left">
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-vault-surface/60 border border-purple-500/10">
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">PS5 Console</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">4K HDR @ 120Hz</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-vault-surface/60 border border-purple-500/10">
            <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">Top Games</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">GTA V, FIFA, GOW</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-vault-surface/60 border border-purple-500/10">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">Hourly & Daily</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">From ₹50/hr</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-vault-surface/60 border border-purple-500/10">
            <div className="p-1.5 sm:p-2 rounded-lg bg-pink-500/10 text-pink-400 shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">Kalaburagi / KLB</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Doorstep delivery</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-6 sm:mt-10 flex justify-center">
          <button
            onClick={() => handleScroll('games')}
            className="text-zinc-500 hover:text-purple-400 transition-colors animate-bounce p-1.5"
            aria-label="Scroll down to games"
          >
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
