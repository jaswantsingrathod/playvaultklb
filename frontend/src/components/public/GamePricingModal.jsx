import React, { useState } from 'react';
import { X, Check, Gamepad2, Clock, MessageSquare, Star, Users, HardDrive, MapPin, User, Sparkles } from 'lucide-react';
import { getGameBookingUrl } from '../../utils/whatsapp';
import { useWebsite } from '../../context/WebsiteContext';

const GamePricingModal = ({ game, onClose }) => {
  const { whatsappNumber } = useWebsite();

  const [controllerCount, setControllerCount] = useState('1'); // '1' | '2'
  const [customerName, setCustomerName] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');

  if (!game) return null;

  const controllersLabel =
    controllerCount === '2'
      ? '2 DualSense Wireless Controllers (Multiplayer Setup)'
      : '1 DualSense Wireless Controller (Included)';

  const bookingUrl = getGameBookingUrl({
    gameTitle: game.title,
    duration: 'PS5 Console Rental',
    platform: game.platform || 'PS5',
    controllers: controllersLabel,
    customerName: customerName.trim(),
    deliveryArea: deliveryArea.trim(),
    phone: whatsappNumber,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-vault-card border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/50 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Game Banner/Cover */}
        <div className="relative h-32 sm:h-44 w-full overflow-hidden bg-vault-bg shrink-0">
          <img
            src={game.bannerImage || game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.target.src = '/logo.jpeg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vault-card via-vault-card/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 sm:p-2 rounded-xl bg-vault-bg/80 border border-purple-500/30 text-zinc-300 hover:text-white hover:bg-purple-900/50 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Game Title info overlay */}
          <div className="absolute bottom-2.5 left-3.5 right-3.5 sm:bottom-4 sm:left-6 sm:right-6 flex items-end justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="px-1.5 py-0.2 rounded bg-purple-600 text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">
                  {game.platform || 'PS5'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-zinc-800/80 text-[9px] sm:text-[10px] font-semibold text-zinc-300 border border-zinc-700">
                  {game.genre}
                </span>
                {game.isAvailable ? (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[10px] font-bold border border-emerald-500/30">
                    ● Available Now
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] sm:text-[10px] font-bold border border-amber-500/30">
                    ● Advance Booking
                  </span>
                )}
              </div>
              <h2 className="font-gaming font-extrabold text-lg sm:text-2xl text-white tracking-wide truncate">
                {game.title}
              </h2>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-lg text-yellow-400 text-xs font-bold shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span>{game.rating || '4.9'}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4">
          {/* Quick Specifications */}
          <div className="grid grid-cols-3 gap-2 text-center py-2 px-2.5 rounded-xl bg-vault-surface border border-purple-500/10 text-[11px] sm:text-xs">
            <div className="flex items-center justify-center gap-1 text-zinc-300 truncate">
              <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{game.players || '1-2 Players'}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-zinc-300 border-x border-zinc-800 truncate">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{game.storageRequired || '75 GB'}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-zinc-300 truncate">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">PS5 Ultra 4K</span>
            </div>
          </div>

          {/* Console Included Banner */}
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-xs sm:text-sm">Included with PS5 Console Rental</div>
                <div className="text-[11px] text-zinc-300">Play this game on authentic PlayStation 5 hardware with 4K 60FPS</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold shrink-0">
              Free with Console
            </span>
          </div>

          {/* Controllers Option */}
          <div>
            <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5 mb-2">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Step 1: DualSense Wireless Controllers</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setControllerCount('1')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  controllerCount === '1'
                    ? 'bg-purple-950/60 border-purple-400 text-white shadow-glow-sm'
                    : 'bg-vault-surface/60 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-white text-xs">1 Controller</div>
                <div className="text-[10px] text-emerald-400">Included (Free)</div>
              </button>

              <button
                type="button"
                onClick={() => setControllerCount('2')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  controllerCount === '2'
                    ? 'bg-purple-950/60 border-purple-400 text-white shadow-glow-sm'
                    : 'bg-vault-surface/60 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-white text-xs">2 Controllers</div>
                <div className="text-[10px] text-purple-300">Multiplayer Setup</div>
              </button>
            </div>
          </div>

          {/* Customer Booking Info (Optional for WhatsApp Pre-fill) */}
          <div className="p-3 rounded-xl bg-vault-surface/80 border border-purple-500/15 space-y-2.5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Step 2: Delivery Details (Sent via WhatsApp)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-0.5">Your Name (Optional)</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-vault-bg border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-0.5">Delivery Area in Kalaburagi</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. PDA College, Sedam Road"
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-vault-bg border border-zinc-800 focus:border-purple-400 text-white placeholder-zinc-500 text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Live WhatsApp Booking CTA */}
        <div className="p-3.5 sm:p-4 bg-vault-surface/95 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wide">
              {game.title} • {controllerCount === '1' ? '1 Controller' : '2 Controllers'}
            </div>
            <div className="text-sm font-semibold text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
              <span>Included with PS5 Rental Plan</span>
            </div>
          </div>

          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform transform active:scale-95 whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 fill-current shrink-0" />
            <span>Book PS5 with this Game</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GamePricingModal;
