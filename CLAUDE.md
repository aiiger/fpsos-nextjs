# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FPsOS Website** - Professional CS2 optimization services website built with Next.js 14, featuring a Bloomberg-inspired void black theme with glassmorphism and animated gradient orbs.

**Primary Directory:** `Y:\fpsos-nextjs`

**Live Domain:** fpsos.gg (deployed on Vercel)

## Development Commands

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### Build for Production
```bash
npm run build
# Creates static export in out/ folder
```

### Start Production Server
```bash
npm start
```

### Lint
```bash
npm run lint
```

### Deploy to Vercel
```bash
# Via CLI
vercel --prod

# Or push to GitHub main branch for auto-deployment
git push origin main
```

## Architecture

### Project Structure

```
fpsos-nextjs/
├── app/
│   ├── layout.tsx          # Root layout (Navigation + Footer)
│   ├── globals.css         # Bloomberg void theme + animations
│   ├── page.tsx            # Homepage - "FRAME UP!" hero + features
│   ├── packages/
│   │   └── page.tsx        # Service tiers with Calendly integration
│   ├── diagnostic/
│   │   └── page.tsx        # Browser diagnostic + PowerShell tool download
│   └── terms/
│       └── page.tsx        # Terms & Conditions
├── public/                 # Static assets
├── next.config.js          # Static export configuration
├── tsconfig.json           # TypeScript config with @ path alias
└── package.json
```

### Next.js Configuration

- **App Router**: Uses Next.js 14 App Router (not Pages Router)
- **Static Export**: Configured for static site generation (`output: 'export'`)
- **Image Optimization**: Disabled for static export (`images.unoptimized: true`)
- **Path Aliases**: `@/*` maps to root directory

### Component Architecture

**Server Components by default**, use `'use client'` for:
- Interactive elements (onClick, onMouseEnter, etc.)
- React hooks (useState, useEffect, etc.)
- Browser APIs (window, document, etc.)

Currently client components:
- `app/page.tsx` - Interactive FeatureCard hover effects
- `app/diagnostic/page.tsx` - Diagnostic tool with state management

**Shared Layout Components** (in `app/layout.tsx`):
- `Navigation` - Fixed glassmorphic header with routes
- `Footer` - Grid layout with links and social media

### Styling Architecture

**CSS-in-JS + CSS Modules approach:**
- Global styles: `app/globals.css` (theme, animations, utilities)
- Component styles: Inline `style` objects in TSX
- Utility classes: `.glass-card`, `.glow-*`, `.btn-*`, `.section`, `.container`

**No Tailwind CSS** - Uses custom CSS variables and inline styles.

## Brand Identity

### Colors (CSS Variables in globals.css)

```css
/* Background Layers */
--bg-void: #000000;           /* Pure black base */
--bg-deep: #050508;           /* Slightly lifted sections */
--bg-surface: rgba(255, 255, 255, 0.02);
--bg-elevated: rgba(255, 255, 255, 0.04);
--bg-glass: rgba(255, 255, 255, 0.03);  /* Glassmorphic cards */

/* FPsOS Brand */
--fpsos-purple: #680036;      /* Primary brand (logo, headings) */
--fpsos-blue: #000b58;        /* Secondary brand */
--fpsos-orange: #e89900;      /* Accent (CTAs, highlights) */

/* Service Tier Colors */
--quick-fix: #00CCBC;         /* Teal - Quick Remote Fix (AED 199) */
--full-tune: #FF5A00;         /* Orange - Full Tune-Up (AED 399) */
--extreme: #FEEE00;           /* Yellow - Extreme BIOSPRIME (AED 699) */
```

### Typography

```css
--font-body: 'Inter'          /* Body text, paragraphs */
--font-display: 'Space Grotesk'  /* Headings, buttons, brand */
--font-mono: 'JetBrains Mono'    /* Code, stats, prices */
```

Loaded via Google Fonts CDN in `app/globals.css:1`

### Design System

**Bloomberg Void Black Theme:**
- Pure black (#000000) background
- Animated floating gradient orbs (purple, orange, teal)
- Glassmorphic cards (2-4% white opacity + backdrop blur)
- Grid overlay pattern (subtle, masked radial gradient)
- Glow effects on interactive elements
- Professional spacing and typography

**Animations:**
- `orb-float` - 25s background gradient movement
- `slide-up` - Page entrance animations
- `pulse-glow` - CTA hover effects
- `shimmer` - Card shine effects
- Hardware-accelerated (transform, opacity only)

## Services & Pricing

### Service Tiers

1. **Quick Remote Fix** - AED 199
   - 1-hour remote diagnostic session
   - Windows optimization
   - GPU driver configuration
   - Basic registry tweaks
   - Network settings optimization
   - Performance before/after report

2. **Full System Tune-Up** - AED 399 (Most Popular)
   - Everything in Quick Fix
   - BIOS optimization (guided)
   - Advanced RAM timing tuning
   - Complete driver stack optimization
   - Router QoS configuration
   - Interrupt affinity optimization
   - 1 week follow-up support

3. **Extreme BIOSPRIME** - AED 699
   - Everything in Full Tune-Up
   - Advanced BIOS deep-dive
   - Memory training optimization
   - Voltage/frequency fine-tuning
   - Custom performance profiles
   - Stability testing & validation
   - 1 month priority support

### Calendly Integration

Each service tier has a dedicated booking URL in `app/packages/page.tsx`:

```typescript
calendlyUrl="https://calendly.com/fpsos/quick-remote-fix"
calendlyUrl="https://calendly.com/fpsos/full-system-tune-up"
calendlyUrl="https://calendly.com/fpsos/extreme-biosprime"
```

**Note:** Update these URLs in production to match actual Calendly account.

### Social Links (Footer in app/layout.tsx)

```typescript
Discord:   https://discord.gg/fpsos
WhatsApp:  https://wa.me/yourwhatsapp
Instagram: https://instagram.com/fpsos
```

**Note:** Update with actual social media handles.

## Diagnostic Tool Architecture

### Browser Diagnostic (`app/diagnostic/page.tsx`)

**Client-side tests:**
1. GPU Detection - WebGL vendor/renderer detection
2. Display Analysis - Resolution, refresh rate
3. Network Jitter - 5 pings to Cloudflare, calculates jitter
4. Frame Timing - RequestAnimationFrame consistency analysis
5. System Info - User agent parsing for OS/CPU cores

**Recommendation Engine:**
- Critical issues (2+) → Recommend Extreme package
- Moderate issues (1 critical or 3+ warnings) → Recommend Full Tune-Up
- Minor issues (1+ warnings) → Recommend Quick Fix
- No issues → Suggest deep analysis tool download

### PowerShell Deep Tool

Generated script (`generatePowerShellScript()` in diagnostic page):
- GPU model and driver version (Win32_VideoController)
- Display resolution and refresh rate
- CPU cores and clock speed (Win32_Processor)
- RAM speed and capacity (Win32_PhysicalMemory)
- Power plan settings (powercfg)
- HPET status (bcdedit)
- Game Mode status (Registry)
- Network adapter details (Get-NetAdapter)

Exports results to `fpsos-diagnostic-results.json`

## Key Technical Details

### Static Export Configuration

`next.config.js` configured for static hosting:
```javascript
{
  output: 'export',
  images: { unoptimized: true }
}
```

**Limitations:**
- No API routes
- No server-side rendering
- No dynamic routes with getStaticPaths
- Image optimization disabled

### TypeScript Path Aliases

```json
"@/*": ["./*"]
```

Usage: `import Component from '@/app/components/Component'`

### SEO Configuration

Metadata in `app/layout.tsx`:
- Title: "FPsOS - Frame Per Second Operating System | CS2 Optimization Dubai"
- Description: "Professional CS2 optimization services in Dubai..."
- Keywords: CS2 optimization, gaming PC tuning, BIOS optimization Dubai

**Missing SEO Files:**
- Add `public/robots.txt` for search engine directives
- Add `public/sitemap.xml` for better indexing

## Design Reference

**Original Bloomberg Theme:** `Y:\Maxzi-Vite\data\weekly-reports\dec15-21-reference.html`

**Adapted Elements:**
- Void black background → Maintained exactly
- MAXZI green → Replaced with fpsos-purple (#680036) + fpsos-orange (#e89900)
- Floating orbs → Purple, orange, teal gradient orbs
- Glassmorphism → Applied to all cards with backdrop blur
- Grid overlay → Subtle radial-masked grid pattern

## Development Guidelines

### When Adding New Features

1. **Check if interactive:**
   - Event handlers (onClick, onHover) → Add `'use client'`
   - React hooks (useState, useEffect) → Add `'use client'`
   - Browser APIs (window, localStorage) → Add `'use client'`

2. **Maintain brand consistency:**
   - Use CSS variables for colors (never hardcoded hex)
   - Use glow effects on interactive elements
   - Keep void black background
   - Apply glassmorphism to new cards

3. **Typography hierarchy:**
   - Headings → `var(--font-display)` (Space Grotesk)
   - Body → `var(--font-body)` (Inter)
   - Code/stats → `var(--font-mono)` (JetBrains Mono)

4. **Animations:**
   - Use hardware-accelerated properties only (transform, opacity)
   - Keep animations subtle and professional
   - Duration: 0.3s for interactions, 25s for ambient animations

### Common Tasks

**Update Calendly Links:**
```typescript
// In app/packages/page.tsx
calendlyUrl="https://calendly.com/YOUR-USERNAME/endpoint"
```

**Update Social Links:**
```typescript
// In app/layout.tsx - Footer component
<a href="https://discord.gg/YOUR-DISCORD">Discord</a>
```

**Add New Page:**
```bash
# Create directory and page.tsx
mkdir app/newpage
touch app/newpage/page.tsx

# Add to navigation in app/layout.tsx
<a href="/newpage">New Page</a>
```

**Modify Colors:**
```css
/* In app/globals.css :root {} */
--fpsos-purple: #680036;  /* Update here */
```

**Add Glow Effects:**
```css
/* In globals.css */
.glow-yourcolor {
  box-shadow: 0 0 40px var(--your-color-glow);
}
```

## Deployment

### Vercel (Current Setup)

**Auto-deployment:** Push to `main` branch triggers build

**Manual deployment:**
```bash
vercel --prod
```

**DNS Configuration** (at registrar):
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Build Settings:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `out`

### Build Troubleshooting

**If build fails with "Module not found":**
```bash
rm -rf node_modules package-lock.json
npm install
```

**If static export fails:**
- Check for API routes (not supported)
- Check for server-side functions (getServerSideProps)
- Ensure all components are compatible with static generation

## Security & Performance

- **No backend/API** - Static site, minimal attack surface
- **No user data collection** - Privacy-first design
- **SSL/HTTPS** - Auto-provisioned by Vercel
- **Lighthouse targets:** 95+ across all metrics
- **Code splitting** - Automatic per-route by Next.js

## Agent Instructions

When working on fpsos.gg:

1. **Always maintain void black aesthetic** - Never suggest lighter backgrounds
2. **Use brand colors consistently** - Reference CSS variables, never hardcode
3. **Preserve service tier structure** - AED 199/399/699 pricing is fixed
4. **Test Calendly integration** - Ensure booking links open correctly
5. **Verify responsive design** - Mobile-first approach required
6. **Keep static export compatibility** - No server-side features
7. **Apply glassmorphism to new UI elements** - Maintain design consistency
8. **Use Space Grotesk for headings** - Typography hierarchy is critical
9. **Add 'use client' when needed** - Don't assume Server Components support interactivity
10. **Reference Bloomberg theme file** - `Y:\Maxzi-Vite\data\weekly-reports\dec15-21-reference.html` for design patterns

## Known Issues

- **Security vulnerability in Next.js 14.0.4** - Upgrade to latest 14.x when possible
- **Placeholder Calendly URLs** - Need to be replaced with actual booking links
- **Placeholder social links** - WhatsApp number and exact handles needed
- **Missing SEO files** - robots.txt and sitemap.xml should be added

## Support

- **Email:** support@fpsos.gg
- **Discord:** discord.gg/fpsos
- **Repository Issues:** GitHub repository (if applicable)
