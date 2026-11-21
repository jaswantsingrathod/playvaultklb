import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'PlayVaultKLB',
    tagline: 'Premium PS5 Rental Services',
    logoUrl: '/logo.jpeg',
    heroHeading: 'YOUR NEXT GAMING SESSION STARTS HERE.',
    heroSubheading:
      'Experience premium PlayStation 5 gaming without the commitment of buying a console. Pick your favourite games, choose your rental duration and start playing.',
    heroBadge: '⚡ Ultra-Fast 4K PS5 Gaming • Kalaburagi / KLB',
    heroBgImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=2000&q=80',
    announcementText: '🎮 Weekend slots filling fast! Book your PS5 console on WhatsApp now.',
    announcementActive: true,
    whatsappNumber: '8904004036',
    whatsappCountryCode: '91',
    instagramUrl: 'https://www.instagram.com/playvaultklb/',
    instagramHandle: '@playvaultklb',
    contactPhone: '+91 8904004036',
    contactEmail: 'Playvaultklb@gmail.com',
    googleMapsUrl:
      'https://www.google.co.in/search?kgmid=/g/11p2x68xw2&q=PlayVault+KLB+-+PS5+%26+Gaming+Console+Rentals',
    address: 'Kalaburagi (Gulbarga), Karnataka, India',
    workingHours: 'Everyday: 10:00 AM – 11:00 PM (WhatsApp 24/7)',
    aboutTitle: 'About PlayVaultKLB',
    aboutText:
      'PlayVaultKLB was founded to give gaming enthusiasts in Kalaburagi seamless, affordable access to cutting-edge PlayStation 5 gaming. Whether you need a console for a weekend party, an all-night tournament with friends, or to experience the latest blockbuster titles in 4K HDR, we provide well-maintained PS5 consoles, extra controllers, and top-tier games delivered straight to your door.',
    termsText: '',
    privacyText: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.success && res.data.data) {
        setSettings((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      console.warn('Could not fetch website settings from backend, using default fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <WebsiteContext.Provider
      value={{
        settings,
        whatsappNumber: settings.whatsappNumber || '8904004036',
        instagramUrl: settings.instagramUrl || 'https://www.instagram.com/playvaultklb/',
        refreshSettings: fetchSettings,
        loading,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => useContext(WebsiteContext);
