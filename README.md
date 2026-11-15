# PLAYVAULTKLB – Complete PS5 Rental Management Platform

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20Express-purple.svg)](https://playvaultklb.com)
[![Platform](https://img.shields.io/badge/Platform-PlayStation%205-003791.svg)](https://playvaultklb.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas%20%2F%20Local-13aa52.svg)](https://mongodb.com)
[![Media](https://img.shields.io/badge/Media-Cloudinary%20CDN-3448c5.svg)](https://cloudinary.com)
[![WhatsApp Booking](https://img.shields.io/badge/Booking-Direct%20WhatsApp-25D366.svg)](https://wa.me/918904004036)

> **PlayVaultKLB** is a production-ready, full-stack PlayStation 5 rental business platform designed specifically for Kalaburagi (Gulbarga), Karnataka. Built from the ground up with a cinematic gaming aesthetic, flexible per-game pricing engine, full CMS administration, Cloudinary media CDN, and seamless direct WhatsApp booking integration.

---

## 🎮 Table of Contents
- [1. Business Overview & Brand Identity](#1-business-overview--brand-identity)
- [2. Technology Stack](#2-technology-stack)
- [3. Project Architecture & Structure](#3-project-architecture--structure)
- [4. Database Design (MongoDB & Mongoose)](#4-database-design-mongodb--mongoose)
- [5. Advanced Game Pricing Engine](#5-advanced-game-pricing-engine)
- [6. WhatsApp & Instagram Integration](#6-whatsapp--instagram-integration)
- [7. Admin Dashboard & Backoffice](#7-admin-dashboard--backoffice)
- [8. Installation & Setup Guide](#8-installation--setup-guide)
- [9. Database Seeding](#9-database-seeding)
- [10. Running the Application](#10-running-the-application)
- [11. API Specification](#11-api-specification)
- [12. Production Deployment Guide](#12-production-deployment-guide)

---

## 1. Business Overview & Brand Identity

- **Brand:** PlayVaultKLB
- **Tagline:** Premium PS5 Console & Games Rental Services
- **Service Area:** Kalaburagi (Gulbarga), Karnataka, India
- **Official WhatsApp:** `+91 8904004036` (`https://wa.me/918904004036`)
- **Official Email:** `Playvaultklb@gmail.com` (`mailto:Playvaultklb@gmail.com`)
- **Official Instagram:** `@playvaultklb` (`https://www.instagram.com/playvaultklb/`)
- **Google Maps Location:** [View Hub on Google Maps](https://www.google.com/maps/place/17%C2%B017'53.7%22N+76%C2%B049'49.0%22E/@17.2983117,76.829671,19z/data=!4m4!3m3!8m2!3d17.29825!4d76.8302778?hl=en&entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D)
- **Design Aesthetic:** Deep space black (`#07050e`), dark violet cards (`#130f26`), neon purple (`#a855f7`) and electric blue accents, cinematic PlayStation typography (`Rajdhani` & `Inter`).
- **Core Business Model:** Frictionless console rental without upfront purchase. Doorstep delivery, complete TV setup, sanitized DualSense controllers, and 24/7 on-call WhatsApp support.

---

## 2. Technology Stack

### Frontend
- **Framework:** React.js 18 with Vite
- **Styling:** Tailwind CSS (Dark Cyber-PlayStation theme)
- **Routing:** React Router v7 (`react-router-dom`)
- **HTTP Client:** Axios with centralized interceptors & token injection
- **Icons:** Lucide React
- **Animations:** CSS3 hardware-accelerated transitions & Framer Motion ready

### Backend
- **Runtime:** Node.js (v24 LTS compatible)
- **Framework:** Express.js REST API
- **Database ODM:** Mongoose v8
- **Authentication:** JWT (JSON Web Tokens) with 7-day expiry
- **Password Security:** `bcryptjs` (salt factor 10) with pre-save Mongoose hook
- **Security Middlewares:** Helmet (cross-origin resource policies), CORS, Express Rate Limit
- **Media Uploads:** Multer with direct Cloudinary CDN upload (`dm72fqsjz`) and local disk backup
- **Audit Logging:** Database-backed `AdminActivityLog` recording all administrative mutations

### Database
- **Database:** MongoDB (Local instance at `mongodb://127.0.0.1:27017/playvault` or MongoDB Atlas cloud cluster)
- **Models:** 8 distinct collections (`Admins`, `Games`, `GameCategories`, `GamePricings`, `RentalPlans`, `WebsiteSettings`, `Media`, `AdminActivityLogs`)

---

## 3. Project Architecture & Structure

```
playvault/
├── backend/
│   ├── config/
│   │   └── db.js                 # Centralized MongoDB connection & fallback handler
│   ├── controllers/
│   │   ├── authController.js     # Admin login, profile, password change
│   │   ├── categoryController.js # Category CRUD
│   │   ├── dashboardController.js# KPI metrics & activity logs
│   │   ├── gameController.js     # Game catalog CRUD & auto-tier generation
│   │   ├── mediaController.js    # Cloudinary image upload & deletion
│   │   ├── pricingController.js  # Advanced game-specific pricing engine
│   │   ├── rentalPlanController.js# 7 official rental packages CRUD
│   │   └── settingController.js  # Website CMS settings
│   ├── middleware/
│   │   ├── activityLogger.js     # Automatic audit logging
│   │   ├── auth.js               # JWT Bearer token verification
│   │   ├── errorHandler.js       # Centralized JSON error handler
│   │   └── upload.js             # Multer image upload filter
│   ├── models/
│   │   ├── Admin.js
│   │   ├── AdminActivityLog.js
│   │   ├── Game.js
│   │   ├── GameCategory.js
│   │   ├── GamePricing.js
│   │   ├── Media.js
│   │   ├── RentalPlan.js
│   │   └── WebsiteSetting.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── gameRoutes.js
│   │   ├── mediaRoutes.js
│   │   ├── pricingRoutes.js
│   │   ├── rentalPlanRoutes.js
│   │   └── settingRoutes.js
│   ├── utils/
│   │   └── seedData.js           # Full initial database seeder
│   ├── uploads/                  # Temporary image storage
│   ├── .env                      # Production/dev environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server & static frontend serving
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminLayout.jsx       # 11-module sidebar & header
│   │   │   ├── common/
│   │   │   │   └── ProtectedRoute.jsx    # Client-side JWT auth guard
│   │   │   └── public/
│   │   │       ├── AboutUs.jsx
│   │   │       ├── ContactSection.jsx    # WhatsApp inquiry builder
│   │   │       ├── Features.jsx          # Business highlights
│   │   │       ├── Footer.jsx            # Links & terms/privacy modals
│   │   │       ├── GamePricingModal.jsx  # Interactive duration selector
│   │   │       ├── GamesCatalogue.jsx    # Dynamic game cards & search
│   │   │       ├── Hero.jsx              # Cinematic hero section
│   │   │       ├── HowItWorks.jsx        # 5-step roadmap
│   │   │       ├── Navbar.jsx            # Sticky navbar & mobile drawer
│   │   │       └── RentalPlans.jsx       # 7 dynamic rental packages
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Global admin state & token handling
│   │   │   └── WebsiteContext.jsx        # Live settings & WhatsApp phone
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── ActivityLogs.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminProfile.jsx
│   │   │   │   ├── ContactSettings.jsx
│   │   │   │   ├── GameCategories.jsx
│   │   │   │   ├── ManageGames.jsx
│   │   │   │   ├── ManageRentalPlans.jsx
│   │   │   │   ├── MediaLibrary.jsx      # Cloudinary asset browser
│   │   │   │   ├── RentalPricing.jsx     # Pricing Engine manager
│   │   │   │   ├── SocialSettings.jsx
│   │   │   │   └── WebsiteContent.jsx    # Content CMS
│   │   │   └── public/
│   │   │       └── HomePage.jsx          # Public landing experience
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance with interceptors
│   │   ├── utils/
│   │   │   └── whatsapp.js               # Centralized URL-encoded WhatsApp generator
│   │   ├── App.jsx                       # Master client routes
│   │   ├── index.css                     # Tailwind directives & styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js                    # Proxy config to port 5000
├── .env.example                          # Root environment template
└── README.md
```

---

## 4. Database Design (MongoDB & Mongoose)

All data is structured into 8 collections with optimized indexing:
1. `admins`: Stores system administrators with bcrypt hashes.
2. `games`: PS5 video games with cover art, genres, tags, availability.
3. `gamecategories`: Dynamic game genres (Action, Sports, Racing, Fighting, etc.).
4. `gamepricings`: Duration pricing tiers per game (1h, 2h, 3h, 5h, full day, custom).
5. `rentalplans`: The 7 business rental plans (1-Day, 2-Days, 3-Days, 4-Days, 5-Days, 6-Days, 1-Week).
6. `websitesettings`: CMS for titles, hero text, WhatsApp number, Instagram URL.
7. `media`: Images uploaded to Cloudinary CDN with public IDs.
8. `adminactivitylogs`: Immutable audit trail of every administrative change.

---

## 5. Advanced Game Pricing Engine

Unlike basic rental sites that assume flat pricing across all games, **PlayVaultKLB implements an advanced, game-specific pricing engine**:
- Administrators can independently set hourly, multi-hour, full-day, and weekend rates for each specific title.
- For example:
  - **GTA V:** 1 Hour = ₹50, 2 Hours = ₹90, 3 Hours = ₹130, 5 Hours = ₹200, 24 Hours = ₹350
  - **FIFA / EA Sports FC 24:** 1 Hour = ₹40, 2 Hours = ₹75, 3 Hours = ₹110, 5 Hours = ₹170, 24 Hours = ₹300
  - **God of War Ragnarök:** 1 Hour = ₹60, 2 Hours = ₹110, 3 Hours = ₹160, 5 Hours = ₹250, 24 Hours = ₹400
- Individual pricing tiers can be toggled on/off, given discount badges ("Save 15%", "Most Popular"), or marked as promotional.
- The public website's **Interactive Pricing Modal** reads these tiers in real-time. When a customer taps a duration, the WhatsApp booking button instantly updates with the calculated rate!

---

## 6. WhatsApp & Instagram Integration

### WhatsApp Booking Architecture (Zero-Checkout, Instant Confirmation)
No clunky payment gateways or registration walls. Every booking button generates a fully URL-encoded WhatsApp link targeted to `8904004036` (`+918904004036`):

1. **Game Card / Pricing Modal Click:**
   ```
   https://wa.me/918904004036?text=Hello%20PlayVaultKLB!%20%F0%9F%8E%AE%0A%0AI%20would%20like%20to%20book%20a%20PS5%20console%20rental%20with%20the%20following%20game%3A%0A%F0%9F%94%B9%20Game%3A%20Grand%20Theft%20Auto%20V%0A%E2%9A%A1%20Platform%3A%20PS5%0A%E2%8F%B1%EF%B8%8F%20Duration%3A%203%20Hours%20Heist%20Marathon%0A%F0%9F%92%B0%20Price%3A%20%E2%82%B9130%0A%0APlease%20confirm%20console%20availability%20and%20delivery%20details.
   ```
2. **Rental Plan Card Click:**
   ```
   https://wa.me/918904004036?text=Hello%20PlayVaultKLB!%20%F0%9F%8E%AE%0A%0AI%20am%20interested%20in%20booking%20the%20following%20PS5%20Rental%20Plan%3A%0A%F0%9F%93%A6%20Plan%3A%203-Days%20Plan%20(3%20Days%20%2F%2056%20hrs)%0A%F0%9F%92%B0%20Price%3A%20%E2%82%B91799%0A%0APlease%20confirm%20console%20availability%20and%20delivery%20schedule%20for%20Kalaburagi.
   ```
3. **Interactive Booking Request Form:**
   Allows customers in Kalaburagi to type their name, preferred game, address/landmark, and extra controller needs, opening WhatsApp with their pre-formatted inquiry.

### Instagram Integration
- Direct link to official profile: `https://www.instagram.com/playvaultklb/`
- Rendered in Navigation bar, Contact section, and Footer with `target="_blank" rel="noopener noreferrer"`.
- Editable through **Social Media Settings** in the Admin panel.

---

## 7. Admin Dashboard & Backoffice

- **Admin Login URL:** `http://localhost:5000/admin/login` (or `/admin/login` on port 5173)
- **Default Seed Credentials:**
  - **Email:** `admin@playvaultklb.com`
  - **Username:** `admin`
  - **Password:** `PlayVault@2025!`
- **Sidebar Modules:**
  1. **Dashboard:** Live KPI statistics, recent activity logs, quick game status.
  2. **Manage Games:** Full CRUD, cover artwork, availability toggle, soft delete.
  3. **Game Categories:** Add/edit/order game categories.
  4. **Rental Pricing:** Configure game-specific tiered duration rates.
  5. **Rental Plans:** Manage the 7 official business packages and custom event plans.
  6. **Website Content:** CMS for hero headline, announcement ticker, about story, terms, privacy.
  7. **Media Library:** Direct Cloudinary CDN upload, asset viewer, copy URL to clipboard.
  8. **Contact Settings:** Edit WhatsApp number, country code, contact phone, and address.
  9. **Social Media:** Edit Instagram link and social profiles.
  10. **Admin Profile:** Change display name, email, avatar, and password.
  11. **Security & Logs:** Tamper-evident audit trail of all administrative events.
  12. **Sign Out:** Secure session destruction.

---

## 8. Installation & Setup Guide

### Prerequisites
- Node.js (v18.x or v20.x or v24.x)
- npm (v9+ or v10+)
- MongoDB (Local daemon running on `localhost:27017` OR MongoDB Atlas connection string)

### Step 1: Clone or Navigate to Project
```bash
cd /home/jass/Desktop/playvault
```

### Step 2: Configure Environment Variables
Verify or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/playvault
JWT_SECRET=playvault_super_secure_jwt_secret_key_982348234
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# Cloudinary CDN Configuration
CLOUDINARY_CLOUD_NAME=dm72fqsjz
CLOUDINARY_API_KEY=229787286928923
CLOUDINARY_API_SECRET=0L19baqDx8RUD0WBh-IAhujNv0Q
```

### Step 3: Install Dependencies
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

---

## 9. Database Seeding

Populate the database with the initial administrator account, the 7 official rental plans, 8 blockbuster games with custom pricing tiers, categories, and business settings:

```bash
cd /home/jass/Desktop/playvault/backend
npm run seed
```

**Seed Output:**
```
[Seed] Connected to database: playvault
[Seed] Clearing existing collections...
[Seed] Creating default administrator account...
[Seed] Admin created: admin@playvaultklb.com (Username: admin)
[Seed] Creating game categories...
[Seed] Seeding the 7 official PlayVaultKLB rental plans...
[Seed] Successfully seeded 7 official rental plans.
[Seed] Seeding games and custom pricing configurations...
[Seed] Seeded 8 games with detailed pricing tiers.
[Seed] Seeding website settings & business parameters...
[Seed] Website settings initialized.
==================================================
✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!
Default Admin Credentials:
Email:    admin@playvaultklb.com
Username: admin
Password: PlayVault@2025!
==================================================
```

---

## 10. Running the Application

### Development Mode (Concurrent Vite + Express)
Run both backend and frontend development servers:

**Terminal 1 (Backend API):**
```bash
cd /home/jass/Desktop/playvault/backend
npm run dev
# Starts on http://localhost:5000
```

**Terminal 2 (Frontend with Hot Reload):**
```bash
cd /home/jass/Desktop/playvault/frontend
npm run dev
# Starts on http://localhost:5173
```

### Production Mode (Single Port Unified Serving)
Build the frontend and serve both the React client and REST API from Node.js on port 5000:

```bash
# 1. Build the frontend
cd /home/jass/Desktop/playvault/frontend
npm run build

# 2. Start the production backend server
cd ../backend
npm start
```
Now open **`http://localhost:5000`** in any browser. Express will automatically serve the built React application at `/` and the admin panel at `/admin/login`, with all `/api` endpoints connected to MongoDB!

---

## 11. API Specification

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Service uptime and health status | Public |
| `POST` | `/api/auth/login` | Administrator authentication | Public |
| `GET` | `/api/auth/me` | Fetch active session admin details | Private (Admin) |
| `PUT` | `/api/auth/profile` | Update admin full name/email | Private (Admin) |
| `PUT` | `/api/auth/change-password` | Update admin password | Private (Admin) |
| `GET` | `/api/games` | Filtered games catalog with pricing tiers | Public |
| `GET` | `/api/games/:id` | Single game details with active rates | Public |
| `GET` | `/api/admin/games` | Full game inventory with pagination | Private (Admin) |
| `POST` | `/api/admin/games` | Create new game & auto-generate tiers | Private (Admin) |
| `PUT` | `/api/admin/games/:id` | Update game fields & availability | Private (Admin) |
| `DELETE` | `/api/admin/games/:id` | Soft-delete or permanent delete game | Private (Admin) |
| `GET` | `/api/categories` | Active category filters | Public |
| `GET` | `/api/admin/categories` | Categories with game count | Private (Admin) |
| `POST` | `/api/admin/categories` | Create category | Private (Admin) |
| `PUT` | `/api/admin/categories/:id` | Update category | Private (Admin) |
| `DELETE` | `/api/admin/categories/:id` | Delete category (checks dependencies) | Private (Admin) |
| `GET` | `/api/pricing/game/:id` | Pricing tiers for specific game | Public |
| `GET` | `/api/admin/pricing` | All pricing tiers | Private (Admin) |
| `POST` | `/api/admin/pricing` | Create pricing tier | Private (Admin) |
| `PUT` | `/api/admin/pricing/:id` | Update pricing tier rate or status | Private (Admin) |
| `DELETE` | `/api/admin/pricing/:id` | Remove pricing tier | Private (Admin) |
| `GET` | `/api/rental-plans` | Active rental plans | Public |
| `GET` | `/api/admin/rental-plans`| All rental plans | Private (Admin) |
| `POST` | `/api/admin/rental-plans`| Create rental plan | Private (Admin) |
| `PUT` | `/api/admin/rental-plans/:id`| Update rental plan details | Private (Admin) |
| `DELETE` | `/api/admin/rental-plans/:id`| Delete rental plan | Private (Admin) |
| `GET` | `/api/settings` | Public website content & contact info | Public |
| `GET` | `/api/admin/settings` | Admin CMS settings | Private (Admin) |
| `PUT` | `/api/admin/settings` | Update website content & contacts | Private (Admin) |
| `POST` | `/api/admin/media/upload`| Upload image to Cloudinary CDN | Private (Admin) |
| `GET` | `/api/admin/media` | List media assets | Private (Admin) |
| `DELETE` | `/api/admin/media/:id` | Delete asset from Cloudinary & DB | Private (Admin) |
| `GET` | `/api/admin/dashboard` | KPI analytics & metrics | Private (Admin) |
| `GET` | `/api/admin/dashboard/logs`| Security audit logs | Private (Admin) |

---

## 12. Production Deployment Guide

### Deployment with PM2 on Ubuntu/Debian Linux Server

1. **Install Node.js & PM2:**
   ```bash
   sudo apt update && sudo apt install -y curl
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

2. **Build and Start with PM2:**
   ```bash
   cd /home/jass/Desktop/playvault/frontend
   npm install && npm run build

   cd ../backend
   npm install
   pm2 start server.js --name "playvault-api"
   pm2 save
   pm2 startup
   ```

3. **Nginx Reverse Proxy Configuration (`/etc/nginx/sites-available/playvault`):**
   ```nginx
   server {
       listen 80;
       server_name playvaultklb.com www.playvaultklb.com;

       client_max_body_size 10M;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **SSL with Let's Encrypt:**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d playvaultklb.com -d www.playvaultklb.com
   ```

---

## 💎 PlayVaultKLB Verification Checklist

- [x] Full-stack architecture separated cleanly (`frontend/`, `backend/`).
- [x] Node.js Express REST API connected to MongoDB via Mongoose v8.
- [x] Cloudinary CDN configured with cloud name `dm72fqsjz`.
- [x] JWT authentication and bcrypt password hashing.
- [x] Initial seed script populated with 7 business plans, 8 games, categories, and settings.
- [x] Advanced Game-Specific Rental Pricing Engine with dynamic tier selection.
- [x] Zero-checkout WhatsApp booking redirect with custom URL-encoded messages.
- [x] Instagram integration with official link `https://www.instagram.com/playvaultklb/`.
- [x] Admin Panel with 11 functional modules and security audit trail.
- [x] Responsive layout tested for mobile, tablet, and desktop.
- [x] Complete production build passing with 0 errors.
