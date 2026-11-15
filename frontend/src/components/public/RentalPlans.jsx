import React, { useState, useEffect } from 'react';
import { Check, Sparkles, MessageSquare, Clock, Flame } from 'lucide-react';
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
    <section id="plans" className="py-14 sm:py-24 relative bg-vault-surface/50 border-t border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Official Rental Packages</span>
          </div>
          <h2 className="font-gaming font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase">
            Transparent PS5 Rental Plans
          </h2>
          <p className="mt-2.5 sm:mt-4 text-zinc-400 text-xs sm:text-sm md:text-base px-2">
            No hidden charges, no deposit hassles. Choose your plan, connect on WhatsApp, and start playing 4K PlayStation 5 games.
          </p>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-80 sm:h-96 rounded-2xl bg-vault-card/40 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {plans.map((plan) => {
              const isPopular = plan.isPopular;
              const bookingUrl = getPlanBookingUrl(plan, whatsappNumber);

              return (
                <div
                  key={plan._id}
                  className={`relative rounded-2xl p-4 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                    isPopular
                      ? 'bg-gradient-to-b from-purple-950/50 to-vault-card border-2 border-purple-500 shadow-glow-md'
                      : 'bg-vault-card/70 border border-purple-500/15 hover:border-purple-500/40 hover:-translate-y-1'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1 border border-purple-400/40 whitespace-nowrap">
                        <Flame className="w-3 h-3 text-amber-300 fill-current shrink-0" />
                        <span>{plan.badge}</span>
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Plan Title & Duration */}
                    <div className="text-center pt-1 sm:pt-2 pb-3 sm:pb-4 border-b border-purple-500/10">
                      <h3 className="font-gaming font-extrabold text-xl sm:text-2xl text-white tracking-wide">
                        {plan.name}
                      </h3>
                      <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-vault-bg border border-zinc-800 text-[11px] sm:text-xs font-semibold text-purple-300">
                        <Clock className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>{plan.durationHours} Hours Rental</span>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="text-center py-4 sm:py-5">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="font-gaming text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                          ₹{plan.price.toLocaleString()}
                        </span>
                      </div>
                      {plan.originalPrice && (
                        <div className="mt-0.5 text-xs text-zinc-500 line-through">
                          Regular: ₹{plan.originalPrice.toLocaleString()}
                        </div>
                      )}
                      <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2">
                        {plan.description || 'Full PS5 setup delivered to your doorstep in Kalaburagi.'}
                      </p>
                    </div>

                    {/* Inclusions Checklist */}
                    <div className="pt-2 pb-5 space-y-2">
                      <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Included in this package:
                      </div>
                      {plan.inclusions &&
                        plan.inclusions.map((inc, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                            <div className="mt-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="line-clamp-2">{inc}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  <div className="pt-3 sm:pt-4 border-t border-purple-500/10">
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                        isPopular
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40'
                          : 'bg-vault-surface hover:bg-emerald-600 text-zinc-200 hover:text-white border border-purple-500/20 hover:border-emerald-500'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>Book on WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Duration Banner */}
        <div className="mt-10 sm:mt-12 rounded-2xl bg-gradient-to-r from-purple-950/40 via-vault-card to-purple-950/40 border border-purple-500/20 p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-gaming font-bold text-lg sm:text-2xl text-white">
              Need a Custom Rental Duration or Multiple PS5 Consoles?
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Hosting a birthday party, college tournament, or corporate esports event in Kalaburagi? We customize packages with extra controllers and 4K displays!
            </p>
          </div>
          <a
            href={getPlanBookingUrl({ name: 'Custom Group Event', durationLabel: 'Custom', durationHours: 'Custom', price: 'Best Quote', inclusions: ['Multiple PS5 Consoles', 'Extra DualSense Controllers', '4K TV Support'] }, whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm whitespace-nowrap shadow-glow-sm transition-all text-center shrink-0"
          >
            Get Custom Event Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default RentalPlans;
