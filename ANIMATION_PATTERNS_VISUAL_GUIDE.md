# 🎬 FPSOS Animation Patterns - Visual Guide

## Overview: What Each Page Does

```
┌─────────────────────────────────────────────────────────────┐
│                    FPSOS WEBSITE ANIMATIONS                 │
└─────────────────────────────────────────────────────────────┘

📄 Homepage (/)
├─ ✨ Hero Section
│  └─ Fade in (opacity 0 → 1) on page load
│
├─ 🎯 Feature Cards  
│  ├─ Stagger in with 0.1s delay per card
│  └─ On hover: lift -8px + orange glow
│
├─ 💰 Stats
│  ├─ Stagger in on load
│  └─ Scale from 0.95 → 1 on appear
│
├─ 🛡️ Trust Section
│  └─ Scale in (0.95 → 1) when scrolled into view
│
└─ 🔘 All Buttons
   ├─ On hover: scale 0.97
   └─ On tap: scale 0.95 (press feedback)

📦 Packages Page (/packages)
├─ 📋 Header
│  └─ Fade in on page load
│
├─ 🎁 Service Cards (3 tiers)
│  ├─ Stagger in on load
│  ├─ Card 1 (Quick Fix): Cyan/teal glow
│  ├─ Card 2 (Full Tune): Orange glow (featured)
│  ├─ Card 3 (Extreme): Yellow glow
│  └─ All on hover: -8px lift + glow shadow
│
├─ 📊 Comparison Table
│  └─ Fade in on viewport
│
├─ ❓ FAQ Items
│  ├─ Stagger in on load
│  └─ On expand: height animate from 0 → auto
│
└─ 📞 Contact CTA
   └─ Fade in + scale on scroll into view

❓ FAQ Page (/faq)
├─ 📋 Header
│  └─ Fade in on load
│
├─ 🏷️ Category Filter
│  ├─ Fade in with 0.2s delay
│  └─ Button states: selected/unselected
│
├─ 📝 FAQ Items (24 total)
│  ├─ Stagger in on load
│  ├─ On hover: 
│  │  ├─ Background brightens
│  │  ├─ Border highlights orange
│  │  └─ Subtle translate Y
│  └─ On click: accordion expand/collapse
│      └─ Height animates: 0 → auto
│
└─ 📞 Contact CTA
   └─ Fade in on scroll

📞 Contact Page (/contact)
├─ 📝 Form Fields
│  └─ Ready for field-level animations (optional)
│
├─ 🎯 Form Buttons
│  ├─ On hover: scale 0.97
│  └─ On tap: scale 0.95
│
└─ 🔔 Toast Notifications
   ├─ Success Toast
   │  ├─ Message: "Thanks for reaching out!"
   │  ├─ Duration: 4 seconds
   │  ├─ Position: Bottom-right
   │  └─ Style: Green border, dark background
   │
   └─ Error Toast
      ├─ Message: Error details
      ├─ Duration: 4 seconds
      ├─ Position: Bottom-right
      └─ Style: Red border, dark background
```

---

## 🎬 Animation Patterns Used

### Pattern 1: Staggered List (Most Common)
**Used on**: Feature cards, FAQ items, stats, service cards

```
Timeline:
Item 1: ====> fade in (0ms - 400ms)
        Item 2: ====> fade in (100ms - 500ms)
               Item 3: ====> fade in (200ms - 600ms)
                      Item 4: ====> fade in (300ms - 700ms)

Result: Elegant cascade effect, looks premium
```

**Code**:
```tsx
<motion.div variants={staggerContainerVariants} initial="initial" animate="animate">
  {items.map(item => (
    <motion.div variants={staggerItemVariants} key={item.id}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

### Pattern 2: Hover Elevation (Cards)
**Used on**: Service cards, FAQ items, feature cards

```
Visual Effect:
Before Hover:          On Hover:
┌──────────┐          ┌──────────┐
│  Content │          │ Content  │  ← Lifts -8px
└──────────┘          └──────────┘
                      + Glow shadow beneath

Timing: 0.2s cubic-bezier (Apple standard)
```

**Code**:
```tsx
<motion.div whileHover={{ y: -8, boxShadow: '0 20px 48px rgba(232, 153, 0, 0.2)' }}>
  Card content
</motion.div>
```

---

### Pattern 3: Scroll-Triggered Reveal
**Used on**: Trust section, CTA sections, tables

```
Scroll Progress:
0%     25%     50%     75%     100%
|------|------|------|------|
               opacity: 0 → 1
               scale: 0.95 → 1
```

**Code**:
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
>
  Content reveals when scrolled into view
</motion.div>
```

---

### Pattern 4: Accordion Expand/Collapse
**Used on**: FAQ items

```
Closed State:          Open State:
┌──────────────┐      ┌──────────────┐
│ Question ▼   │      │ Question ▲   │
└──────────────┘      ├──────────────┤
  height: 60px        │ Answer text  │
                      │ with details │
                      └──────────────┘
                      height: 200px
                      
Animation: height 0 → auto over 0.2s
```

**Code**:
```tsx
{isExpanded && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    transition={{ duration: 0.2 }}
  >
    {content}
  </motion.div>
)}
```

---

### Pattern 5: Button Press Feedback
**Used on**: All CTA buttons, form submit button

```
States:
Normal:        Hover:         Tap/Press:
scale: 1       scale: 0.97    scale: 0.95
opacity: 1     opacity: 1     opacity: 1

Timing: Immediate (whileHover/whileTap, no transition delay)
```

**Code**:
```tsx
<motion.button
  whileHover={{ scale: 0.97 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleClick}
>
  Click Me
</motion.button>
```

---

### Pattern 6: Toast Notification
**Used on**: Form submissions, errors

```
Timeline:
Entry:  Slide in from bottom-right (0s)
        With fade in opacity 0 → 1
        
Display: Visible and interactive (0s - 4s)
        
Exit:   Slide out + fade out (4s - 4.3s)
        Auto-dismiss after 4 seconds
        
Position: Fixed bottom-right
```

**Code**:
```tsx
import toast from 'react-hot-toast'

toast.success('Success!', {
  duration: 4000,
  position: 'bottom-right'
})
```

---

## 📊 Timing & Easing

### Standard Timings
| Animation | Duration | Use Case |
|-----------|----------|----------|
| Hover effect | Instant | Button/card hover |
| Page load | 0.6s | Hero, header fade |
| Scroll reveal | 0.6s | Content entering view |
| Accordion | 0.2s | Quick expand/collapse |
| Stagger delay | 0.1s per item | List items |
| Toast | 4s | Notification display |

### Easing Functions
```
Apple Standard (0.4, 0.0, 0.2, 1):
  ╱─────────────
 ╱ Fast start, smooth end
╱
Perfect for most UI animations

Spring Physics (0.34, 1.56, 0.64, 1):
  ╱╲
 ╱  ╲╱╲ Bouncy, playful
╱
Used for emphasis effects
```

---

## 🎨 Color & Glow Effects

### Card Hover Glow by Service Type
```
Quick Fix (Cyan):
  boxShadow: '0 12px 40px rgba(0, 204, 188, 0.2)'
  borderColor: rgba(0, 204, 188, 0.4)

Full Tune (Orange):
  boxShadow: '0 12px 40px rgba(232, 153, 0, 0.2)'
  borderColor: rgba(232, 153, 0, 0.4)

Extreme (Yellow):
  boxShadow: '0 12px 40px rgba(254, 238, 0, 0.2)'
  borderColor: rgba(254, 238, 0, 0.4)
```

---

## 📱 Mobile Animations

All animations work on mobile with same effects:
- ✅ Touch hover = keyboard hover
- ✅ Tap = mouse click
- ✅ Scroll animations trigger on mobile scroll
- ✅ Toast appears same position
- ✅ Stagger cascades same way

---

## ♿ Accessibility

Animations respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  /* Animations become instant/disabled */
  transition-duration: 0s;
  animation-duration: 0s;
}
```

Can be implemented by adding:
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Skip animations if true
```

---

## 🚀 Performance Tips

1. **Use GPU-accelerated properties only**:
   - ✅ transform (translate, scale, rotate)
   - ✅ opacity
   - ❌ width, height, left, top

2. **Lazy load with viewport triggers**:
   - `viewport={{ once: true }}` prevents re-animation on scroll
   - `amount: 0.3` triggers when 30% visible

3. **Keep stagger delays short**:
   - 0.1s is perfect (0.2s or more feels sluggish)

4. **Avoid animating too many items**:
   - Stagger max 6-8 items per section
   - More than that feels excessive

---

## 🎯 Animation Decision Tree

```
Want to animate something?

├─ Is it a page/section load?
│  └─ Use: initial={{ opacity: 0 }} → animate={{ opacity: 1 }}
│
├─ Is it hovering over a card?
│  └─ Use: whileHover={{ y: -8 }}
│
├─ Is it a list of items?
│  └─ Use: staggerContainerVariants + staggerItemVariants
│
├─ Is it scrolling into view?
│  └─ Use: whileInView={{ opacity: 1 }} + viewport
│
├─ Is it an accordion/expand?
│  └─ Use: height: 0 → auto animation
│
├─ Is it a button press?
│  └─ Use: whileTap={{ scale: 0.95 }}
│
└─ Is it a notification?
   └─ Use: toast() function
```

---

## 💡 Pro Tips

1. **Keep animations brief** - 0.2s-0.6s is professional
2. **Use stagger for lists** - Feels premium and organized
3. **Hover should be instant** - No delay on user interaction
4. **Viewport animations are premium** - Use generously
5. **Glow effects build trust** - Use brand colors
6. **Toast position matters** - Bottom-right is standard
7. **Mobile-first animation** - Test on devices
8. **Skip animations on slow networks** - Can add detection

---

**Master all these patterns and you can animate like Apple's designers!** 🎬✨

