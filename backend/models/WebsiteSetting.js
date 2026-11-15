const mongoose = require('mongoose');

const websiteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_settings',
      unique: true,
    },
    siteName: {
      type: String,
      default: 'PlayVaultKLB',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Premium PS5 Console & Games Rental Services',
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    // Hero section
    heroHeading: {
      type: String,
      default: 'YOUR NEXT GAMING SESSION STARTS HERE.',
      trim: true,
    },
    heroSubheading: {
      type: String,
      default: 'Experience premium PlayStation 5 gaming without the commitment of buying a console. Pick your favourite games, choose your rental duration and start playing.',
      trim: true,
    },
    heroBadge: {
      type: String,
      default: '⚡ Ultra-Fast 4K PS5 Gaming • Kalaburagi / KLB',
      trim: true,
    },
    heroBgImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=2000&q=80',
    },
    // Announcement banner
    announcementText: {
      type: String,
      default: '🎮 Weekend gaming slots open! Instant delivery across Kalaburagi. Book on WhatsApp now!',
      trim: true,
    },
    announcementActive: {
      type: Boolean,
      default: true,
    },
    // Contact & WhatsApp
    whatsappNumber: {
      type: String,
      default: '8904004036',
      trim: true,
    },
    whatsappCountryCode: {
      type: String,
      default: '91',
      trim: true,
    },
    whatsappMessageTemplate: {
      type: String,
      default: 'Hello PlayVaultKLB!\n\nI am interested in booking a PS5 rental.\n\nGame: {game}\nDuration: {duration}\nPrice: ₹{price}\n\nPlease confirm availability and delivery details.',
    },
    // Social Links
    instagramUrl: {
      type: String,
      default: 'https://www.instagram.com/playvaultklb/',
      trim: true,
    },
    instagramHandle: {
      type: String,
      default: '@playvaultklb',
      trim: true,
    },
    facebookUrl: {
      type: String,
      default: '',
      trim: true,
    },
    youtubeUrl: {
      type: String,
      default: '',
      trim: true,
    },
    // Direct Contact Info
    contactPhone: {
      type: String,
      default: '+91 8904004036',
      trim: true,
    },
    contactEmail: {
      type: String,
      default: 'Playvaultklb@gmail.com',
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      default: "https://www.google.com/maps/place/17%C2%B017'53.7%22N+76%C2%B049'49.0%22E/@17.2983117,76.829671,19z/data=!4m4!3m3!8m2!3d17.29825!4d76.8302778?hl=en&entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D",
      trim: true,
    },
    address: {
      type: String,
      default: 'Kalaburagi (Gulbarga), Karnataka, India',
      trim: true,
    },
    workingHours: {
      type: String,
      default: 'Everyday: 10:00 AM – 11:00 PM (WhatsApp 24/7)',
      trim: true,
    },
    // About Us Content
    aboutTitle: {
      type: String,
      default: 'About PlayVaultKLB',
      trim: true,
    },
    aboutText: {
      type: String,
      default: 'PlayVaultKLB was founded to give gaming enthusiasts in Kalaburagi seamless, affordable access to cutting-edge PlayStation 5 gaming. Whether you need a console for a weekend party, an all-night tournament with friends, or to experience the latest blockbuster titles in 4K HDR, we provide well-maintained PS5 consoles, extra controllers, and top-tier games delivered straight to your door.',
      trim: true,
    },
    // Terms & Privacy
    termsText: {
      type: String,
      default: '1. Valid government ID proof (Aadhaar / Driving License) required at the time of delivery.\n2. Security deposit is refundable upon return of undamaged equipment.\n3. Equipment must not be physically opened or modified.\n4. Late returns are charged according to standard hourly rates.\n5. Customer is responsible for equipment care during rental period.',
    },
    privacyText: {
      type: String,
      default: 'PlayVaultKLB values your privacy. We collect customer contact and identification information solely for verification, booking processing, and delivery of rental gaming hardware. We never sell, rent, or share customer data with third parties.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WebsiteSetting', websiteSettingSchema);
