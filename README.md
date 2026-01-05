# FPsOS Website - Next.js + Bloomberg Theme

Professional CS2 optimization services website built with Next.js 14, featuring the Bloomberg void black theme with glassmorphism and animated gradient orbs.

## 🎨 Features

- **Bloomberg Void Black Theme** - Pure black background with animated gradient orbs
- **Glassmorphic UI** - Semi-transparent cards with backdrop blur
- **Browser Diagnostic Tool** - GPU detection, network jitter, frame timing tests
- **Downloadable PowerShell Tool** - Deep system analysis (BIOS, registry, drivers)
- **3 Service Tiers** - Quick Fix, Full Tune-Up, Extreme BIOSPRIME
- **Calendly Integration** - Direct booking for each package
- **Fully Responsive** - Mobile-first design with desktop optimization
- **SEO Optimized** - Metadata, semantic HTML, performance-first

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd Y:/fpsos-nextjs
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
```

This creates a static export in the `out/` folder ready for deployment.

## 📦 Deployment to Vercel (FREE)

### Option 1: GitHub + Vercel (Recommended)

1. **Create GitHub Repository**
   ```bash
   cd Y:/fpsos-nextjs
   git init
   git add .
   git commit -m "Initial commit: FPsOS website with Bloomberg theme"
   gh repo create fpsos-website --public --source=. --remote=origin
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js and deploys
   - Custom domain: Add `fpsos.gg` in Settings → Domains

### Option 2: Vercel CLI (Quick Deploy)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from folder
cd Y:/fpsos-nextjs
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? fpsos-website
# - Directory? ./
# - Override settings? No

# Production deployment
vercel --prod
```

### Custom Domain Setup (fpsos.gg)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add `fpsos.gg` and `www.fpsos.gg`
3. Update DNS at your registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait 24-48 hours for DNS propagation
5. Vercel auto-provisions SSL certificate

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** CSS-in-JS (inline styles) + CSS Modules
- **Deployment:** Vercel (static export)
- **Fonts:** Google Fonts (Inter, Space Grotesk, JetBrains Mono)
- **Analytics:** (Add Vercel Analytics in dashboard)

## 📁 Project Structure

```
fpsos-nextjs/
├── app/
│   ├── layout.tsx          # Root layout with nav + footer
│   ├── globals.css         # Bloomberg theme CSS
│   ├── page.tsx            # Homepage / Hero
│   ├── packages/
│   │   └── page.tsx        # Service packages
│   ├── diagnostic/
│   │   └── page.tsx        # Diagnostic tool
│   └── terms/
│       └── page.tsx        # Terms & Conditions
├── public/                 # Static assets (images, etc.)
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🎨 Theme Customization

### Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --fpsos-purple: #680036;      /* Primary brand color */
  --fpsos-orange: #e89900;      /* Accent color */
  --quick-fix: #00CCBC;         /* Quick Fix tier */
  --full-tune: #FF5A00;         /* Full Tune-Up tier */
  --extreme: #FEEE00;           /* Extreme tier */
}
```

### Animations

Modify gradient orb animations in `globals.css`:

```css
@keyframes orb-float {
  /* Adjust timing, scale, translate for different effect */
}
```

## 🔧 Configuration

### Update Calendly Links

In `app/packages/page.tsx`, replace placeholder URLs:

```typescript
calendlyUrl="https://calendly.com/YOUR-USERNAME/quick-remote-fix"
calendlyUrl="https://calendly.com/YOUR-USERNAME/full-system-tune-up"
calendlyUrl="https://calendly.com/YOUR-USERNAME/extreme-biosprime"
```

### Update Social Links

In `app/layout.tsx` (Footer component):

```typescript
<a href="https://discord.gg/YOUR-DISCORD">Discord</a>
<a href="https://wa.me/YOUR-WHATSAPP">WhatsApp</a>
<a href="https://instagram.com/YOUR-INSTAGRAM">Instagram</a>
```

## 📊 Diagnostic Tool

### Browser Tests (Automatic)
- GPU detection via WebGL
- Display refresh rate detection
- Network jitter testing (5 pings to Cloudflare)
- Frame timing consistency analysis

### PowerShell Deep Tool
Users can download `fpsos-diagnostic-tool.ps1` which checks:
- GPU model and driver version
- Display resolution and refresh rate
- CPU cores and clock speed
- RAM speed and capacity
- Power plan settings
- HPET status (useplatformclock)
- Game Mode status
- Network adapter details

Results export to `fpsos-diagnostic-results.json` for user to share.

## 🚀 Performance

- **Static Export** - No server required, instant page loads
- **Code Splitting** - Automatic per-route code splitting
- **Image Optimization** - Next.js automatic image optimization (disabled for static export)
- **CSS Animations** - Hardware-accelerated GPU animations
- **Lighthouse Score Target:** 95+ across all metrics

## 📝 SEO

Metadata configured in `app/layout.tsx`:
- Title: "FPsOS - Frame Per Second Operating System | CS2 Optimization Dubai"
- Description: Optimized for "CS2 optimization Dubai", "BIOS tuning", "gaming PC optimization"
- Keywords: CS2, Dubai, FPS boost, competitive gaming

Add `robots.txt` and `sitemap.xml` in `public/` folder for better SEO.

## 🔒 Security

- No backend/API - static site = minimal attack surface
- No user data collection
- Remote desktop sessions use AnyDesk/TeamViewer (user-controlled)
- PowerShell tool runs locally, no data sent to servers

## 📧 Support

- Email: support@fpsos.gg
- Discord: discord.gg/fpsos
- WhatsApp: [Your Number]

## 📄 License

© 2025 FPsOS. All rights reserved.
