# Septic-Tank Nepal / Drain Expert Nepal - Production Web Application

A full-stack, responsive web application and management system built precisely to the specifications of **Stitch Design ID: `6331258395746209641`**.

---

## 🚀 Technology Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with exact design tokens from Google Stitch
- **Icons & Typography**: Material Symbols Outlined, Google Fonts Inter
- **API Client**: Strongly-typed native fetch client with localStorage Bearer token authentication

### Backend
- **Framework**: [Laravel 11 / 12](https://laravel.com/) (PHP 8.3)
- **Authentication**: Laravel Sanctum API token authentication
- **Database**: MySQL 8.x (`septic_tank_nepal`) with Eloquent ORM, foreign keys, and indexes
- **Architecture**: Clean Service-Repository & RESTful Controller Pattern

---

## 🎨 Stitch Design System Specifications

| Token | Value | Description |
| :--- | :--- | :--- |
| **Primary** | `#000513` | Deep Navy (Navbar brand, footers, headers) |
| **Primary Container** | `#0b1e3b` | Dark Slate Blue (Primary CTA buttons, service cards) |
| **Secondary** | `#a04100` | Deep Rust / Amber (Emergency call badges, highlights) |
| **Secondary Container** | `#fe6b00` | Safety Vibrant Orange (Accent buttons, active states) |
| **WhatsApp Brand** | `#25D366` | Official WhatsApp green |
| **Surface Background** | `#fcf9f8` | Clean warm neutral canvas |
| **Surface Containers** | `#f6f3f2` / `#f0eded` | Section tiers, card surfaces, and bento cards |
| **Typography** | `Inter` | Clean sans-serif with strong optical weights |

---

## 📁 Repository Structure

```
ganeshseptictank/
├── backend/                  # Laravel 11/12 REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php        # Admin login / logout / me
│   │   │   ├── CompanyController.php     # Company details & contact settings
│   │   │   ├── ServiceController.php     # Public & Admin Services CRUD
│   │   │   ├── BlogController.php        # Public & Admin Blogs CRUD
│   │   │   ├── ContactController.php     # Customer submissions & inquiry inbox
│   │   │   ├── StatsController.php       # Dashboard metrics & KPIs
│   │   │   ├── TestimonialController.php # Customer reviews
│   │   │   └── UploadController.php      # Image media uploader
│   │   ├── Models/                       # Eloquent models & relations
│   │   └── Providers/
│   ├── config/cors.php                   # Configured CORS for Next.js frontend
│   ├── database/
│   │   ├── migrations/                   # Database schema migrations
│   │   └── seeders/DatabaseSeeder.php    # Realistic seed data from Stitch screens
│   └── routes/api.php                    # REST API routing definition
│
├── frontend/                 # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                  # Home Page (Hero, Bento, Services, Why Us, WhatsApp CTA)
│   │   │   ├── services/page.tsx         # Services Catalog Page
│   │   │   ├── services/[slug]/page.tsx  # Service Detail (FAQs Accordion, Video, Sidebar)
│   │   │   ├── blog/page.tsx             # Blog List (Search, Category filter, Pagination)
│   │   │   ├── blog/[slug]/page.tsx      # Blog Detail (Prose article, Emergency CTA)
│   │   │   ├── contact/page.tsx          # Contact Us (Interactive Form, Maps, Direct info)
│   │   │   └── admin/
│   │   │       ├── login/page.tsx        # Admin Authentication Screen
│   │   │       ├── page.tsx              # Admin Dashboard & Inquiry inbox
│   │   │       ├── services/             # Manage Services & Create/Edit forms
│   │   │       ├── blogs/                # Manage Blog Posts & Create/Edit forms
│   │   │       └── company/page.tsx      # Company Settings & Phone editor
│   │   ├── components/
│   │   │   ├── layout/                   # Navbar, MobileNav, Footer, FloatingButtons, Admin
│   │   │   ├── cards/                    # ServiceCard, BlogCard, TestimonialCard, Bento
│   │   │   ├── sections/                 # Hero, WhereWeWork, WhyChooseUs, WhatsAppCTA, FAQs
│   │   │   ├── forms/                    # ContactForm with validation
│   │   │   └── ui/                       # LoadingSpinner, Pagination, Alerts
│   │   ├── lib/api.ts                    # Strong typed REST client with Bearer auth
│   │   ├── services/                     # Domain API services
│   │   └── types/index.ts                # TypeScript interfaces
│   └── public/                           # Static assets
└── README.md
```

---

## ⚙️ Getting Started & Installation

### 1. Prerequisites
- **Node.js**: v18.x or v20.x+
- **PHP**: >= 8.2 (with PDO, OpenSSL, Mbstring, cURL extensions enabled)
- **Composer**: >= 2.x
- **MySQL**: 8.x / MariaDB running locally (e.g. WAMP, XAMPP, or Native MySQL)

---

### 2. Backend Setup (Laravel REST API)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Ensure dependencies are installed:
   ```bash
   composer install
   ```
3. Verify your `.env` configuration:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=septic_tank_nepal
   DB_USERNAME=root
   DB_PASSWORD=
   ```
4. Run migrations and populate seeded data:
   ```bash
   php artisan migrate:fresh --seed
   ```
5. Start the Laravel development server on port 8000:
   ```bash
   php artisan serve --port=8000
   ```

---

### 3. Frontend Setup (Next.js Application)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Ensure dependencies are installed:
   ```bash
   npm install
   ```
3. Check `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your browser at [http://localhost:3000](http://localhost:3000).

---

## 🔑 Default Admin Credentials

To access the Admin Management Portal:
- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@drainexpert.com`
- **Password**: `password123`

---

## 🌐 Public Routes

- `/` — Home Landing Page (Bento Grid, Emergency CTAs, Testimonials)
- `/services` — All Services Catalog & Service Coverage map
- `/services/[slug]` — Individual Service Detail with embedded video & FAQ Accordion
- `/blog` — Plumbing & Drainage Articles, Search & Category filters
- `/blog/[slug]` — Full Article view with sidebar emergency CTA
- `/contact` — Direct Phone/WhatsApp, Interactive Booking Form, and Google Maps Location

---

## 🛡️ Admin Features

- **Dashboard**: Real-time KPI counts and Customer Inquiries table with 1-click status updates
- **Services Management**: Full CRUD for services, video URLs, cover images, and interactive FAQ builders
- **Blogs Management**: Full CRUD for articles, category selection, hero promotion, and publication dates
- **Company Settings**: Update emergency phone numbers, WhatsApp numbers, workshop address, coordinates, and logo in real-time
- **Media Upload**: Built-in multipart file upload endpoint returning public URLs
