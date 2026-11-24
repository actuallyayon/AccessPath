# AccessPath - Urban Accessibility & Mobility Platform

AccessPath is a production-grade urban accessibility and mobility platform built to empower wheelchair users, elderly citizens, and people with mobility limitations to explore places and travel across cities with safety, confidence, and dignity.

Unlike standard navigation applications that rank routes purely on travel time or distance, AccessPath ranks and evaluates routes using an **Accessibility Score (0–100)** incorporating sidewalk obstacles, missing curb ramps, staircases, broken elevators, and live community verification.

---

## 🌟 Key Features
- **Accessibility-Aware Routing**: Fetches alternatives using OpenRouteService wheelchair profiles (with OSRM fallback) and evaluates routes using physical barriers, elevator transitions, ramp availability, and stair penalties.
- **Exploration & Filtering**: Search vetted accessible venues by name, address, category, and feature checklists (wheelchairs, ramps, elevators, accessible restrooms).
- **Interactive Clustered Map**: Full Leaflet & marker clustering integration with viewport-bounded spatial querying.
- **Crowdsourced Barrier Reporting**: Capture GPS coordinates, categorize hazards (broken pavements, missing ramps, blocked sidewalks), and submit photographic evidence.
- **Multi-Tier Community Moderation**: Four distinct roles (**Admin**, **Moderator**, **Contributor**, **Regular User**) enforced at the database (PostgreSQL RLS), middleware, and API levels.
- **Administrative Analytics Console**: High-level KPI monitoring, monthly barrier resolution trends, and category breakdowns with Recharts.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router) + React + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Lucide Icons + next-themes (Dark mode support)
- **Database & Auth**: Supabase PostgreSQL with PostGIS, Row-Level Security (RLS), and Supabase Auth
- **Mapping**: Leaflet, React-Leaflet, OpenStreetMap Tiles, Leaflet.markercluster
- **Routing**: OpenRouteService (Wheelchair Profile) + OSRM Pedestrian fallback
- **Charts**: Recharts
- **Validation**: Zod + React Hook Form

---

## 🚀 Quick Setup & Installation

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd AccessPath
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```
Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ORS_API_KEY=your-openrouteservice-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Database Migrations & Seeds
Execute the SQL files in order in your Supabase SQL Editor:
1. `supabase/migrations/20261124000001_initial_schema.sql`
2. `supabase/migrations/20261124000002_functions_and_rpcs.sql`
3. `supabase/migrations/20261124000003_rls_policies.sql`
4. `supabase/migrations/20261124000004_storage_and_categories.sql`
5. `supabase/migrations/20261124000005_analytics_rpcs.sql`
6. Run `supabase/seed.sql` to populate **10,000+ locations, 50,000+ barrier reports, and 100,000+ feedback records**.

To create the 4 demo accounts:
```bash
node scripts/seed-users.mjs
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Role Credentials

All demo accounts share the password: `AccessPassword123!`

| Role | Email | Capabilities |
| :--- | :--- | :--- |
| **Admin** | `admin@accesspath.demo` | Full access, system analytics, user management, global settings |
| **Moderator** | `moderator@accesspath.demo` | Review & approve/reject locations and barrier reports |
| **Contributor** | `contributor@accesspath.demo` | Submit new locations and barriers, view contributions |
| **Regular User** | `user@accesspath.demo` | Search places, plan routes, submit reports & feedback |

---

## 🧪 Running Unit Tests
Execute the pure route accessibility scoring algorithm tests:
```bash
node --strip-types lib/routing/score.test.ts
```

---

## 📚 Documentation
- [docs/DATABASE.md](file:///d:/AccessPath/docs/DATABASE.md) - Database schema & Mermaid ER diagram
- [docs/ROUTE_SCORING.md](file:///d:/AccessPath/docs/ROUTE_SCORING.md) - Mathematical model and worked examples of the scoring algorithm
- [docs/API.md](file:///d:/AccessPath/docs/API.md) - Route handlers & RPC request/response schemas
- [PROGRESS.md](file:///d:/AccessPath/PROGRESS.md) - Project build phases & audit log
