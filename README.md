![Uploading threadcraft-drab.vercel.app_en (9).png…]()

# Hoodify — Custom Streetwear E-Commerce Platform

A full-stack e-commerce web application for custom hoodie and streetwear design, ordering, and management. Built with Next.js 15, React 19, and a modern serverless stack.

## Features

- **Custom Design Studio** — Upload and preview custom designs on products using Fabric.js
- **Product Catalog & Shop** — Browse products with variants, filtering, and detailed product pages
- **Cart & Checkout** — Persistent cart with Redux state management, synced to the database
- **Order Management** — Full order lifecycle: create, update, and track orders
- **Admin Dashboard** — Manage products, orders, and users with a dedicated admin panel
- **Authentication** — Secure auth via Kinde with role-based access (user / admin)
- **Internationalization** — Full i18n support for English and Arabic (RTL) via next-intl
- **Image Uploads** — Cloudinary integration for product and design image management

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| State | Redux Toolkit |
| Database | Neon (PostgreSQL, serverless) |
| ORM | Drizzle ORM |
| Auth | Kinde Auth |
| Storage | Cloudinary |
| i18n | next-intl |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database
- A [Kinde](https://kinde.com) application
- A [Cloudinary](https://cloudinary.com) account

### Installation

```bash
git clone https://github.com/<your-username>/hoodify-season-2.git
cd hoodify-season-2
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### Database Setup

```bash
npm run db:generate
npm run db:migrate
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── [locale]/         # Localized routes (en / ar)
│   ├── (user)/       # Customer-facing pages (shop, cart, profile)
│   └── admin/        # Admin dashboard
├── api/              # API route handlers
└── studio/           # Design studio

components/           # Reusable UI components
db/                   # Drizzle schema and migrations
lib/
├── actions/          # Server actions
├── features/         # Redux slices (cart, products)
└── hooks/            # Custom React hooks
messages/             # i18n translation files (en, ar)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations to the database |

## License

MIT
