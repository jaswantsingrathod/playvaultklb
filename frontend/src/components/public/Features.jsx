import React from 'react';
import { Gamepad, Library, CalendarDays, MessageSquare, Headphones, Sparkles, ShieldCheck } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Gamepad,
      title: 'Premium PS5 Hardware',
      description:
        'Original PlayStation 5 consoles equipped with ultra-fast SSD storage, ray tracing graphics, and ergonomic DualSense wireless controllers featuring tactile haptics.',
      tag: 'Flagship Console',
      color: 'from-purple-600/20 to-purple-800/20 text-purple-400 border-purple-500/30',
    },
    {
      icon: Library,
      title: 'Blockbuster Games Included',
      description:
        'Access a massive collection of AAA titles including GTA V, EA Sports FC 24, God of War Ragnarök, Marvel’s Spider-Man 2, Tekken 8, and Call of Duty.',
      tag: 'Pre-Installed & Ready',
      color: 'from-cyan-600/20 to-blue-800/20 text-cyan-400 border-cyan-500/30',
    },
    {
      icon: CalendarDays,
      title: 'Flexible Rental Durations',
      description:
        'From single-hour quick sessions and all-night weekend parties to 7-day full weekly packages. Rent according to your exact timetable with zero lock-in.',
      tag: 'Hourly to Weekly',
      color: 'from-emerald-600/20 to-teal-800/20 text-emerald-400 border-emerald-500/30',
    },
    {
      icon: MessageSquare,
      title: 'Instant WhatsApp Booking',
      description:
        'No complicated payment gateways or account registrations. Simply tap to message us directly on WhatsApp, pick your dates, and we confirm in minutes.',
      tag: 'Zero Friction',
      color: 'from-green-600/20 to-emerald-800/20 text-green-400 border-green-500/30',
    },
    {
      icon: Headphones,
      title: 'Doorstep Setup & 24/7 Support',
      description:
        'We deliver directly to your location in Kalaburagi, complete HDMI TV setup and calibration, and remain on standby 24/7 to assist with any technical questions.',
      tag: 'Full Service',
      color: 'from-pink-600/20 to-purple-800/20 text-pink-400 border-pink-500/30',
    },
  ];

  return (
    <section className="py-14 sm:py-20 relative bg-vault-surface/40 border-y border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Why PlayVaultKLB</span>
          </div>
          <h2 className="font-gaming font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase">
            The Ultimate PS5 Rental Experience
          </h2>
          <p className="mt-3 text-zinc-400 text-xs sm:text-sm md:text-base px-2">
            Everything you need for an unforgettable next-gen PlayStation session delivered straight to your door in Kalaburagi.
          </p>
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-vault-card/70 border border-purple-500/15 hover:border-purple-500/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feat.color} border flex items-center justify-center`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-vault-bg border border-zinc-800 text-zinc-400 group-hover:text-purple-300 group-hover:border-purple-500/30 transition-colors">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-gaming font-bold text-lg sm:text-xl text-white tracking-wide group-hover:text-purple-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-purple-500/10 flex items-center gap-2 text-[11px] sm:text-xs text-purple-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Verified & Tested Equipment</span>
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
