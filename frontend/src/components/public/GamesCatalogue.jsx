import React, { useState, useEffect } from 'react';
import { Search, Gamepad2, Star, Clock, Sparkles, MessageSquare, Flame } from 'lucide-react';
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
    <section id="games" className="py-14 sm:py-24 relative bg-vault-bg">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>PS5 Gaming Vault</span>
            </div>
            <h2 className="font-gaming font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide uppercase">
              Explore Available Games
            </h2>
            <p className="mt-2 text-zinc-400 text-xs sm:text-sm md:text-base max-w-xl">
              Choose from Kalaburagi’s top PlayStation 5 game library. Pre-installed, updated, and ready for 4K action.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72 lg:w-80 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search GTA, FIFA, Tekken..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-2 rounded-xl bg-vault-surface border border-purple-500/20 focus:border-purple-400 text-white placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Dynamically from MongoDB) */}
        <div className="mt-6 sm:mt-8 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-glow-sm border border-purple-400'
                : 'bg-vault-surface/80 text-zinc-300 hover:text-white border border-purple-500/15 hover:border-purple-500/40'
            }`}
          >
            All Games ({games.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-glow-sm border border-purple-400'
                    : 'bg-vault-surface/80 text-zinc-300 hover:text-white border border-purple-500/15 hover:border-purple-500/40'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 sm:h-96 rounded-2xl bg-vault-card/50 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="mt-12 text-center py-12 sm:py-16 bg-vault-surface/40 rounded-2xl border border-purple-500/10 max-w-lg mx-auto px-4">
            <Gamepad2 className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white">No games found</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-purple-900/40 text-purple-300 text-xs font-semibold border border-purple-500/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGames.map((game) => {
              const quickBookingUrl = getGameBookingUrl({
                gameTitle: game.title,
                duration: '1 Hour',
                price: game.hourlyPrice,
                platform: game.platform || 'PS5',
                phone: whatsappNumber,
              });

              return (
                <div
                  key={game._id}
                  className="group relative rounded-2xl bg-vault-card border border-purple-500/15 hover:border-purple-400/50 transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
                >
                  {/* Cover Artwork */}
                  <div
                    className="relative h-52 sm:h-60 w-full overflow-hidden bg-vault-surface cursor-pointer"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-vault-card via-transparent to-black/30" />

                    {/* Platform Tag */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-purple-600/90 text-[10px] font-extrabold text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                      {game.platform || 'PS5'}
                    </span>

                    {/* Featured / Rating Pill */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      {game.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold backdrop-blur-sm flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-amber-400 fill-current" />
                          <span>Hot</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-black/60 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold backdrop-blur-sm flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{game.rating || 4.8}</span>
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-2.5 left-2.5">
                      {game.isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-bold backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          Rented Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] sm:text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-1">
                        {game.genre}
                      </div>

                      <h3
                        onClick={() => setActiveGameModal(game)}
                        className="font-gaming font-bold text-base sm:text-lg text-white hover:text-purple-300 cursor-pointer transition-colors line-clamp-1"
                        title={game.title}
                      >
                        {game.title}
                      </h3>

                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Pricing Info */}
                    <div className="mt-3.5 pt-3 border-t border-purple-500/10">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-[9px] sm:text-[10px] text-zinc-400 uppercase">Hourly Rate</div>
                          <div className="font-gaming font-bold text-base sm:text-lg text-white">
                            ₹{game.hourlyPrice}
                            <span className="text-xs text-zinc-400 font-normal"> /hr</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[9px] sm:text-[10px] text-zinc-400 uppercase">Daily Pass</div>
                          <div className="font-gaming font-bold text-sm sm:text-base text-emerald-400">
                            ₹{game.dailyPrice}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Mobile friendly sizing */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setActiveGameModal(game)}
                          className="px-2 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Rates</span>
                        </button>

                        <a
                          href={quickBookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1 shadow-sm whitespace-nowrap"
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
