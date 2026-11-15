const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Admin = require('../models/Admin');
const GameCategory = require('../models/GameCategory');
const Game = require('../models/Game');
const GamePricing = require('../models/GamePricing');
const RentalPlan = require('../models/RentalPlan');
const WebsiteSetting = require('../models/WebsiteSetting');
const Media = require('../models/Media');
const AdminActivityLog = require('../models/AdminActivityLog');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/playvault';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Seed] Connected to database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    if (uri !== 'mongodb://127.0.0.1:27017/playvault') {
      console.log('[Seed] Remote connect failed, trying local fallback...');
      const fallback = await mongoose.connect('mongodb://127.0.0.1:27017/playvault');
      console.log(`[Seed] Fallback connected to: ${fallback.connection.name}`);
      return fallback;
    }
    throw err;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      Admin.deleteMany({}),
      GameCategory.deleteMany({}),
      Game.deleteMany({}),
      GamePricing.deleteMany({}),
      RentalPlan.deleteMany({}),
      WebsiteSetting.deleteMany({}),
      AdminActivityLog.deleteMany({}),
    ]);

    // 1. Seed Admin
    console.log('[Seed] Creating default administrator account...');
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@playvaultklb.com',
      password: 'PlayVault@2025!', // will be automatically hashed by pre-save hook
      fullName: 'PlayVault Master Admin',
      role: 'superadmin',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80',
    });
    console.log(`[Seed] Admin created: ${admin.email} (Username: admin)`);

    // 2. Seed Categories
    console.log('[Seed] Creating game categories...');
    const categoriesData = [
      { name: 'Action', slug: 'action', description: 'Fast-paced high adrenaline combat and action games', icon: 'Sword', displayOrder: 1 },
      { name: 'Adventure', slug: 'adventure', description: 'Cinematic storytelling and rich open-world exploration', icon: 'Compass', displayOrder: 2 },
      { name: 'Sports', slug: 'sports', description: 'Real-world competitive football, cricket and basketball', icon: 'Trophy', displayOrder: 3 },
      { name: 'Racing', slug: 'racing', description: 'High-speed motorsport simulations and arcade racers', icon: 'Gauge', displayOrder: 4 },
      { name: 'Fighting', slug: 'fighting', description: 'Intense 1-on-1 martial arts and tournament fighting', icon: 'Zap', displayOrder: 5 },
      { name: 'Multiplayer', slug: 'multiplayer', description: 'Split-screen co-op and online battle squad games', icon: 'Users', displayOrder: 6 },
      { name: 'RPG', slug: 'rpg', description: 'Character progression, questing and immersive roleplay', icon: 'Shield', displayOrder: 7 },
    ];

    const createdCategories = await GameCategory.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // 3. Seed Rental Plans (The 7 Existing Business Plans)
    console.log('[Seed] Seeding the 7 official PlayVaultKLB rental plans...');
    const standardInclusions = [
      'PlayStation 5 Console (Disk/Digital)',
      '1 DualSense Wireless Controller',
      '24/7 Dedicated Support',
      'GTA VI / Top AAA Games Included',
      'Ultra High Speed HDMI 2.1 Cable',
      'Power Cable & Type-C Charging Cable',
    ];

    const rentalPlansData = [
      {
        name: '1-Day Plan',
        slug: '1-day-plan',
        durationLabel: '1 Day',
        durationHours: 8,
        price: 699,
        originalPrice: 899,
        description: 'Perfect for an evening gaming sprint or weekend trial session.',
        inclusions: standardInclusions,
        badge: 'Starter',
        isPopular: false,
        displayOrder: 1,
      },
      {
        name: '2-Days Plan',
        slug: '2-days-plan',
        durationLabel: '2 Days',
        durationHours: 32,
        price: 1399,
        originalPrice: 1699,
        description: 'Ideal weekend getaway gaming package with friends or family.',
        inclusions: standardInclusions,
        badge: 'Weekend Special',
        isPopular: false,
        displayOrder: 2,
      },
      {
        name: '3-Days Plan',
        slug: '3-days-plan',
        durationLabel: '3 Days',
        durationHours: 56,
        price: 1799,
        originalPrice: 2199,
        description: 'Our most demanded rental option! Dive deep into expansive campaigns.',
        inclusions: [...standardInclusions, 'Extra Controller Available on Request'],
        badge: 'Most Popular',
        isPopular: true,
        displayOrder: 3,
      },
      {
        name: '4-Days Plan',
        slug: '4-days-plan',
        durationLabel: '4 Days',
        durationHours: 80,
        price: 2499,
        originalPrice: 2999,
        description: 'Ample time to conquer story games and level up in tournaments.',
        inclusions: [...standardInclusions, 'Extra Controller Available on Request'],
        badge: 'Extended Play',
        isPopular: false,
        displayOrder: 4,
      },
      {
        name: '5-Days Plan',
        slug: '5-days-plan',
        durationLabel: '5 Days',
        durationHours: 120,
        price: 2999,
        originalPrice: 3599,
        description: 'Five full days of unrestricted 4K HDR next-generation gaming.',
        inclusions: [...standardInclusions, 'Priority Delivery & Setup'],
        badge: 'Pro Gamer',
        isPopular: false,
        displayOrder: 5,
      },
      {
        name: '6-Days Plan',
        slug: '6-days-plan',
        durationLabel: '6 Days',
        durationHours: 144,
        price: 3399,
        originalPrice: 4199,
        description: 'Massive value plan for serious gamers and vacation breaks.',
        inclusions: [...standardInclusions, 'Priority Delivery & Setup'],
        badge: 'Elite',
        isPopular: false,
        displayOrder: 6,
      },
      {
        name: '1-Week Plan',
        slug: '1-week-plan',
        durationLabel: '1 Week',
        durationHours: 168,
        price: 3999,
        originalPrice: 5199,
        description: 'Ultimate weekly experience. Lowest per-day rate with full VIP support.',
        inclusions: [
          ...standardInclusions,
          'Free Swappable Game Title Mid-Week',
          'VIP 24/7 Priority Assistance',
        ],
        badge: 'Best Value',
        isPopular: true,
        displayOrder: 7,
      },
    ];

    await RentalPlan.insertMany(rentalPlansData);
    console.log('[Seed] Successfully seeded 7 official rental plans.');

    // 4. Seed Games and Advanced Game-Specific Pricing Engine Tiers
    console.log('[Seed] Seeding games and custom pricing configurations...');
    const gamesData = [
      {
        title: 'Grand Theft Auto V',
        slug: 'grand-theft-auto-v',
        description: 'Experience Los Santos in stunning 4K 60FPS on PS5. Includes GTA Online and enhanced DualSense haptic feedback for every vehicle and weapon.',
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
        genre: 'Action-Adventure',
        category: catMap['action'],
        platform: 'PS5',
        hourlyPrice: 50,
        dailyPrice: 350,
        specialPrice: 320,
        isAvailable: true,
        isFeatured: true,
        rating: 4.9,
        releaseYear: 2022,
        tags: ['Open World', 'Crime', '4K 60FPS', 'Multiplayer'],
        players: '1 Player (30 Online)',
        storageRequired: '95 GB',
        displayOrder: 1,
        tiers: [
          { durationHours: 1, title: '1 Hour Quick Session', price: 50, pricingType: 'hourly', description: 'Single hour adrenaline drive' },
          { durationHours: 2, title: '2 Hours Duo Heist', price: 90, originalPrice: 100, pricingType: 'multi-hour', isPopular: true, badge: 'Popular' },
          { durationHours: 3, title: '3 Hours Heist Marathon', price: 130, originalPrice: 150, pricingType: 'multi-hour', badge: 'Save ₹20' },
          { durationHours: 5, title: '5 Hours Mastermind', price: 200, originalPrice: 250, pricingType: 'package', badge: 'Best Value' },
          { durationHours: 24, title: '24 Hours Full Day Pass', price: 350, originalPrice: 450, pricingType: 'daily', badge: 'All Day' },
        ],
      },
      {
        title: 'EA Sports FC 24 (FIFA)',
        slug: 'ea-sports-fc-24',
        description: 'The pinnacle of football gaming powered by HyperMotionV technology and PlayStyles optimised by Opta. Play tournament matches with friends.',
        coverImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
        genre: 'Sports',
        category: catMap['sports'],
        platform: 'PS5',
        hourlyPrice: 40,
        dailyPrice: 300,
        specialPrice: 280,
        isAvailable: true,
        isFeatured: true,
        rating: 4.7,
        releaseYear: 2023,
        tags: ['Football', 'Local Co-op', 'Tournament', 'HyperMotionV'],
        players: '1-4 Players Local',
        storageRequired: '50 GB',
        displayOrder: 2,
        tiers: [
          { durationHours: 1, title: '1 Hour Friendly Match', price: 40, pricingType: 'hourly' },
          { durationHours: 2, title: '2 Hours Derby Pass', price: 75, originalPrice: 80, pricingType: 'multi-hour', isPopular: true, badge: 'Most Played' },
          { durationHours: 3, title: '3 Hours Champions League', price: 110, originalPrice: 120, pricingType: 'multi-hour', badge: 'Save ₹10' },
          { durationHours: 5, title: '5 Hours Squad Tournament', price: 170, originalPrice: 200, pricingType: 'package', badge: 'Party Hit' },
          { durationHours: 24, title: '24 Hours Weekend League', price: 300, originalPrice: 400, pricingType: 'daily', badge: 'Full Day' },
        ],
      },
      {
        title: 'God of War Ragnarök',
        slug: 'god-of-war-ragnarok',
        description: 'Join Kratos and Atreus on a mythic journey for answers before Ragnarök arrives. Master the Leviathan Axe and Blades of Chaos with tactile haptics.',
        coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        genre: 'Action-Adventure',
        category: catMap['adventure'],
        platform: 'PS5',
        hourlyPrice: 60,
        dailyPrice: 400,
        specialPrice: null,
        isAvailable: true,
        isFeatured: true,
        rating: 5.0,
        releaseYear: 2022,
        tags: ['Mythology', 'Cinematic', 'Boss Battles', '4K HDR'],
        players: '1 Player',
        storageRequired: '84 GB',
        displayOrder: 3,
        tiers: [
          { durationHours: 1, title: '1 Hour Trial', price: 60, pricingType: 'hourly' },
          { durationHours: 2, title: '2 Hours Realm Explorer', price: 110, originalPrice: 120, pricingType: 'multi-hour', isPopular: true, badge: 'Popular' },
          { durationHours: 3, title: '3 Hours Boss Gauntlet', price: 160, originalPrice: 180, pricingType: 'multi-hour', badge: 'Save ₹20' },
          { durationHours: 5, title: '5 Hours Nine Realms Pass', price: 250, originalPrice: 300, pricingType: 'package', badge: 'Epic Pass' },
          { durationHours: 24, title: '24 Hours Godly Immersion', price: 400, originalPrice: 500, pricingType: 'daily', badge: 'Full Campaign' },
        ],
      },
      {
        title: "Marvel's Spider-Man 2",
        slug: 'marvels-spider-man-2',
        description: 'Swing, jump, and utilize the new Web Wings to travel across Marvel’s New York, quickly switching between Peter Parker and Miles Morales.',
        coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
        genre: 'Action',
        category: catMap['action'],
        platform: 'PS5',
        hourlyPrice: 60,
        dailyPrice: 400,
        specialPrice: 380,
        isAvailable: true,
        isFeatured: true,
        rating: 4.9,
        releaseYear: 2023,
        tags: ['Superhero', 'Ray Tracing', 'Fast Travel', 'DualSense'],
        players: '1 Player',
        storageRequired: '88 GB',
        displayOrder: 4,
        tiers: [
          { durationHours: 1, title: '1 Hour Web-Swing', price: 60, pricingType: 'hourly' },
          { durationHours: 2, title: '2 Hours Duo Spiders', price: 110, originalPrice: 120, pricingType: 'multi-hour', isPopular: true, badge: 'High Demand' },
          { durationHours: 3, title: '3 Hours Venom Clash', price: 160, originalPrice: 180, pricingType: 'multi-hour', badge: 'Save ₹20' },
          { durationHours: 5, title: '5 Hours Queens to Manhattan', price: 250, originalPrice: 300, pricingType: 'package', badge: 'Best Value' },
          { durationHours: 24, title: '24 Hours Heroic Day', price: 400, originalPrice: 500, pricingType: 'daily', badge: 'All Day Pass' },
        ],
      },
      {
        title: 'Tekken 8',
        slug: 'tekken-8',
        description: 'Fist Meets Fate in the ultimate 3D fighting game powered by Unreal Engine 5. High-impact clashes and the revolutionary new Heat System.',
        coverImage: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80',
        genre: 'Fighting',
        category: catMap['fighting'],
        platform: 'PS5',
        hourlyPrice: 50,
        dailyPrice: 350,
        specialPrice: null,
        isAvailable: true,
        isFeatured: false,
        rating: 4.8,
        releaseYear: 2024,
        tags: ['Versus Fighting', 'Local 2-Player', 'Unreal Engine 5', '60FPS'],
        players: '1-2 Players Local',
        storageRequired: '86 GB',
        displayOrder: 5,
        tiers: [
          { durationHours: 1, title: '1 Hour Iron Fist Match', price: 50, pricingType: 'hourly' },
          { durationHours: 2, title: '2 Hours Rivalry Pass', price: 90, originalPrice: 100, pricingType: 'multi-hour', isPopular: true, badge: 'Popular' },
          { durationHours: 3, title: '3 Hours Tournament Bracket', price: 130, originalPrice: 150, pricingType: 'multi-hour', badge: 'Save ₹20' },
          { durationHours: 5, title: '5 Hours King of Iron Fist', price: 200, originalPrice: 250, pricingType: 'package', badge: 'Fighter Pass' },
          { durationHours: 24, title: '24 Hours Dojo All-Day', price: 350, originalPrice: 450, pricingType: 'daily', badge: 'Full Day' },
        ],
      },
      {
        title: 'Gran Turismo 7',
        slug: 'gran-turismo-7',
        description: 'The Real Driving Simulator. Over 400 cars and 90 track routes with photorealistic 4K HDR ray tracing and adaptive trigger brake feedback.',
        coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80',
        genre: 'Racing',
        category: catMap['racing'],
        platform: 'PS5',
        hourlyPrice: 50,
        dailyPrice: 350,
        specialPrice: null,
        isAvailable: true,
        isFeatured: false,
        rating: 4.8,
        releaseYear: 2022,
        tags: ['Simulation Racing', 'Ray Tracing', 'Adaptive Triggers', 'Split Screen'],
        players: '1-2 Players (20 Online)',
        storageRequired: '110 GB',
        displayOrder: 6,
        tiers: [
          { durationHours: 1, title: '1 Hour Time Attack', price: 50, pricingType: 'hourly' },
          { durationHours: 2, title: '2 Hours Track Day', price: 90, originalPrice: 100, pricingType: 'multi-hour', isPopular: true, badge: 'Popular' },
          { durationHours: 3, title: '3 Hours Grand Prix', price: 130, originalPrice: 150, pricingType: 'multi-hour', badge: 'Save ₹20' },
          { durationHours: 5, title: '5 Hours Endurance Championship', price: 200, originalPrice: 250, pricingType: 'package', badge: 'Best Value' },
          { durationHours: 24, title: '24 Hours Le Mans All-Day', price: 350, originalPrice: 450, pricingType: 'daily', badge: '24h Pass' },
        ],
      },
      {
        title: 'Call of Duty: Modern Warfare III',
        slug: 'call-of-duty-modern-warfare-iii',
        description: 'Captain Price and Task Force 141 face off against the ultimate threat. Features legendary multiplayer maps and open-world Zombies mode.',
        coverImage: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
        genre: 'Action',
        category: catMap['multiplayer'],
        platform: 'PS5',
        hourlyPrice: 60,
        dailyPrice: 420,
        specialPrice: null,
        isAvailable: true,
        isFeatured: true,
        rating: 4.7,
        releaseYear: 2023,
        tags: ['FPS', 'Multiplayer', 'Warzone', '120 FPS Support'],
        players: '1 Player (64 Online)',
        storageRequired: '135 GB',
        displayOrder: 7,
        tiers: [
          { durationHours: 1, title: '1 Hour Quick Drop', price: 60, pricingType: 'hourly' },
          { durationHours: 2, title: '2 Hours Squad Rush', price: 115, originalPrice: 120, pricingType: 'multi-hour', isPopular: true, badge: 'Hot' },
          { durationHours: 3, title: '3 Hours Warzone Domination', price: 165, originalPrice: 180, pricingType: 'multi-hour', badge: 'Save ₹15' },
          { durationHours: 5, title: '5 Hours Tactical Marathon', price: 260, originalPrice: 300, pricingType: 'package', badge: 'Squad Pack' },
          { durationHours: 24, title: '24 Hours Combat Pass', price: 420, originalPrice: 500, pricingType: 'daily', badge: 'Full Day' },
        ],
      },
      {
        title: 'Mortal Kombat 1',
        slug: 'mortal-kombat-1',
        description: 'Discover a reborn Mortal Kombat Universe created by the Fire God Liu Kang. Features Kameo Fighters, brutal Fatalities, and local co-op showdowns.',
        coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80',
        genre: 'Fighting',
        category: catMap['fighting'],
        platform: 'PS5',
        hourlyPrice: 50,
        dailyPrice: 360,
        specialPrice: null,
        isAvailable: true,
        isFeatured: false,
        rating: 4.8,
        releaseYear: 2023,
        tags: ['Kameo Fighters', 'Fatalities', 'Local 2-Player', '4K 60FPS'],
        players: '1-2 Players Local',
        storageRequired: '114 GB',
        displayOrder: 8,
        tiers: [
          { durationHours: 1, title: '1 Hour Kombatan', price: 50, pricingType: 'hourly' },
          { durationHours: 2, title: '2 Hours Fatality Duels', price: 95, originalPrice: 100, pricingType: 'multi-hour', isPopular: true, badge: 'Popular' },
          { durationHours: 3, title: '3 Hours Outworld Showdown', price: 135, originalPrice: 150, pricingType: 'multi-hour', badge: 'Save ₹15' },
          { durationHours: 5, title: '5 Hours Champion Gauntlet', price: 210, originalPrice: 250, pricingType: 'package', badge: 'Pro Fight' },
          { durationHours: 24, title: '24 Hours Reborn Universe', price: 360, originalPrice: 450, pricingType: 'daily', badge: 'All Day' },
        ],
      },
    ];

    for (const gData of gamesData) {
      const { tiers, ...gFields } = gData;
      const game = await Game.create(gFields);

      for (let i = 0; i < tiers.length; i++) {
        await GamePricing.create({
          game: game._id,
          ...tiers[i],
          displayOrder: i + 1,
        });
      }
    }
    console.log(`[Seed] Seeded ${gamesData.length} games with detailed pricing tiers.`);

    // 5. Seed Website Settings
    console.log('[Seed] Seeding website settings & business parameters...');
    await WebsiteSetting.create({
      key: 'main_settings',
      siteName: 'PlayVaultKLB',
      tagline: 'Premium PS5 Rental Services',
      logoUrl: '',
      heroHeading: 'YOUR NEXT GAMING SESSION STARTS HERE.',
      heroSubheading:
        'Experience premium PlayStation 5 gaming without the commitment of buying a console. Pick your favourite games, choose your rental duration and start playing.',
      heroBadge: '⚡ Ultra-Fast 4K PS5 Gaming • Kalaburagi / KLB',
      heroBgImage:
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=2000&q=80',
      announcementText:
        '🎮 Weekend slots filling fast! Book your PS5 console on WhatsApp now. Instant doorstep delivery across Kalaburagi.',
      announcementActive: true,
      whatsappNumber: '8904004036',
      whatsappCountryCode: '91',
      whatsappMessageTemplate:
        'Hello PlayVaultKLB!\n\nI am interested in booking a PS5 rental.\n\nGame: {game}\nRental Duration: {duration}\nPrice: ₹{price}\n\nPlease confirm availability.',
      instagramUrl: 'https://www.instagram.com/playvaultklb/',
      instagramHandle: '@playvaultklb',
      contactPhone: '+91 8904004036',
      contactEmail: 'Playvaultklb@gmail.com',
      googleMapsUrl: "https://www.google.com/maps/place/17%C2%B017'53.7%22N+76%C2%B049'49.0%22E/@17.2983117,76.829671,19z/data=!4m4!3m3!8m2!3d17.29825!4d76.8302778?hl=en&entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D",
      address: 'Kalaburagi (Gulbarga), Karnataka, India',
      workingHours: 'Everyday: 10:00 AM – 11:00 PM (WhatsApp 24/7)',
      aboutTitle: 'About PlayVaultKLB',
      aboutText:
        'PlayVaultKLB was founded to give gaming enthusiasts in Kalaburagi seamless, affordable access to cutting-edge PlayStation 5 gaming. Whether you need a console for a weekend party, an all-night tournament with friends, or to experience the latest blockbuster titles in 4K HDR, we provide well-maintained PS5 consoles, extra controllers, and top-tier games delivered straight to your door.',
      termsText:
        '1. Valid government ID proof (Aadhaar / Driving License) required at the time of delivery.\n2. Security deposit is refundable upon return of undamaged equipment.\n3. Equipment must not be physically opened, tampered with, or modified.\n4. Late returns are charged according to standard hourly rates.\n5. Customer is responsible for equipment care during the rental period.',
      privacyText:
        'PlayVaultKLB respects your privacy. We collect customer contact and identification information solely for verification, booking processing, and delivery of rental gaming hardware. We never sell, rent, or share customer data with third parties.',
    });
    console.log('[Seed] Website settings initialized.');

    // 6. Log Initial Seed Activity
    await AdminActivityLog.create({
      admin: admin._id,
      adminName: 'PlayVault Master Admin',
      action: 'SYSTEM_SEED',
      module: 'System',
      details: 'Initial database seeding completed with 7 rental plans, 8 games, categories, and business settings.',
      ipAddress: '127.0.0.1',
    });

    console.log('==================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Default Admin Credentials:');
    console.log('Email:    admin@playvaultklb.com');
    console.log('Username: admin');
    console.log('Password: PlayVault@2025!');
    console.log('==================================================');

    if (require.main === module) {
      process.exit(0);
    }
    return true;
  } catch (err) {
    console.error('❌ SEEDING FAILED:', err);
    if (require.main === module) {
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
