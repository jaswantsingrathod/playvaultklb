import React, { useState, useEffect } from 'react';
import { Search, Gamepad2, Star, Clock, Sparkles, MessageSquare, Flame, CheckCircle2, Zap } from 'lucide-react';
import api from '../../services/api';
import GamePricingModal from './GamePricingModal';
import { getGameBookingUrl } from '../../utils/whatsapp';
import { useWebsite } from '../../context/WebsiteContext';

const GamesCatalogue = () => {
  const { whatsappNumber } = useWebsite();
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeGameModal, setActiveGameModal] = useState(null);

  // Fetch categories and games from backend MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, gamesRes] = await Promise.all([
          api.get('/categories'),
          api.get('/games'),
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.data || []);
        }
        if (gamesRes.data.success) {
          setGames(gamesRes.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load games from database:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter games based on selected category and search
  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      game.category?._id === selectedCategory ||
      game.category?.slug === selectedCategory ||
      game.genre?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.tags && game.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="games" className="py-16 sm:py-24 relative bg-[#07050f] overflow-hidden">
      {/* Dynamic Ambient Gamer Glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-purple-700/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle PlayStation glyph watermarks */}
      <div className="absolute top-20 right-8 text-purple-500/[0.04] font-black text-9xl select-none pointer-events-none">
        △
      </div>
      <div className="absolute bottom-20 left-8 text-cyan-400/[0.04] font-black text-9xl select-none pointer-events-none">
        ▢
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-gaming font-bold uppercase tracking-wider mb-3 shadow-glow-sm">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>PS5 Next-Gen Game Library</span>
            </div>
            <h2 className="font-gaming font-extrabold text-3xl sm:text-5xl text-white tracking-wide uppercase">
              Explore Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Games</span>
            </h2>
            <p className="mt-2 text-zinc-400 text-xs sm:text-sm md:text-base max-w-xl">
              Kalaburagi’s biggest PlayStation 5 title library. All titles updated, patched, and ready for high-octane 4K gameplay.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search GTA, FIFA, Tekken, GOW..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-vault-card border border-purple-500/25 focus:border-purple-400 text-white placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all shadow-inner focus:shadow-glow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-zinc-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Navigation */}
        <div className="mt-7 sm:mt-9 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-gaming font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-glow-sm border border-purple-400'
                : 'bg-vault-card text-zinc-300 hover:text-white border border-purple-500/15 hover:border-purple-500/40'
            }`}
          >
            All Titles ({games.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-gaming font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-glow-sm border border-purple-400'
                    : 'bg-vault-card text-zinc-300 hover:text-white border border-purple-500/15 hover:border-purple-500/40'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-vault-card/50 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="mt-12 text-center py-16 bg-vault-card/60 rounded-3xl border border-purple-500/20 max-w-lg mx-auto px-4 shadow-xl">
            <Gamepad2 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-gaming font-bold text-white uppercase">No Games Matching Filter</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Try searching a different game title or switch category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-gaming font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredGames.map((game) => {
              const quickBookingUrl = getGameBookingUrl({
                gameTitle: game.title,
                duration: '1 Day Pass (24 hrs)',
                price: game.dailyPrice,
                platform: game.platform || 'PS5',
                phone: whatsappNumber,
              });

              return (
                <div
                  key={game._id}
                  className="group relative rounded-2xl bg-vault-card border border-purple-500/15 hover:border-purple-400/60 transition-all duration-300 hover:shadow-glow-md hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                >
                  {/* High-Impact Game Cover */}
                  <div
                    className="relative h-60 sm:h-64 w-full overflow-hidden bg-vault-surface cursor-pointer select-none"
                    onClick={() => setActiveGameModal(game)}
                  >
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/logo.jpeg';
                      }}
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-vault-card via-black/20 to-black/40" />

                    {/* Console Tag & 4K Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded bg-black/80 text-[10px] font-gaming font-extrabold text-white uppercase tracking-wider border border-purple-500/40 backdrop-blur-sm shadow-md">
                        {game.platform || 'PS5'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-600/80 text-[9px] font-bold text-white tracking-wider backdrop-blur-sm">
                        4K HDR
                      </span>
                    </div>

                    {/* Hot Badge / Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {game.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[10px] font-bold backdrop-blur-sm flex items-center gap-1 shadow-sm">
                          <Flame className="w-3 h-3 text-amber-400 fill-current" />
                          <span>Hot</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-black/75 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{game.rating || 4.9}</span>
                      </span>
                    </div>

                    {/* Live Availability Badge */}
                    <div className="absolute bottom-3 left-3">
                      {game.isAvailable ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/85 text-emerald-300 border border-emerald-500/40 text-[10px] font-gaming font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          Available Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/85 text-amber-300 border border-amber-500/40 text-[10px] font-gaming font-bold uppercase tracking-wider backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          Currently Rented
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Info Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-gaming font-bold uppercase tracking-wider text-purple-400 mb-1">
                        <span>{game.genre}</span>
                        {game.playerCount && (
                          <span className="text-zinc-400 lowercase">{game.playerCount} players</span>
                        )}
                      </div>

                      <h3
                        onClick={() => setActiveGameModal(game)}
                        className="font-gaming font-extrabold text-lg sm:text-xl text-white hover:text-purple-300 cursor-pointer transition-colors line-clamp-1 tracking-wide"
                        title={game.title}
                      >
                        {game.title}
                      </h3>

                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Pricing & Booking Row */}
                    <div className="mt-4 pt-3 border-t border-purple-500/15">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider font-semibold text-zinc-400">Daily Pass</div>
                          <div className="font-gaming font-extrabold text-xl text-white">
                            ₹{game.dailyPrice}
                            <span className="text-xs text-zinc-400 font-normal"> /day</span>
                          </div>
                        </div>

                        {game.specialPrice ? (
                          <div className="text-right">
                            <div className="text-[9px] uppercase tracking-wider font-semibold text-purple-400">Special Rate</div>
                            <div className="font-gaming font-extrabold text-base text-emerald-400">
                              ₹{game.specialPrice}
                            </div>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-500 font-mono">Doorstep Setup</span>
                          </div>
                        )}
                      </div>

                      {/* Tactile Gaming Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setActiveGameModal(game)}
                          className="px-2.5 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/70 text-purple-200 hover:text-white border border-purple-500/30 hover:border-purple-400 text-xs font-gaming font-bold tracking-wider uppercase text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>Rates</span>
                        </button>

                        <a
                          href={quickBookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-gaming font-extrabold tracking-wider uppercase text-center transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/50 whitespace-nowrap group"
                          title="Instant WhatsApp Booking"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>Book</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Pricing Engine Modal */}
      {activeGameModal && (
        <GamePricingModal
          game={activeGameModal}
          onClose={() => setActiveGameModal(null)}
        />
      )}
    </section>
  );
};

export default GamesCatalogue;
