import React, { useState, useEffect } from 'react';
import { Check, Sparkles, MessageSquare, Clock, Flame, Zap, ShieldCheck, Gamepad2 } from 'lucide-react';
import api from '../../services/api';
import { getPlanBookingUrl } from '../../utils/whatsapp';
import { useWebsite } from '../../context/WebsiteContext';

const RentalPlans = () => {
  const { whatsappNumber } = useWebsite();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await api.get('/rental-plans');
        if (res.data.success) {
          setPlans(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load rental plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <section id="plans" className="py-16 sm:py-24 relative bg-[#090714] border-t border-purple-500/15 overflow-hidden">
      {/* Dynamic ambient spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-700/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle PlayStation glyph watermarks */}
      <div className="absolute -top-10 left-10 text-purple-500/[0.04] font-black text-9xl select-none pointer-events-none">
        ◯
      </div>
      <div className="absolute -bottom-10 right-10 text-cyan-400/[0.04] font-black text-9xl select-none pointer-events-none">
        ✕
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-gaming font-bold uppercase tracking-wider mb-3 shadow-glow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>All-Inclusive PS5 Rental Passes</span>
          </div>
          <h2 className="font-gaming font-extrabold text-3xl sm:text-5xl text-white tracking-wide uppercase">
            Rental <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Plans & Passes</span>
          </h2>
          <p className="mt-3 text-zinc-300 text-xs sm:text-sm md:text-base px-2">
            Zero security deposits. Every rental comes with original Sony PS5 console, sanitized DualSense wireless controllers, high-speed HDMI 2.1 cable, and top AAA games.
          </p>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-vault-card/40 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => {
              const isPopular = plan.isPopular;
              const bookingUrl = getPlanBookingUrl(plan, whatsappNumber);

              return (
                <div
                  key={plan._id}
                  className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#1b1136] via-vault-card to-[#0e0a1c] border-2 border-purple-500 shadow-glow-md -translate-y-1'
                      : 'bg-vault-card/85 border border-purple-500/20 hover:border-purple-400/50 hover:-translate-y-1 hover:shadow-glow-sm'
                  }`}
                >
                  {/* Top Popular/Custom Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white text-[10px] font-gaming font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-purple-300/50 whitespace-nowrap">
                        <Flame className="w-3.5 h-3.5 text-amber-300 fill-current shrink-0 animate-pulse" />
                        <span>{plan.badge}</span>
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="text-center pt-2 pb-4 border-b border-purple-500/15">
                      <h3 className="font-gaming font-extrabold text-2xl text-white tracking-wide">
                        {plan.name}
                      </h3>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#05030a] border border-purple-500/30 text-xs font-gaming font-bold tracking-wider text-purple-300">
                        <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{plan.durationHours} Hours Gaming</span>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="text-center py-5">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="font-gaming text-4xl sm:text-5xl font-black text-white tracking-tight">
                          ₹{plan.price.toLocaleString()}
                        </span>
                      </div>
                      {plan.originalPrice && (
                        <div className="mt-1 text-xs text-zinc-500 line-through font-semibold">
                          Regular: ₹{plan.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Hardware Inclusions & Perks */}
                    <div className="space-y-2.5 text-xs text-zinc-300 pb-5">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Sony PS5 4K Console</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>DualSense Wireless Controller</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Pre-loaded Top AAA Games</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>High-Speed HDMI 2.1 Cable</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Sanitized & Tested Hardware</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Doorstep Setup in Kalaburagi</span>
                      </div>
                    </div>
                  </div>

                  {/* Instant WhatsApp Booking Button */}
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-4 rounded-xl font-gaming font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                      isPopular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-950/60'
                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                    <span>Book {plan.name}</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RentalPlans;
