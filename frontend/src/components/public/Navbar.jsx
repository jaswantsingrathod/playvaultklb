import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Menu, X, MessageSquare, Instagram, ShieldCheck, ChevronRight } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import { getGeneralInquiryUrl } from '../../utils/whatsapp';

const Navbar = () => {
  const { settings, whatsappNumber, instagramUrl } = useWebsite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Games', href: '#games' },
    { name: 'Rental Plans', href: '#plans' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bookingUrl = getGeneralInquiryUrl('I want to book a PlayStation 5 console rental in Kalaburagi. Please share today’s open slots and game availability!', whatsappNumber);

  return (
    <>
      {/* Top Announcement Bar if active */}
      {settings.announcementActive && settings.announcementText && (
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-vault-surface border-b border-purple-500/20 py-1 px-3 text-center text-[11px] sm:text-xs font-medium text-purple-200">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="line-clamp-1">{settings.announcementText}</span>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white hover:text-purple-300 ml-1 font-semibold inline-flex items-center gap-0.5 whitespace-nowrap"
            >
              Book Now <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-vault-bg/95 backdrop-blur-md border-b border-purple-500/15 py-2.5 sm:py-3 shadow-lg shadow-purple-950/20'
            : 'bg-transparent py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group">
              <img
                src={settings.logoUrl || '/logo.jpeg'}
                alt="PlayVaultKLB Logo"
                className="h-9 sm:h-11 w-auto object-contain rounded-xl border border-purple-500/30 group-hover:border-purple-400 transition-all shadow-glow-sm bg-vault-card/80 p-0.5"
                onError={(e) => {
                  e.target.src = '/logo.jpeg';
                }}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-gaming font-extrabold text-xl sm:text-2xl tracking-wider text-white">
                    PLAY<span className="text-purple-400">VAULT</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 tracking-widest uppercase">
                    KLB
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-zinc-400 tracking-wider -mt-0.5 sm:-mt-1 font-medium hidden xs:block">
                  PREMIUM PS5 RENTALS
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3 py-1.5 text-xs font-gaming font-bold tracking-wider uppercase text-zinc-300 hover:text-white rounded-lg hover:bg-purple-950/50 hover:border hover:border-purple-500/30 transition-all"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Desktop Actions: Status, Instagram & WhatsApp Button */}
            <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-gaming font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PS5 FLEET: READY</span>
              </div>

              {/* Instagram link */}
              <a
                href={instagramUrl || 'https://www.instagram.com/playvaultklb/'}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow PlayVaultKLB on Instagram"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-vault-surface border border-purple-500/20 hover:border-pink-500/50 flex items-center justify-center text-zinc-300 hover:text-pink-400 transition-all hover:shadow-glow-sm"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              {/* WhatsApp Booking CTA */}
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-gaming font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                <span>Book on WhatsApp</span>
              </a>

              {/* Discreet Admin Login Link */}
              <Link
                to="/admin/login"
                title="Admin Portal"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-purple-400 hover:bg-purple-950/20 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Hamburger & Actions */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                title="Book via WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>Book</span>
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-xl bg-vault-surface border border-purple-500/20 text-zinc-300 hover:text-white"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-vault-surface/98 backdrop-blur-2xl border-b border-purple-500/20 px-4 pt-2 pb-5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-2 text-sm font-medium text-zinc-200 hover:text-purple-400 hover:bg-purple-950/30 rounded-lg transition-colors"
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-3 border-t border-purple-500/20 flex flex-col gap-2">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center shadow-md"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>WhatsApp Booking: 8904004036</span>
                </a>

                <div className="flex items-center justify-between px-2 pt-1 text-xs text-zinc-400">
                  <a
                    href={instagramUrl || 'https://www.instagram.com/playvaultklb/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-pink-400 hover:underline"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@playvaultklb</span>
                  </a>
                  <Link to="/admin/login" className="flex items-center gap-1 text-zinc-500 hover:text-purple-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Login</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
