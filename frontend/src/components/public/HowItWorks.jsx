import React from 'react';
import { Search, CalendarCheck, MessageSquare, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Browse Available Games',
      description: 'Explore our catalog of top PS5 titles including GTA V, FIFA, God of War, Spider-Man 2, and more.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Choose Your Rental Plan',
      description: 'Select an hourly package or choose from 1-Day to 1-Week rental plans tailored to your schedule.',
      icon: CalendarCheck,
    },
    {
      step: '03',
      title: 'Contact Us on WhatsApp',
      description: 'Tap any booking button to connect directly with our Kalaburagi team with your pre-filled inquiry.',
      icon: MessageSquare,
    },
    {
      step: '04',
      title: 'Confirm & Quick Delivery',
      description: 'Share your location. We verify equipment availability and deliver the sanitized PS5 setup to your door.',
      icon: ShieldCheck,
    },
    {
      step: '05',
      title: 'Enjoy Next-Gen Gaming',
      description: 'Plug in, power on, and immerse yourself in breathtaking 4K 120Hz PlayStation 5 action with friends!',
      icon: Trophy,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-24 relative bg-vault-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Simple 5-Step Process</span>
          </div>
          <h2 className="font-gaming font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase">
            How Renting Works
          </h2>
          <p className="mt-2.5 sm:mt-4 text-zinc-400 text-xs sm:text-sm md:text-base px-2">
            From picking your favorite game to playing in your living room—here is how effortless renting a PS5 is with PlayVaultKLB.
          </p>
        </div>

        <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-vault-surface/70 border border-purple-500/15 p-4 sm:p-5 hover:border-purple-400/50 hover:bg-vault-card transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-gaming font-extrabold text-2xl sm:text-3xl text-purple-500/30 group-hover:text-purple-400 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  <h3 className="font-gaming font-bold text-base sm:text-lg text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-purple-500/10 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-zinc-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Step {idx + 1} of 5</span>
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
