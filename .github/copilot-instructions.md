# GitHub Copilot Instructions - FPSOS.gg

## Project Overview

**FPSOS.gg** - Professional CS2 (Counter-Strike 2) optimization services in Dubai, UAE. We provide remote PC optimization for competitive gamers focusing on subtick system performance, interrupt affinity, and frame time consistency.

**Website:** Next.js 14 with App Router, static export for Vercel deployment
**Services:** 3 tiers - Quick Remote Fix (AED 199), Full System Tune-Up (AED 399), Extreme BIOSPRIME (AED 699)

---

## Brand Guidelines

### Brand Name
- **ALWAYS use:** `FPSOS` (all caps, no lowercase)
- **NEVER use:** `FPsOS`, `fpsos`, `Fpsos`
- **Domain:** fpsos.gg
- **Tagline:** "Frame Per Second Operating System"

### Colors (Bloomberg Void Black Theme)
```css
--fpsos-purple: #680036     /* Primary brand color */
--fpsos-orange: #e89900     /* Secondary/accent color */
--fpsos-blue: #64D2FF       /* Info/links */

--bg-void: #000000          /* Pure black backgrounds */
--bg-deep: #0a0a0a          /* Slightly elevated */
--bg-surface: #111111       /* Cards, surfaces */

--text-primary: #ffffff     /* Headings, primary text */
--text-secondary: #a0a0a0   /* Body text, descriptions */
--text-tertiary: #666666    /* Muted text, labels */

/* Service Tier Colors */
--quick-fix: #00CCBC        /* Quick Remote Fix */
--full-tune: #FF5A00        /* Full System Tune-Up */
--extreme: #FEEE00          /* Extreme BIOSPRIME */

/* Status Colors */
--success: #30D158
--warning: #FF9F0A
--error: #FF453A
```

---

## Design System (Apple UI Principles)

### Spacing (8px Grid System)
```css
--spacing-1: 8px    --spacing-2: 16px   --spacing-3: 24px
--spacing-4: 32px   --spacing-5: 40px   --spacing-6: 48px
--spacing-8: 64px   --spacing-10: 80px  --spacing-12: 96px
--spacing-16: 128px --spacing-20: 160px
```

**RULE:** All margins, padding, gaps MUST use spacing variables or multiples of 8px.

### Border Radius
```css
--radius-sm: 8px     /* Small elements, chips */
--radius-md: 12px    /* Buttons, inputs */
--radius-lg: 16px    /* Cards */
--radius-xl: 20px    /* Large cards, hero */
--radius-full: 9999px /* Pills, badges */
```

### Easing Curves (Apple Standard)
```css
--ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1)      /* General */
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)    /* Enter */
--ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1)      /* Exit */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)     /* Playful */
```

**RULE:** Use 0.2s for most transitions (faster = more premium)

### Typography
```css
/* Headlines */
font-family: 'Space Grotesk', sans-serif
font-weight: 700-800
letter-spacing: -0.03em
line-height: 1.08-1.15

/* Body */
font-family: 'Instrument Sans', sans-serif
font-weight: 400-500
letter-spacing: -0.011em
line-height: 1.5-1.6

/* Monospace */
font-family: 'JetBrains Mono', monospace
```

### Glassmorphism
```css
background: rgba(26, 26, 26, 0.85)
backdrop-filter: blur(20px) saturate(150%)
border: 1px solid rgba(255, 255, 255, 0.08)
```

---

## Tech Stack

- **Next.js 14** (App Router, static export)
- **TypeScript** (type safety)
- **Vercel** (free hosting)
- **CSS-in-JS** (inline styles, NOT Tailwind)
- **NO external state management** (keep simple)

---

## Code Style Rules

### 1. ALWAYS Add 'use client' When Using:
- Event handlers (`onClick`, `onMouseEnter`, etc.)
- React hooks (`useState`, `useEffect`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)

```tsx
'use client'

export default function Interactive() {
  const [state, setState] = useState(false)
  return <button onClick={() => setState(true)}>Click</button>
}
```

### 2. Use Inline Styles (Not Tailwind)
```tsx
// ✅ GOOD
<div style={{
  padding: 'var(--spacing-4)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--bg-surface)'
}}>

// ❌ BAD
<div className="p-4 rounded-lg bg-surface">
```

### 3. Responsive with clamp()
```tsx
<h1 style={{
  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
  lineHeight: 1.08
}}>
```

### 4. Subtle Hover Effects
```tsx
<div
  style={{ transition: 'all 0.2s var(--ease-standard)' }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
>
```

### 5. Accessibility (WCAG AA)
```tsx
<button
  aria-label="Download tool"
  onFocus={(e) => {
    e.currentTarget.style.outline = '2px solid var(--fpsos-orange)'
    e.currentTarget.style.outlineOffset = '4px'
  }}
>
```

---

## Common Patterns

### Button
```tsx
<a
  href="/packages"
  style={{
    display: 'inline-flex',
    padding: 'var(--spacing-2) var(--spacing-4)',
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, var(--fpsos-purple), var(--fpsos-orange))',
    color: '#ffffff',
    fontWeight: 600,
    transition: 'all 0.2s var(--ease-standard)'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.975)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
>
  View Packages
</a>
```

### Glass Card
```tsx
<div style={{
  background: 'rgba(26, 26, 26, 0.85)',
  backdropFilter: 'blur(20px) saturate(150%)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--spacing-4)'
}}>
  Content
</div>
```

---

## CS2 Terminology (Use Correctly)

- **Subtick System** - CS2's new system (NOT "128 tick")
- **Frame Time Consistency** - More important than FPS
- **Interrupt Affinity** - CPU core assignment
- **DPC Latency** - Deferred Procedure Call latency
- **WHEA Errors** - Causes frame spikes
- **Process Lasso** - Affinity management
- **9800X3D** - AMD Ryzen 9 (reference system)
- **FACEIT AC** - Anti-cheat (requires TPM/Secure Boot)

---

## Service Names (Exact)

1. **Quick Remote Fix** (AED 199)
2. **Full System Tune-Up** (AED 399)
3. **Extreme BIOSPRIME** (AED 699) - BIOSPRIME is one word, all caps

---

## Don'ts

❌ Don't use `FPsOS` - always `FPSOS`
❌ Don't use Tailwind - use design system variables
❌ Don't use heavy libraries - bundle size matters
❌ Don't skip `'use client'` on interactive components
❌ Don't use generic colors - use brand variables
❌ Don't create new spacing - use existing scale

---

## Priority Principles

1. **Simplicity** - Don't over-engineer
2. **Brand Consistency** - Always FPSOS colors/spacing
3. **Performance** - Fast > fancy
4. **Accessibility** - WCAG AA minimum
5. **Mobile-First** - Design for 375px up
6. **Type Safety** - Use TypeScript
7. **Static Export** - No server features

---

**Last Updated:** 2026-01-05
**Project:** FPSOS.gg - CS2 Optimization Services
**Location:** Dubai, UAE
