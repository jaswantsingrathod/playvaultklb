# PlayVaultKLB Database Architecture & Collections

**Database Engine:** MongoDB  
**Object Data Modeling (ODM):** Mongoose v8  
**Default Database:** `playvault`  
**Host:** MongoDB Atlas (Cloud) or Local MongoDB (`mongodb://127.0.0.1:27017/playvault`)

---

## Collections Overview

### 1. `admins` (Model: `Admin`)
Stores administrator accounts authorized to manage the platform.
- `username` (String, unique, indexed): Admin username.
- `email` (String, unique, indexed): Admin email.
- `password` (String): Hashed password using `bcryptjs` (salt rounds: 10).
- `fullName` (String): Administrator display name.
- `role` (String, enum: `['superadmin', 'admin', 'manager']`): Authorization tier.
- `avatar` (String): Profile picture URL.
- `lastLogin` (Date): Timestamp of last successful login.
- `isActive` (Boolean, default: `true`): Account active state.
- `createdAt`, `updatedAt` (Timestamps).

### 2. `games` (Model: `Game`)
Stores PlayStation 5 video games available for rental.
- `title` (String, required): Game title (e.g., Grand Theft Auto V).
- `slug` (String, unique, indexed): URL-friendly unique identifier.
- `description` (String): Detailed overview of features and gameplay.
- `coverImage` (String, required): Cloudinary or remote image URL.
- `bannerImage` (String): Wide cinematic banner image URL.
- `genre` (String, indexed): Genre classification (Action, Sports, Fighting, Racing, etc.).
- `category` (ObjectId ref: `GameCategory`): Category relationship.
- `platform` (String, default: `'PS5'`): Hardware platform.
- `hourlyPrice` (Number, required): Base rate per hour (in ₹ INR).
- `dailyPrice` (Number, required): Full day 24h rental pass (in ₹ INR).
- `specialPrice` (Number, nullable): Promotional discount price.
- `isAvailable` (Boolean, default: `true`): Inventory availability status.
- `isFeatured` (Boolean, default: `false`): Highlighted in showcase.
- `isActive` (Boolean, default: `true`): Displayed on public website.
- `isDeleted` (Boolean, default: `false`): Soft-deletion flag.
- `rating` (Number, default: `4.8`): User rating score (1 to 5).
- `releaseYear` (Number): Original release year.
- `tags` ([String]): Visual chips (`4K HDR`, `60 FPS`, `DualSense`, etc.).
- `players` (String): Local & online player count.
- `storageRequired` (String): Console SSD requirement.
- `displayOrder` (Number): Order weight.
- `createdAt`, `updatedAt` (Timestamps).

### 3. `gamecategories` (Model: `GameCategory`)
Dynamic categories managed by the administrator.
- `name` (String, required): Category label (Action, Sports, Racing, Fighting, etc.).
- `slug` (String, unique, indexed): Category identifier.
- `description` (String): Category description.
- `icon` (String): Lucide icon identifier.
- `displayOrder` (Number): Sorting priority.
- `isActive` (Boolean, default: `true`): Filter pill visibility.
- `createdAt`, `updatedAt` (Timestamps).

### 4. `gamepricings` (Model: `GamePricing`)
**Advanced Rental Pricing Engine:** Allows per-game flexible duration rate tiers.
- `game` (ObjectId ref: `Game`, required, indexed): Associated game.
- `durationHours` (Number, required): Duration length in hours (e.g., 1, 2, 3, 5, 24, 48, 168).
- `title` (String, required): Tier headline (e.g., "1 Hour Quick Session", "2 Hours Duo Pass", "5 Hours Pro").
- `price` (Number, required): Rental cost in ₹ INR.
- `originalPrice` (Number, nullable): Pre-discount price for strikethrough.
- `pricingType` (String, enum: `['hourly', 'multi-hour', 'daily', 'weekly', 'package', 'promotional', 'custom']`).
- `description` (String): Tier notes.
- `badge` (String): Visual tag (e.g., "Save 15%", "Most Popular", "Weekend Special").
- `isPopular` (Boolean): Highlight state.
- `isActive` (Boolean, default: `true`): Availability toggle.
- `displayOrder` (Number): Sort index.
- `createdAt`, `updatedAt` (Timestamps).

### 5. `rentalplans` (Model: `RentalPlan`)
Full PS5 console rental packages (1-Day, 2-Days, 3-Days, 4-Days, 5-Days, 6-Days, 1-Week).
- `name` (String, required): Plan name (e.g., "3-Days Plan").
- `slug` (String, unique, indexed): Plan slug.
- `durationLabel` (String, required): Duration text (e.g., "3 Days").
- `durationHours` (Number, required): Operational rental hours (e.g., 56).
- `price` (Number, required): Rental package fee in ₹ INR.
- `originalPrice` (Number, nullable): Strikethrough comparison price.
- `description` (String): Marketing overview.
- `inclusions` ([String]): List of bundle hardware and features.
- `badge` (String): Badge tag (e.g., "Most Popular", "Best Value").
- `isPopular` (Boolean, default: `false`): Glowing card UI flag.
- `isActive` (Boolean, default: `true`): Visibility state.
- `displayOrder` (Number): Order index.
- `createdAt`, `updatedAt` (Timestamps).

### 6. `websitesettings` (Model: `WebsiteSetting`)
Content management parameters for public site customization.
- `key` (String, unique, default: `'main_settings'`).
- `siteName` (String): "PlayVaultKLB".
- `tagline` (String): "Premium PS5 Rental Services".
- `heroHeading` (String): "YOUR NEXT GAMING SESSION STARTS HERE."
- `heroSubheading` (String): Hero description.
- `heroBadge` (String): "⚡ Ultra-Fast 4K PS5 Gaming • Kalaburagi / KLB".
- `heroBgImage` (String): Hero background image URL.
- `announcementText` (String): Top ticker notification text.
- `announcementActive` (Boolean): Banner visibility toggle.
- `whatsappNumber` (String): "8904004036".
- `whatsappCountryCode` (String): "91".
- `instagramUrl` (String): "https://www.instagram.com/playvaultklb/".
- `instagramHandle` (String): "@playvaultklb".
- `contactPhone` (String): "+91 8904004036".
- `contactEmail` (String): "contact@playvaultklb.com".
- `address` (String): "Kalaburagi (Gulbarga), Karnataka, India".
- `workingHours` (String): "Everyday: 10:00 AM – 11:00 PM (WhatsApp 24/7)".
- `aboutTitle`, `aboutText` (String): About story.
- `termsText`, `privacyText` (String): Legal policies.
- `createdAt`, `updatedAt` (Timestamps).

### 7. `media` (Model: `Media`)
Image assets uploaded to Cloudinary CDN with local disk fallback.
- `title` (String): Asset description.
- `fileName` (String): Original filename.
- `url` (String): Cloudinary secure URL (`https://res.cloudinary.com/...`).
- `publicId` (String): Cloudinary public asset ID.
- `mimeType` (String): `image/jpeg`, `image/png`, etc.
- `size` (Number): File size in bytes.
- `tag` (String, enum: `['game-cover', 'banner', 'logo', 'general']`).
- `uploadedBy` (ObjectId ref: `Admin`).
- `createdAt`, `updatedAt` (Timestamps).

### 8. `adminactivitylogs` (Model: `AdminActivityLog`)
Security audit trail recording all administrative updates.
- `admin` (ObjectId ref: `Admin`).
- `adminName` (String): Username or identity.
- `action` (String): Action identifier (`LOGIN`, `CREATE_GAME`, `UPDATE_PRICING`, etc.).
- `module` (String): Target component (`Auth`, `Games`, `Pricing`, `RentalPlans`, `Settings`, `Media`).
- `details` (String): Human-readable change summary.
- `ipAddress` (String): Origin IP address.
- `createdAt`, `updatedAt` (Timestamps).
