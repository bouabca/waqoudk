# WAQOUDK (وقودك) - Fuel Delivery App

## Tech Stack
- **Frontend:** Next.js 16 + React + TypeScript
- **Styling:** Inline styles with CSS custom properties (design tokens)
- **Database:** SQLite via Prisma 7 ORM
- **Auth:** Cookie-based sessions (httpOnly, secure)
- **Language:** Arabic (RTL layout)
- **Deployment:** Vercel-ready

## Architecture

```
React Component → fetch('/api/*') → Next.js API Route → Prisma → SQLite
```

### Auth Flow
```
Login → Create session token (UUID) → Store in DB → Set httpOnly cookie → Verify on each request
```

## Getting Started

```bash
npm install
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (RTL, Arabic)
│   ├── page.tsx                # Public home page
│   ├── (auth)/                 # Auth pages (login, register, OTP)
│   ├── home/                   # Authenticated home
│   ├── orders/                 # Order list, details, tracking
│   ├── stations/               # Station list, details
│   ├── payment/                # Payment pages
│   ├── pricing/                # Pricing pages
│   ├── notifications/          # Notifications
│   └── api/                    # API routes
│       ├── auth/               # login, register, send-otp, verify-otp, me, logout
│       ├── users/              # CRUD users
│       ├── orders/             # CRUD orders, tracking, payment, pricing
│       └── stations/           # List & detail stations
├── components/
│   ├── Common/                 # Button, Input, Card, Badge, ProgressBar
│   ├── Layout/                 # Header, Footer
│   ├── Auth/                   # LoginForm, RegisterForm, OTPInput, PhoneInput
│   ├── Orders/                 # OrderCard, OrderDetails, OrderTracking, etc.
│   ├── Stations/               # StationCard, StationDetails, StationMap
│   └── Payment/                # PricingBreakdown, PaymentMethod, PriceDisplay
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   └── auth.ts                 # Session management (cookies)
└── app/globals.css              # Design tokens & global styles
```

## Database Schema

- **User** - name, phone, password, accountType, address, avatar
- **Session** - userId, token, expiresAt (cookie-backed auth)
- **Order** - orderNumber, status, pricing, driver info, location
- **Station** - name, location, hours, price, phone, logo

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/login | Login with phone + password |
| POST | /api/auth/register | Create account |
| POST | /api/auth/send-otp | Send verification code |
| POST | /api/auth/verify-otp | Verify OTP (test: 123456) |
| GET | /api/auth/me | Get current user from session |
| POST | /api/auth/logout | Destroy session |
| GET | /api/users | List users |
| GET/POST | /api/orders | List/create orders |
| GET | /api/orders/[id] | Order details |
| GET | /api/orders/[id]/tracking | Tracking info |
| GET | /api/orders/[id]/payment | Payment details |
| GET | /api/orders/[id]/pricing | Pricing breakdown |
| GET | /api/stations | List stations |
| GET | /api/stations/[id] | Station details |

## 12 Screens

| # | Page | Route |
|---|------|-------|
| 1 | Home (Public) | / |
| 2 | Login | /login |
| 3 | Enter Phone | /enter-phone |
| 4 | Verify OTP | /verify-otp |
| 5 | Register | /register |
| 6 | Home (Auth) | /home |
| 7 | Order Details | /orders/[id] |
| 8 | Track Order | /orders/[id]/tracking |
| 9 | Notifications | /notifications |
| 10 | Payment | /payment/[orderId] |
| 11 | Pricing | /pricing/[orderId] |
| 12 | Station Details | /stations/[id] |

## Test Account
- Phone: 0512345678
- Password: 123456
- OTP: 123456 (for testing)
