# KFC Mobile Food Ordering Application

A modern, production-oriented fast-food ordering mobile application inspired by the KFC digital ordering experience, built with **React Native**, **Expo SDK 57**, **TypeScript**, **Gluestack UI**, **Expo Router**, **Lucide Icons**, **TanStack Query**, **Zustand**, and **Supabase**.

---

## 🍗 Key Features

1. **Persistent Bottom Tab Navigation (5 Destinations)**
   - **Home**: Delivery location selector, greeting, search bar, promotional banner ("Your favourites, freshly prepared"), horizontal category strip, bestsellers grid, family value packs, and coupon badges.
   - **Menu**: Searchable catalog, category filters, sorting (Bestsellers, Price: Low to High, Price: High to Low, Rating), responsive 2-column grid, loading skeletons, and floating cart indicator.
   - **Orders**: Active deliveries & past order history, status badges, item thumbnails, total amount in LKR, live tracking link, and one-tap reorder.
   - **Offers**: Curated deals, bundle offers, coupon codes (e.g. `WELCOME20`, `BUCKET500`, `ZINGER15`) with one-tap copy/apply, expiry dates, and terms.
   - **Profile**: Customer account info, saved delivery addresses manager, order history, favorite meals, customer service hotline (+94 11 553 2532), and sign out.

2. **Full Product Customization & Ordering**
   - High-resolution food photography.
   - Size/Piece selection (e.g., 4 Pieces, 6 Pieces, 8 Pieces Bucket, Single/Double Fillet Stack).
   - Addon groups with validation (Spice level: Original vs Hot & Crispy; Free sides selection; Drink bottles; Dipping sauces).
   - Special instructions input (e.g., "extra spicy, sauce on side").
   - Dynamic unit & total price calculation in LKR.

3. **Persistent Shopping Cart**
   - Delivery vs In-store Pickup fulfillment mode toggle.
   - Item quantity stepper with automatic subtotal update.
   - Customization breakdown per line item.
   - Promo code validation with instant discount calculation and maximum caps.
   - Persisted across restarts with AsyncStorage.

4. **Frictionless Checkout Flow**
   - Saved address selector or add new delivery address with Sri Lankan districts & cities.
   - Sri Lankan phone number validation (`+94 7X XXX XXXX`).
   - Payment method selection: Cash on Delivery (COD), Card payment, and Koko Sri Lanka BNPL.
   - Delivery instructions note.
   - Duplicate submission protection with loading state.

5. **Real-time Order Confirmation & 6-Stage Tracking**
   - Unique order reference numbers (e.g. `KFC-LK-7819`).
   - 6 fulfillment steps:
     1. Order Placed
     2. Order Confirmed
     3. Preparing Food
     4. Ready for Dispatch
     5. Out for Delivery
     6. Delivered
   - Interactive kitchen simulation button ("Simulate Next Kitchen/Delivery Stage") for QA testing.
   - Direct call store button.

6. **Sri Lankan Localization**
   - Currency: **LKR** formatted consistently as `LKR 1,250.00`.
   - Standard delivery fee of **LKR 350.00**.
   - Sri Lankan phone numbers and delivery areas (Colombo 01-15, Dehiwala, Mount Lavinia, Rajagiriya, Negombo, Kandy, Galle, etc.).

---

## 🎨 Design System & Strict Brand Guidelines

Adheres strictly to modern fast-food digital ordering guidelines:
- **Primary Red**: `#C8102E`
- **Dark Red**: `#A50D26`
- **Light Red**: `#FFF1F2`
- **Background**: Clean solid `#FFFFFF`
- **Secondary Surfaces**: Soft neutral `#F7F7F7`
- **Text Primary**: `#202124`
- **Text Secondary**: `#6B7280`
- **Borders**: `#E5E7EB`
- **No Gradients**: Strictly clean, solid colors with high visual contrast.
- **No Emojis for Interface Icons**: Fully powered by Lucide icons.
- **Touch-Friendly Targets**: Minimum 44–48pt touch targets.

---

## 📁 Project Architecture

```
KFC/
├── src/
│   ├── app/                      # Expo Router File-Based Routing
│   │   ├── _layout.tsx           # Providers (Gluestack, QueryClient, SafeArea)
│   │   ├── (tabs)/               # Persistent Bottom Tabs
│   │   │   ├── _layout.tsx       # Bottom Tab Navigator (5 tabs)
│   │   │   ├── index.tsx         # Home Route
│   │   │   ├── menu.tsx          # Menu Route
│   │   │   ├── orders.tsx        # Orders Route
│   │   │   ├── offers.tsx        # Offers Route
│   │   │   └── profile.tsx       # Profile Route
│   │   ├── product/[id].tsx      # Product Details Modal/Screen
│   │   ├── cart.tsx              # Shopping Cart Screen
│   │   ├── checkout.tsx          # Checkout Screen
│   │   ├── orders/[id].tsx       # Order Tracking Screen
│   │   ├── profile/addresses.tsx # Saved Addresses Screen
│   │   └── auth/                 # Sign In & Sign Up Screens
│   ├── components/
│   │   └── common/               # Atomic & Shared Components
│   │       ├── AppHeader.tsx
│   │       ├── SearchBar.tsx
│   │       ├── CategoryCard.tsx
│   │       ├── ProductCard.tsx
│   │       ├── PriceText.tsx
│   │       ├── QuantitySelector.tsx
│   │       ├── CartItemRow.tsx
│   │       ├── OrderStatusTimeline.tsx
│   │       ├── PrimaryButton.tsx
│   │       └── EmptyState.tsx
│   ├── constants/
│   │   └── mockData.ts           # Food catalog, categories, promos, SL locations
│   ├── hooks/
│   │   └── useCatalog.ts         # TanStack Query custom hooks
│   ├── providers/
│   │   └── QueryProvider.tsx     # TanStack Query Client Provider
│   ├── screens/                  # Screen Implementations
│   │   ├── home/HomeScreen.tsx
│   │   ├── menu/MenuScreen.tsx
│   │   ├── product/ProductDetailsScreen.tsx
│   │   ├── cart/CartScreen.tsx
│   │   ├── checkout/CheckoutScreen.tsx
│   │   ├── orders/OrdersScreen.tsx
│   │   ├── orders/OrderTrackingScreen.tsx
│   │   ├── offers/OffersScreen.tsx
│   │   ├── profile/ProfileScreen.tsx
│   │   ├── profile/AddressesScreen.tsx
│   │   └── auth/SignInScreen.tsx & SignUpScreen.tsx
│   ├── services/
│   │   ├── api/index.ts          # Unified API layer (Supabase + graceful mock)
│   │   └── supabase.ts           # Supabase client with AsyncStorage session
│   ├── store/
│   │   ├── useCartStore.ts       # Zustand cart store with AsyncStorage
│   │   ├── useOrderStore.ts      # Zustand orders store
│   │   └── useUserStore.ts       # Zustand user & addresses store
│   ├── theme/
│   │   ├── index.ts              # Design tokens (colors, spacing, typography)
│   │   └── gluestack-provider.tsx# Gluestack UI Provider
│   ├── types/
│   │   └── index.ts              # TypeScript domain types
│   └── utils/
│       └── formatters.ts         # LKR currency & phone formatters
├── supabase/
│   ├── schema.sql                # PostgreSQL Schema with Row Level Security (RLS)
│   └── seed.sql                  # Realistic Sri Lankan catalog seed records
└── .env.example                  # Environment variables template
```

---

## 🚀 Getting Started

### 1. Installation
All dependencies are already installed in this project directory:
```bash
npm install
```

### 2. Running Locally
Start the Expo development server:
```bash
npm start
```

Press:
- `w` to open in your web browser.
- `a` to open on an Android emulator or device.
- `i` to open on an iOS simulator.
- Scan the terminal QR code using the **Expo Go** mobile app on your phone.

---

## 🗄️ Database & Backend Integration

The app is architected with a **graceful fallback layer**:
- Out of the box, it runs completely standalone with realistic Sri Lankan menu items, family deals, and coupons.
- To connect to a live **Supabase** backend:
  1. Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
  2. Fill in your `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
  3. Run the SQL migrations in `supabase/schema.sql` and `supabase/seed.sql` in your Supabase SQL editor.
  4. Row Level Security (RLS) policies ensure customers can only access their own private orders and profiles.

---

## 🧪 Quality Assurance & Test Workflows

1. **Menu Browsing & Search**
   - In Home or Menu tabs, type "zinger" or "pizza" into the search bar.
   - Filter by categories: *Fried Chicken*, *Burgers*, *Pizza*, *Wraps*, *Fries & Sides*, *Beverages*, *Family Meals*, *Desserts*.
   - Sort by *Price: Low to High*, *High to Low*, or *Top Rated*.

2. **Customization & Add to Cart**
   - Tap any item (e.g. *Original Recipe Chicken* or *Super Zinger Burger*).
   - Select size (e.g. *6 Pieces* or *Double Fillet Stack*).
   - Select addons and flavor styles (e.g. *Hot & Crispy*, *Signature Garlic Mayo*).
   - Observe the live LKR price update in real-time on the bottom button.
   - Add to cart and note the item count badge updating in the header and tab bar.

3. **Cart & Promo Coupons**
   - Open Cart (tap bag in header or "View Cart" banner).
   - Switch between **Home Delivery** (adds LKR 350.00 fee) and **Pickup** (LKR 0.00).
   - In the coupons field, apply code `WELCOME20` or `BUCKET500` to verify discount calculation.
   - Increment, decrement, or remove items.

4. **Checkout & Order Placement**
   - Proceed to Checkout.
   - Select a saved delivery address or add a new Sri Lankan address.
   - Select payment method (*Cash on Delivery*, *Card*, or *Koko Pay in 3*).
   - Tap **Place Order** (duplicate submissions are prevented).

5. **Real-time Order Tracking**
   - On the Order Tracking screen, review your order number, items, and delivery estimate.
   - Tap **"Simulate Next Kitchen/Delivery Stage"** to test progress through all 6 fulfillment stages (*Order Placed* → *Order Confirmed* → *Preparing Food* → *Ready for Dispatch* → *Out for Delivery* → *Delivered*).
   - Tap **"Reorder All Items"** to automatically add all items back into the cart.
