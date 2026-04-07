# Unwearable — Brutalist E-Commerce Implementation Plan

A web-brutalist e-commerce storefront built with **Next.js (App Router)**, **Tailwind CSS**, and **Framer Motion**. The design language is raw, high-contrast, and typographically aggressive — thick borders, monospaced type, stark black/white with neon accents, anti-smooth interactions, and intentionally "ugly-beautiful" aesthetics.

---

## Design System Pillars

| Token | Value |
|---|---|
| **Primary BG** | `#F5F0E8` (dirty cream) |
| **Primary Text** | `#0A0A0A` (near-black) |
| **Accent** | `#FF3E00` (brutalist red-orange) |
| **Secondary Accent** | `#00FF88` (toxic green) |
| **Border** | `3px solid #0A0A0A` |
| **Font — Display** | `Space Mono` (monospace) |
| **Font — Body** | `Inter` (sans-serif, tight tracking) |
| **Radius** | `0` everywhere (hard corners) |
| **Shadows** | Offset box-shadows (`4px 4px 0 #0A0A0A`) |

---

## File Structure

```
d:\Code Projects\Unwearable\
├── public/
│   └── images/              # Product & hero images (generated)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (fonts, metadata, Navbar/Footer)
│   │   ├── page.tsx             # Home / Landing page
│   │   ├── globals.css          # Tailwind directives + brutalist base styles
│   │   ├── shop/
│   │   │   └── page.tsx         # Product grid / catalog
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Product detail page
│   │   ├── cart/
│   │   │   └── page.tsx         # Cart page
│   │   └── checkout/
│   │       └── page.tsx         # Checkout page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Top bar with brutalist logo, nav links, cart icon
│   │   │   └── Footer.tsx       # Thick-bordered footer with marquee
│   │   ├── ui/
│   │   │   ├── BrutalButton.tsx # Hard-shadow, uppercase, no-radius button
│   │   │   ├── BrutalInput.tsx  # Thick-border input field
│   │   │   ├── Marquee.tsx      # Infinite scrolling ticker
│   │   │   └── SectionHeading.tsx # Giant, rotated, or offset headings
│   │   ├── product/
│   │   │   ├── ProductCard.tsx  # Card with hard shadow, hover jolt
│   │   │   └── ProductGrid.tsx  # Asymmetric grid layout
│   │   ├── cart/
│   │   │   ├── CartItem.tsx     # Line item row in the cart
│   │   │   └── CartSummary.tsx  # Totals + checkout CTA
│   │   └── home/
│   │       ├── HeroBanner.tsx   # Full-bleed hero with glitch text
│   │       ├── FeaturedStrip.tsx# Horizontal scroll of featured items
│   │       └── Manifesto.tsx    # Brutalist "about" statement
│   ├── context/
│   │   └── CartContext.tsx      # React Context for cart state
│   ├── data/
│   │   └── products.ts         # Static product data (name, price, slug, images)
│   ├── lib/
│   │   └── utils.ts            # formatPrice, cn() helper
│   └── types/
│       └── index.ts            # Product, CartItem TypeScript types
├── tailwind.config.ts           # Custom theme (colors, fonts, shadows)
├── next.config.ts               # Next.js config
├── tsconfig.json
├── package.json
└── postcss.config.mjs
```

---

## Routing Map

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing page — Hero, Featured, Manifesto |
| `/shop` | `src/app/shop/page.tsx` | Full product catalog grid |
| `/product/[slug]` | `src/app/product/[slug]/page.tsx` | Single product detail + "Add to Cart" |
| `/cart` | `src/app/cart/page.tsx` | Cart view with quantity controls |
| `/checkout` | `src/app/checkout/page.tsx` | Checkout form (static, no payment gateway) |

---

## Proposed Changes

### 1. Project Initialization

#### [NEW] Project scaffold

- Run `npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` inside `d:\Code Projects\Unwearable`
- Install additional deps: `npm install framer-motion`

---

### 2. Design System & Globals

#### [NEW] [tailwind.config.ts](file:///d:/Code%20Projects/Unwearable/tailwind.config.ts)

Extend the default theme with:
- Custom colors: `cream`, `brutal-black`, `accent`, `toxic`
- Font families: `Space Mono` (mono), `Inter` (sans)
- Box-shadow utility: `brutal` → `4px 4px 0 #0A0A0A`, `brutal-lg` → `8px 8px 0 #0A0A0A`
- Border width: `brutal` → `3px`

#### [NEW] [globals.css](file:///d:/Code%20Projects/Unwearable/src/app/globals.css)

- Tailwind `@tailwind` directives
- Base layer: `* { border-radius: 0 }`, selection color overrides, custom scrollbar
- Brutalist utility classes (`.text-glitch`, `.marquee-track`, etc.)

---

### 3. Types & Data

#### [NEW] [types/index.ts](file:///d:/Code%20Projects/Unwearable/src/types/index.ts)

```ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}
```

#### [NEW] [data/products.ts](file:///d:/Code%20Projects/Unwearable/src/data/products.ts)

- ~8 mock products with edgy, brutalist names (e.g., "VOID HOODIE", "CONCRETE TEE", "STATIC JOGGERS")
- Prices, slugs, taglines, and placeholder image paths

#### [NEW] [lib/utils.ts](file:///d:/Code%20Projects/Unwearable/src/lib/utils.ts)

- `formatPrice(cents: number)` → `$XX.XX`
- `cn(...classes)` → conditional classname merger using `clsx` + `tailwind-merge`

---

### 4. Cart Context

#### [NEW] [context/CartContext.tsx](file:///d:/Code%20Projects/Unwearable/src/context/CartContext.tsx)

- `CartProvider` wrapping the app with `useReducer`
- Actions: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`
- Exposed via `useCart()` hook
- Persists to `localStorage`

---

### 5. Layout Components

#### [NEW] [components/layout/Navbar.tsx](file:///d:/Code%20Projects/Unwearable/src/components/layout/Navbar.tsx)

- Fixed top bar, `3px` bottom border
- Logo in `Space Mono`, uppercase, oversized
- Links: HOME, SHOP, CART (with item count badge)
- Mobile: hamburger that drops a full-screen brutalist overlay menu with Framer Motion `AnimatePresence`

#### [NEW] [components/layout/Footer.tsx](file:///d:/Code%20Projects/Unwearable/src/components/layout/Footer.tsx)

- Thick top border, grid layout
- Marquee ticker: `"UNWEARABLE — FASHION IS DEAD — WEAR THE VOID"`
- Columns: links, fake socials, newsletter input with `BrutalButton`

---

### 6. UI Primitives

#### [NEW] [components/ui/BrutalButton.tsx](file:///d:/Code%20Projects/Unwearable/src/components/ui/BrutalButton.tsx)

- Uppercase, `Space Mono`, hard offset shadow
- Framer Motion: `whileHover` → shadow collapse + translate, `whileTap` → press-in

#### [NEW] [components/ui/BrutalInput.tsx](file:///d:/Code%20Projects/Unwearable/src/components/ui/BrutalInput.tsx)

- 3px border, no radius, thick focus ring (accent color)

#### [NEW] [components/ui/Marquee.tsx](file:///d:/Code%20Projects/Unwearable/src/components/ui/Marquee.tsx)

- Infinite horizontal CSS animation (`translateX` loop)
- Configurable speed and content

#### [NEW] [components/ui/SectionHeading.tsx](file:///d:/Code%20Projects/Unwearable/src/components/ui/SectionHeading.tsx)

- Giant `Space Mono` text, optional `-rotate-2` tilt, offset underline bar

---

### 7. Product Components

#### [NEW] [components/product/ProductCard.tsx](file:///d:/Code%20Projects/Unwearable/src/components/product/ProductCard.tsx)

- Thick border, hard shadow, image container
- On hover (Framer Motion): shadow offset jolt + slight rotate
- Category label as rotated sticker-badge

#### [NEW] [components/product/ProductGrid.tsx](file:///d:/Code%20Projects/Unwearable/src/components/product/ProductGrid.tsx)

- CSS Grid with intentionally asymmetric sizing (`grid-cols-[1fr_1.2fr_0.8fr]`)
- Every 3rd card gets `col-span-2` for visual disruption
- Staggered entrance via Framer Motion `staggerChildren`

---

### 8. Cart Components

#### [NEW] [components/cart/CartItem.tsx](file:///d:/Code%20Projects/Unwearable/src/components/cart/CartItem.tsx)

- Row layout: image thumbnail, name, quantity +/- controls, line total, remove ✕

#### [NEW] [components/cart/CartSummary.tsx](file:///d:/Code%20Projects/Unwearable/src/components/cart/CartSummary.tsx)

- Subtotal, thick divider, "PROCEED TO CHECKOUT" `BrutalButton`

---

### 9. Home Page Sections

#### [NEW] [components/home/HeroBanner.tsx](file:///d:/Code%20Projects/Unwearable/src/components/home/HeroBanner.tsx)

- Full-viewport, `cream` background
- Giant headline: **"FASHION IS DEAD."** with CSS glitch animation (clip-path + color shift)
- Sub-text + CTA `BrutalButton` → `/shop`
- Framer Motion staggered text reveal on load

#### [NEW] [components/home/FeaturedStrip.tsx](file:///d:/Code%20Projects/Unwearable/src/components/home/FeaturedStrip.tsx)

- Horizontal scrolling strip of 4 featured `ProductCard`s
- Drag-scroll enabled via Framer Motion `drag="x"` + `dragConstraints`

#### [NEW] [components/home/Manifesto.tsx](file:///d:/Code%20Projects/Unwearable/src/components/home/Manifesto.tsx)

- Two-column layout: oversized rotated text on left, manifesto paragraph on right
- Scroll-triggered `fadeInUp` via Framer Motion `useInView`

---

### 10. Pages

#### [NEW] [app/layout.tsx](file:///d:/Code%20Projects/Unwearable/src/app/layout.tsx)

- Import `Space Mono` + `Inter` from `next/font/google`
- Wrap children with `CartProvider`
- Render `Navbar` + `{children}` + `Footer`
- `<html>` gets `className` with font variables

#### [NEW] [app/page.tsx](file:///d:/Code%20Projects/Unwearable/src/app/page.tsx)

- Compose: `HeroBanner` → `Marquee` → `FeaturedStrip` → `Manifesto`

#### [NEW] [app/shop/page.tsx](file:///d:/Code%20Projects/Unwearable/src/app/shop/page.tsx)

- `SectionHeading` → category filter buttons → `ProductGrid`
- Framer Motion `layoutId` for smooth filter transitions

#### [NEW] [app/product/[slug]/page.tsx](file:///d:/Code%20Projects/Unwearable/src/app/product/%5Bslug%5D/page.tsx)

- Two-column: large product image (left), details + "ADD TO CART" button (right)
- Framer Motion page entrance (`initial={{ x: 100, opacity: 0 }}`)

#### [NEW] [app/cart/page.tsx](file:///d:/Code%20Projects/Unwearable/src/app/cart/page.tsx)

- List of `CartItem` rows + `CartSummary`
- Empty state: giant "YOUR CART IS VOID" text

#### [NEW] [app/checkout/page.tsx](file:///d:/Code%20Projects/Unwearable/src/app/checkout/page.tsx)

- Two-column: form fields (using `BrutalInput`) + order summary sidebar
- Static form (no backend), "PLACE ORDER" button triggers a success animation

---

### 11. Image Assets

- Use the `generate_image` tool to create ~4 brutalist product images and a hero background
- Place in `public/images/`

---

## Animation Summary (Framer Motion)

| Area | Animation |
|---|---|
| Page transitions | `initial/animate/exit` with opacity + slide |
| Hero headline | CSS glitch + FM staggered reveal |
| Product cards | `whileHover` jolt (shadow + rotate) |
| Buttons | `whileHover` shadow collapse, `whileTap` press |
| Product grid | `staggerChildren` entrance |
| Featured strip | `drag="x"` horizontal scroll |
| Manifesto | `useInView` fade-in-up |
| Mobile menu | `AnimatePresence` slide-down overlay |
| Cart items | `AnimatePresence` + `layout` for add/remove |

---

## Verification Plan

### Automated (Dev Server)

1. `npm run dev` — confirm clean compile, no TS errors
2. `npm run build` — confirm production build succeeds without errors

### Browser Testing (via browser subagent)

1. Navigate to `http://localhost:3000` — verify Hero, Marquee, Featured, Manifesto render correctly
2. Navigate to `/shop` — verify product grid renders all products, category filter works
3. Click a product card → verify `/product/[slug]` page loads with correct data
4. Click "ADD TO CART" → verify cart badge updates, navigate to `/cart` and verify item appears
5. Adjust quantity, remove items → verify state updates correctly
6. Click "PROCEED TO CHECKOUT" → verify checkout form renders
7. Test mobile viewport (resize to 375px) → verify responsive layout and mobile menu

### Manual Verification

- The user can visually inspect the brutalist aesthetic, ensuring hard shadows, monospace type, and neon accents are consistent across all pages.
