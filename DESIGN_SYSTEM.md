# FPSOS Design System Documentation

## Apple UI Engineering Principles Applied

This document outlines the comprehensive design optimizations applied to the FPSOS website, following Apple's UI engineering principles and design language.

---

## 1. 8px Grid System

All spacing throughout the website now adheres to Apple's 8px grid system for visual consistency and harmony.

### Spacing Scale
```css
--spacing-1: 8px     /* Micro spacing */
--spacing-2: 16px    /* Tight spacing */
--spacing-3: 24px    /* Default spacing */
--spacing-4: 32px    /* Medium spacing */
--spacing-5: 40px    /* Comfortable spacing */
--spacing-6: 48px    /* Generous spacing */
--spacing-8: 64px    /* Section spacing */
--spacing-10: 80px   /* Large section spacing */
--spacing-12: 96px   /* Hero spacing */
--spacing-16: 128px  /* Extra large spacing */
```

### Application
- All margins, padding, gaps use these variables
- Component dimensions align to 8px increments
- Navigation height: 64px (8px × 8)
- Button padding: 16px/24px (2-3 units)

---

## 2. Typography Hierarchy

Apple-inspired typography with refined letter-spacing and line-heights for optimal readability.

### Font Stack
```css
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
--font-display: 'Space Grotesk', sans-serif
--font-mono: 'JetBrains Mono', monospace
```

### Type Scale
- **H1**: `clamp(2.5rem, 6vw, 4.5rem)` - Letter-spacing: `-0.03em`
- **H2**: `clamp(2rem, 4vw, 3rem)` - Letter-spacing: `-0.025em`
- **H3**: `clamp(1.5rem, 3vw, 2rem)` - Letter-spacing: `-0.02em`
- **Body**: `1rem` - Letter-spacing: `-0.011em`
- **Small**: `0.9375rem` (15px) - Letter-spacing: `-0.011em`

### Characteristics
- Negative letter-spacing for display sizes (tighter, more premium)
- Line-height: 1.08-1.15 for headings (tight, Apple-style)
- Line-height: 1.5-1.6 for body (comfortable reading)
- Font smoothing: antialiased for crisp rendering

---

## 3. Easing Curves

Apple-standard cubic-bezier curves for natural, intentional motion.

### Curve Definitions
```css
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)      /* All-purpose */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1)     /* Enter animations */
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1)     /* Exit animations */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  /* Playful effects */
```

### Timing
- Standard transitions: 0.2s (fast, responsive)
- Card hovers: 0.25s (slightly slower, intentional)
- Background animations: 30s (very slow, ambient)

---

## 4. Glassmorphism

Refined backdrop blur and transparency for depth and premium feel.

### Glass Card Properties
```css
background: rgba(255, 255, 255, 0.03)
border: 1px solid rgba(255, 255, 255, 0.08)
backdrop-filter: blur(20px) saturate(140%)
border-radius: var(--radius-lg) /* 16px */
```

### Gradient Border Overlay
- Subtle gradient overlay on glass cards
- Top-left to bottom-right: white 6% → transparent → white 3%
- Opacity: 0.5 for subtle effect

### Variations
- Navigation: blur(20px) with 75% black background
- Cards: blur(20px) with 3% white background
- Buttons (secondary): blur(12px) with 4% white background

---

## 5. Generous Whitespace

Let content breathe with ample spacing between sections and elements.

### Section Spacing
- Desktop sections: 128px vertical padding (--spacing-16)
- Mobile sections: 96px vertical padding (--spacing-12)
- Hero section: 96px top/bottom (--spacing-12)

### Component Spacing
- Card internal padding: 24px-48px (--spacing-3 to --spacing-6)
- Element gaps: 24px default (--spacing-3)
- Trust section margins: 80px bottom (--spacing-10)

### Container Constraints
- Max width: 1280px (comfortable reading width)
- Content max width: 700-900px for text blocks
- Horizontal padding: 24px mobile, 40px tablet, 48px desktop

---

## 6. Intentional Motion

Subtle, purposeful animations that enhance without distracting.

### Button Interactions
```css
/* Hover */
transform: translateY(-1px)
box-shadow: enhanced depth
transition: 0.2s ease-standard

/* Active */
transform: scale(0.975)
```

### Card Interactions
```css
/* Hover */
transform: translateY(-2px)
border-color: stronger
box-shadow: elevated

/* All transitions */
transition: all 0.2s var(--ease-standard)
```

### Background Animation
- Gradient orbs: 30s slow float animation
- Opacity: 0.2 (very subtle)
- Will-change: transform (performance optimized)

### Stagger Animations
Homepage hero elements:
- Logo: 0.1s delay
- Badge: 0.2s delay
- Headline: 0.3s delay
- Subhead: 0.4s delay
- CTAs: 0.5s delay
- Trust cards: 0.6s delay

---

## 7. Accessibility (WCAG AA)

Focus states and interaction design for keyboard and screen reader users.

### Focus Indicators
```css
*:focus-visible {
  outline: 2px solid var(--fpsos-orange)
  outline-offset: 2px
  border-radius: 4px
}

button:focus-visible,
a:focus-visible {
  outline-offset: 4px /* More generous for interactive elements */
}
```

### Navigation
- Underline animation on hover
- Full 2px gradient underline
- Color contrast: orange (#e89900) on black background

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important
    transition-duration: 0.01ms !important
  }

  body::before {
    animation: none /* Disable background animation */
  }
}
```

---

## Brand Consistency

### Brand Name
- **Correct**: FPSOS (all caps)
- **Incorrect**: FPsOS, FPSos, fpsos
- Applied consistently across:
  - Page titles
  - Navigation
  - Footer
  - PowerShell diagnostic tool
  - All user-facing text

### Brand Colors
```css
--fpsos-purple: #680036  /* Primary gradient start */
--fpsos-orange: #e89900  /* Primary gradient end, accent */
--fpsos-blue: #000b58    /* Tertiary accent */
```

### Bloomberg Void Black Theme
```css
--bg-void: #000000       /* Pure black background */
--bg-deep: #050508       /* Slightly lifted surface */
--bg-surface: rgba(255, 255, 255, 0.02)  /* Subtle elevation */
```

---

## Color System

### Background Hierarchy
```css
--bg-void: #000000                        /* Base background */
--bg-deep: #050508                        /* Elevated surface */
--bg-surface: rgba(255, 255, 255, 0.02)  /* Card background */
--bg-elevated: rgba(255, 255, 255, 0.04) /* Hover state */
--bg-glass: rgba(255, 255, 255, 0.03)    /* Glassmorphic */
```

### Border Hierarchy
```css
--border-subtle: rgba(255, 255, 255, 0.04)   /* Minimal borders */
--border-default: rgba(255, 255, 255, 0.08)  /* Standard borders */
--border-strong: rgba(255, 255, 255, 0.12)   /* Emphasized borders */
```

### Text Hierarchy
```css
--text-primary: #ffffff                     /* Headings, emphasis */
--text-secondary: rgba(255, 255, 255, 0.70) /* Body text */
--text-tertiary: rgba(255, 255, 255, 0.45)  /* Muted text */
--text-ghost: rgba(255, 255, 255, 0.20)     /* Disabled text */
```

### Service Tier Colors
```css
--quick-fix: #00CCBC   /* Teal - Quick Remote Fix */
--full-tune: #FF5A00   /* Orange-red - Full System Tune-Up */
--extreme: #FEEE00     /* Yellow - Extreme BIOSPRIME */
```

---

## Component Guidelines

### Buttons

#### Primary Large
- Padding: 16px × 40px (--spacing-2 × --spacing-5)
- Gradient: purple to orange (135deg)
- Shadow: 0 4px 16px orange 25%
- Hover: translateY(-1px), enhanced shadow
- Font: 1.0625rem (17px), weight 700

#### Secondary Large
- Padding: 16px × 40px
- Background: white 4% with blur(12px)
- Border: white 12%
- Hover: white 8%, translateY(-1px)
- Font: 1.0625rem, weight 600

### Cards

#### Glass Card
- Background: white 3%
- Border: white 8%
- Radius: 16px (--radius-lg)
- Backdrop: blur(20px) saturate(140%)
- Gradient overlay: top-left to bottom-right

#### Package Card
- Padding: 64px × 48px (--spacing-8 × --spacing-6)
- Featured: white 4% background, colored border
- Regular: white 2% background, default border
- Hover: translateY(-2px), elevated shadow

#### Trust Card
- Padding: 24px (--spacing-3)
- Background: white 2%
- Border: white 8%
- Hover: white 4%, translateY(-1px)

---

## Mobile Responsiveness

### Breakpoints
```css
@media (max-width: 768px) {
  .section { padding: var(--spacing-12) 0 } /* 96px → 96px */
  .container { padding: 0 var(--spacing-3) } /* 48px → 24px */
}

@media (min-width: 768px) {
  .container { padding: 0 var(--spacing-5) } /* 40px */
}

@media (min-width: 1024px) {
  .container { padding: 0 var(--spacing-6) } /* 48px */
}
```

### Responsive Typography
- H1: `clamp(2.5rem, 6vw, 4.5rem)` - scales smoothly
- H2: `clamp(2rem, 4vw, 3rem)`
- Body: `clamp(1.125rem, 2vw, 1.25rem)`
- Ensures readability on all screen sizes

---

## Performance Optimizations

### Will-Change
```css
body::before {
  will-change: transform /* Optimize animated background */
}
```

### GPU Acceleration
- Backdrop filters use hardware acceleration
- Transform animations use GPU
- Box-shadows optimized with layered approach

### Font Loading
- System fonts as fallback: `-apple-system, BlinkMacSystemFont`
- Font smoothing: antialiased
- Prevents layout shift with font display swap

---

## Files Modified

### Core Files
1. **app/layout.tsx** - Navigation and footer with 8px grid, refined branding
2. **app/page.tsx** - Homepage with stagger animations, generous whitespace
3. **app/packages/page.tsx** - Service packages with Apple-refined spacing
4. **app/diagnostic/page.tsx** - Diagnostic tool with improved UX flow
5. **app/globals.css** - Complete design system implementation

### Key Changes Per File

#### layout.tsx
- Navigation height: 72px → 64px (8px aligned)
- Logo size: 36px → 32px (8px aligned)
- Link spacing: var(--spacing-5) → var(--spacing-4)
- Brand name: FPsOS → FPSOS (all instances)
- Refined transitions and hover states

#### page.tsx
- Hero section padding optimized to 8px grid
- Hero icon: 72px → 64px
- Trust badge padding reduced for tighter feel
- CTA button spacing: 96px → 80px margin
- Headline size reduced slightly for balance

#### packages/page.tsx
- Header spacing: 96px → 80px margin
- Package grid gap: 32px → 24px
- Card padding: 80px → 64px vertical
- Trust section: 96px → 80px margins
- Typography sizes refined for hierarchy

#### diagnostic/page.tsx
- Page top padding aligned to navigation (64px)
- Card padding standardized to spacing variables
- Spinner size: 60px → 56px (8px aligned)
- All spacing converted to CSS variables
- PowerShell script branding updated

#### globals.css
- Added spacing-11, spacing-14, spacing-24 to grid
- Background orbs: refined sizes and opacity (0.25 → 0.2)
- Grid overlay: 60px → 64px (8px aligned)
- Glass blur: 24px → 20px (more subtle)
- Button transitions: 0.25s → 0.2s (snappier)
- Shadow depths reduced for subtlety
- Transform scales: 0.98 → 0.975 (more refined)

---

## Design Philosophy

### Apple's Principles Applied

1. **Clarity** - Clear visual hierarchy, generous whitespace, refined typography
2. **Deference** - Content-first, subtle animations, glassmorphism doesn't overwhelm
3. **Depth** - Layered shadows, backdrop blur, gradient overlays create dimension

### FPSOS Brand Identity

1. **Professional** - Bloomberg void black, refined glassmorphism, premium feel
2. **Technical** - Monospace fonts for code, precise 8px grid, engineering mindset
3. **Energetic** - Purple/orange gradients, subtle animations, modern aesthetic

### Visual Balance

- **Light elements** (orange accents) on dark backgrounds create contrast
- **Glassmorphism** provides depth without heaviness
- **Generous whitespace** prevents claustrophobia on dark theme
- **Subtle animations** add life without distraction

---

## Future Enhancements

### Potential Additions
1. **Dark mode toggle** (currently always dark) - user preference
2. **Custom scrollbar** styling for Firefox
3. **Loading states** with skeleton screens
4. **Micro-interactions** on form inputs
5. **Parallax effects** on hero section (subtle)

### Accessibility Improvements
1. **Skip to main content** link for keyboard users
2. **ARIA labels** for icon-only buttons
3. **Live regions** for dynamic content updates
4. **High contrast mode** support

---

## Maintenance Guidelines

### Adding New Components
1. Use spacing variables from globals.css
2. Apply glassmorphism with .glass-card class
3. Follow 8px grid alignment
4. Use brand colors from CSS variables
5. Apply Apple easing curves to transitions
6. Test reduced motion preference

### Spacing Decisions
- Internal padding: --spacing-3 to --spacing-6
- Element gaps: --spacing-2 to --spacing-3
- Section margins: --spacing-8 to --spacing-12
- Hero spacing: --spacing-12 to --spacing-16

### Animation Timing
- Fast interactions: 0.2s (buttons, links)
- Card hovers: 0.25s (more intentional)
- Page transitions: 0.3s (comfortable)
- Background effects: 30s+ (ambient)

---

## Resources

### Inspiration
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Apple.com design language](https://www.apple.com/)
- Bloomberg Terminal aesthetic

### Tools Used
- CSS Grid for layouts
- CSS Custom Properties for theming
- Cubic-bezier for easing curves
- Clamp() for responsive typography

---

**Last Updated**: January 2025
**Design System Version**: 1.0
**Brand**: FPSOS (Frame Per Second Operating System)
