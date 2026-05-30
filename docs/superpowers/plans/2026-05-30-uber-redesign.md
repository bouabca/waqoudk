# Uber-Inspired Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Restyle the entire Wa9odok app from green (#2D7D3B) to Uber-inspired black-and-white design system

**Architecture:** Create a shared `lib/theme.ts` design token file, update `globals.css`, then update all components and pages to reference the theme. All inline styles get replaced with theme references.

**Tech Stack:** React inline styles via JS objects, TypeScript, Next.js

---

### Task 1: Create theme design system file

**Files:**
- Create: `src/lib/theme.ts`

This is the foundation. All other tasks depend on it. Export a single `theme` object with ALL design tokens mapped from the spec:

```typescript
export const theme = {
  colors: {
    primary: '#000000',
    onPrimary: '#ffffff',
    ink: '#000000',
    body: '#5e5e5e',
    mute: '#afafaf',
    hairlineMid: '#4b4b4b',
    canvas: '#ffffff',
    canvasSoft: '#efefef',
    canvasSofter: '#f3f3f3',
    surfacePressed: '#e2e2e2',
    onDark: '#ffffff',
    blackElevated: '#282828',
    link: '#0000ee',
    success: '#2D7D3B',
    error: '#D32F2F',
    warning: '#FFA000',
  },
  spacing: {
    xxs: '4px', xs: '6px', sm: '8px', md: '12px', lg: '16px', xl: '20px', '2xl': '24px', '3xl': '32px',
  },
  rounded: {
    none: '0px', md: '8px', lg: '12px', xl: '16px', pill: '999px', pillTab: '36px', full: '9999px',
  },
  typography: {
    displayXxl: { fontFamily: 'UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '52px', fontWeight: 700, lineHeight: '64px' },
    displayXl: { fontFamily: 'UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '36px', fontWeight: 700, lineHeight: '44px' },
    displayLg: { fontFamily: 'UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '32px', fontWeight: 700, lineHeight: '40px' },
    displayMd: { fontFamily: 'UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '24px', fontWeight: 700, lineHeight: '32px' },
    displaySm: { fontFamily: 'UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '20px', fontWeight: 700, lineHeight: '28px' },
    bodyLg: { fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '18px', fontWeight: 500, lineHeight: '24px' },
    bodyMd: { fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '24px' },
    bodyMdStrong: { fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '16px', fontWeight: 500, lineHeight: '20px' },
    bodySm: { fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '14px', fontWeight: 400, lineHeight: '20px' },
    bodySmStrong: { fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '16px' },
    caption: { fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '12px', fontWeight: 400, lineHeight: '20px' },
    buttonLarge: { fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '18px', fontWeight: 500, lineHeight: '24px' },
    buttonMd: { fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '16px', fontWeight: 500, lineHeight: '20px' },
  },
  shadow: {
    level1: 'rgba(0,0,0,0.12) 0px 4px 16px 0px',
    level2: 'rgba(0,0,0,0.16) 0px 4px 16px 0px',
    level3: 'rgba(0,0,0,0.16) 0px 2px 8px 0px',
  },
  // Component presets
  buttonPrimary: { backgroundColor: '#000000', color: '#ffffff', borderRadius: '999px', padding: '12px 12px', fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '16px', fontWeight: 500, lineHeight: '20px', border: 'none', cursor: 'pointer' },
  buttonSecondary: { backgroundColor: '#ffffff', color: '#000000', borderRadius: '999px', padding: '12px 12px', fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '16px', fontWeight: 500, lineHeight: '20px', border: 'none', cursor: 'pointer' },
  buttonSubtle: { backgroundColor: '#efefef', color: '#000000', borderRadius: '999px', padding: '12px 20px', fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '16px', fontWeight: 500, lineHeight: '20px', border: 'none', cursor: 'pointer' },
  buttonLargeRounded: { backgroundColor: '#000000', color: '#ffffff', borderRadius: '16px', padding: '16px 20px', fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '18px', fontWeight: 500, lineHeight: '24px', border: 'none', cursor: 'pointer' },
  cardContent: { backgroundColor: '#ffffff', color: '#000000', borderRadius: '16px', padding: '24px' },
  cardElevated: { backgroundColor: '#ffffff', color: '#000000', borderRadius: '16px', padding: '24px', boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px 0px' },
  cardSoftTinted: { backgroundColor: '#efefef', color: '#000000', borderRadius: '16px', padding: '24px' },
  textInput: { backgroundColor: '#efefef', color: '#000000', borderRadius: '8px', padding: '16px', fontFamily: 'UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '24px', border: 'none', outline: 'none', width: '100%', boxSizing: 'border-box' as const },
  container: { maxWidth: 430, margin: '0 auto', backgroundColor: '#ffffff', minHeight: '100vh', direction: 'rtl' as const },
  // Status colors for badges
  status: {
    pending: '#FFA000',
    in_progress: '#000000',
    completed: '#2D7D3B',
    cancelled: '#757575',
    approved: '#000000',
  },
}
```

### Task 2: Update globals.css

**Files:**
- Modify: `src/app/globals.css`

Replace with Uber-inspired base styles, import Uber font equivalents.

### Task 3: Update Common components (Button, Card, Input, Badge, ProgressBar)

**Files:**
- Modify: `src/components/Common/Button.tsx`
- Modify: `src/components/Common/Card.tsx`
- Modify: `src/components/Common/Input.tsx`
- Modify: `src/components/Common/Badge.tsx`
- Modify: `src/components/Common/ProgressBar.tsx`

Replace all inline style values with references to `theme` object. Button uses pill shape. Card uses `rounded.xl` (16px). Input uses canvas-soft background.

### Task 4: Update root layout

**Files:**
- Modify: `src/app/layout.tsx`

Add UberMove font import. Remove Tailwind import.

### Task 5: Update auth pages (login, register, enter-phone, verify-otp)

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/register/page.tsx`
- Modify: `src/app/(auth)/enter-phone/page.tsx`
- Modify: `src/app/(auth)/verify-otp/page.tsx`

Replace green (#2D7D3B) with black (#000000). Use pill-shaped buttons. Use theme typography. Use card containers.

### Task 6: Update homepage and landing page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/home/page.tsx`

### Task 7: Update orders pages

**Files:**
- Modify: `src/app/orders/page.tsx`
- Modify: `src/app/orders/[id]/page.tsx`
- Modify: `src/app/orders/[id]/tracking/page.tsx`

### Task 8: Update stations pages

**Files:**
- Modify: `src/app/stations/page.tsx`
- Modify: `src/app/stations/[id]/page.tsx`

### Task 9: Update pricing and payment pages

**Files:**
- Modify: `src/app/pricing/page.tsx`
- Modify: `src/app/pricing/[orderId]/page.tsx`
- Modify: `src/app/payment/page.tsx`
- Modify: `src/app/payment/[orderId]/page.tsx`

### Task 10: Update request-fuel page

**Files:**
- Modify: `src/app/request-fuel/page.tsx`

### Task 11: Update driver and notifications pages

**Files:**
- Modify: `src/app/driver/page.tsx`
- Modify: `src/app/notifications/page.tsx`

### Task 12: Update Layout components

**Files:**
- Modify: `src/components/Layout/Header.tsx`
- Modify: `src/components/Layout/Footer.tsx`
- Modify: `src/app/(auth)/layout.tsx`

### Task 13: Build verification

**Files:**
- Build project: `npx next build`
