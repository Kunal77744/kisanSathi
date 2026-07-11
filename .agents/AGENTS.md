# KisanSathi Coding & Design Conventions

This file documents the conventions, layout patterns, styling conventions, and accessibility rules for the **KisanSathi** application to ensure consistent quality across all future feature modules.

---

## 🎨 Design System & Colors

We use an agriculture-themed, warm, earthy color scheme. **Avoid standard blue corporate palettes.**

### Primary Palette (Tailwind Custom Colors)
- **kisan-green**: Custom green range representing agriculture, nature, and growth.
  - Light Highlights: `kisan-green-50` (`#f0fdf4`), `kisan-green-100` (`#dcfce7`)
  - Primary Green: `kisan-green-700` (`#15803d`) — used for main buttons, headers, active states.
  - Dark Slate: `kisan-green-950` (`#052e16`) — used for body text or dark mode cards.
- **kisan-earth**: Earthy clay/terracotta range representing soil, organic elements, and warmth.
  - Accent details: `kisan-earth-500` (`#a86958`), `kisan-earth-700` (`#774032`)
- **kisan-yellow**: Warm sun/gold accent color representing harvests, grain, and warmth.
  - Accent: `kisan-yellow-600` (`#ca8a04`), `kisan-yellow-700` (`#a16207`)
- **kisan-cream**: Cream background colors. Soft on the eyes, offering high readability.
  - Warm White/Cream: `kisan-cream-100` (`#fbf9f4`) — default light mode page background.
  - Light grey-cream border: `kisan-cream-200` (`#f6f1e6`)

---

## 🔤 Typography & Localization

- **Sans Serif**: `Poppins` (English-friendly sans-serif) + fallback to `Noto Sans Devanagari` (Hindi/Devanagari rendering support).
- **Setup**: Configured dynamically using CSS variables inside Tailwind config: `font-sans: ["var(--font-poppins)", "var(--font-noto-sans-devanagari)", "sans-serif"]`.
- **Bilingual Structure**: All navigation and layout features must have a structured design to handle English (`en`) and Hindi (`hi`) text options.

---

## 📱 Mobile-First & Accessibility Guidelines

Indian farmers primarily interact with websites via mobile devices, often under direct sunlight, and might not be fully tech-savvy.

1. **Large Tap Targets**:
   - Any clickable button, navigation item, or toggle must be at least `48px` tall (`min-h-[48px]`) or `44px` with clear padding.
   - Use `active:scale-95` transitions to provide tactile feedback.
2. **Text Legibility**:
   - Minimum font size for general body text: `1rem` (16px) or `1.125rem` (18px) for Hindi text (which has detailed character curves).
   - High contrast ratios: Use `stone-900` or `kisan-green-950` on cream backgrounds. Avoid light gray text.
3. **Smooth Animations**:
   - Avoid complex or heavy animations.
   - Use simple fades (`transition-opacity`), shifts (`transition-transform`), and subtle scaling.
   - Use hover effects primarily for desktop viewports.

---

## 💻 Tech Stack & React Guidelines

- **Next.js 14 App Router**: Use Server Components (`React Server Components` or RSC) by default for better performance and SEO.
- **Client Components**: Restrict client components to files that require local React states (e.g., input states, toggle dropdowns) using `"use client"`.
- **CSS Utility classes**: Use Tailwind CSS variables or custom utility classes defined in `app/globals.css`:
  - Primary button: `.btn-primary`
  - Secondary button: `.btn-secondary`
  - Container card: `.card-kisan`
- **Clean Structure**: Create dedicated components for modules in `components/[module-name]/` and keep layout endpoints in `app/[module-name]/page.tsx`.
