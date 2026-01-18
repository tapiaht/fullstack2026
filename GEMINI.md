# Project Overview

This is a Next.js web application designed to manage and display a collection of Pokémon cards. It uses a modern technology stack including:

*   **Framework:** Next.js (a React framework)
*   **Authentication:** `better-auth` for user registration and login
*   **Database:** PostgreSQL, with Prisma as the ORM
*   **Styling:** Tailwind CSS for styling

The application allows users to view a collection of Pokémon cards. Registered and logged-in users can see their email and a sign-out button.

# Building and Running

To get the application running locally, you'll need to have Node.js and npm installed.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up the database:**
    This project uses PostgreSQL with Prisma. You'll need to have a PostgreSQL server running.
    *   Create a `.env` file in the root of the project and add your `DATABASE_URL`.
    *   Run the following command to apply the database migrations:
        ```bash
        npx prisma migrate dev
        ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

5.  **Run in production mode:**
    ```bash
    npm run start
    ```

# Development Conventions

*   **Linting:** The project uses ESLint for code quality. You can run the linter with:
    ```bash
    npm run lint
    ```
*   **Authentication:** Authentication is handled by `better-auth`. The configuration can be found in `src/lib/auth.ts`.
*   **Database:** The database schema is defined in `prisma/schema.prisma`. Any changes to the database schema should be done by modifying this file and then running `npx prisma migrate dev`.
*   **Components:** Reusable UI components are located in the `src/components` directory.

# Debugging and Conversation Summary

This section summarizes the key issues encountered during development and the solutions implemented.

## 1. Initial Project Exploration

*   The project was identified as a Next.js application using Prisma for ORM, PostgreSQL for the database, and `better-auth` for authentication.
*   Initial files reviewed included `package.json`, `next.config.js`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/auth.ts`, and `prisma/schema.prisma`.

## 2. APIError: Headers is required

*   **Problem:** An `APIError: Headers is required` occurred when `auth.api.getSession()` was called in `src/app/page.tsx`.
*   **Solution:** Passed the `headers()` object from `next/headers` to `auth.api.getSession()`.
    ```typescript
    const headersList = headers();
    const header_obj: { [key: string]: string } = {};
    for (const [key, value] of headersList.entries()) {
      header_obj[key] = value;
    }
    const session = await auth.api.getSession({ headers: header_obj });
    ```

## 3. TypeError: `headersList.forEach is not a function` / `headersList.entries is not a function`

*   **Problem:** Iterating over the `headersList` object returned by `next/headers` resulted in `TypeError`s, indicating it was not a standard `Headers` object with `forEach` or `entries` methods.
*   **Solution:** The `headers()` function is asynchronous and must be awaited. The error was caused by incorrectly removing the `await` keyword from `headers()`.
    ```typescript
    const headersList = await headers(); // Corrected: `await` headers()
    const header_obj: { [key: string]: string } = {};
    for (const [key, value] of headersList.entries()) {
      header_obj[key] = value;
    }
    ```

## 4. `PrismaClientKnownRequestError`: Invalid invocation (`password` missing)

*   **Problem:** Initial `PrismaClientKnownRequestError` with `Argument 'password' is missing` during user creation, suggesting a mismatch between `better-auth` and Prisma schema.
*   **Attempted Solution:** Made the `password` field optional (`String?`) in `prisma/schema.prisma`, followed by `npx prisma migrate dev` and `npx prisma generate`. This did not resolve the error initially due to caching.
*   **Resolution:** (Later identified as a `better-auth` configuration issue).

## 5. `TypeError`: `signUp` is not a function

*   **Problem:** `auth.signUp` was reported as `not a function` in server actions.
*   **Solution:** Based on `better-auth` examples, configured `emailAndPassword: { enabled: true }` in `src/lib/auth.ts`. The import and export of `signUp` and `signIn` were also corrected to use the `auth.api.signUpEmail` and `auth.api.signInEmail` functions respectively, and `auth.api.signOut` for `signOut`.
    ```typescript
    // src/lib/auth.ts
    export const auth = betterAuth({
      // ...
      emailAndPassword: {
        enabled: true,
      },
      // ...
    });
    export const signUp = auth.api.signUpEmail;
    export const signIn = auth.api.signInEmail;
    export const signOut = auth.api.signOut;
    ```

## 6. `Module not found: Can't resolve 'dns'`

*   **Problem:** This build error occurred because `src/lib/prisma.ts` (which uses `pg`, a Node.js module) was being bundled for the client when `src/app/register/page.tsx` was made a client component.
*   **Solution:** Moved the `registerUser` server action to `src/actions/auth-actions.ts` to ensure server-side code is not bundled with client components.

## 7. `TypeError`: `useActionState` / `useFormStatus` is not a function

*   **Problem:** `useFormState` was renamed to `useActionState`, and `useFormStatus` was being imported from the wrong package.
*   **Solution:** Updated imports in relevant files (`src/app/register/page.tsx`, `src/app/dashboard/add-pokemon/page.tsx`, `src/app/login/page.tsx`) to import `useActionState` from `react` and `useFormStatus` from `react-dom`.

## 8. Login/Registration `APIError`: `[body] Invalid input: expected object, received undefined` (400 Bad Request)

*   **Problem:** Both `signUp` and `signIn` functions from `better-auth` were expecting the user credentials to be wrapped in a `body` object.
*   **Solution:** Modified `registerUser` and `signInUser` actions to pass credentials as `{ body: { name, email, password } }` and `{ body: { email, password } }` respectively.

## 9. Login not reflected in UI (`An unknown error occurred.`)

*   **Problem:** After a successful login, the UI was not updated to reflect the logged-in state, showing "An unknown error occurred".
*   **Solution:** The success condition in `signInUser` was changed from `if (result.success)` to `if (result.token)`, as the `better-auth` `signIn` function returns a `token` on success.

## 10. Hydration Mismatch (`foxified=""`)

*   **Problem:** A `Hydration Mismatch` error occurred, with a `foxified=""` attribute appearing in the client-side HTML, not present in the server-rendered HTML.
*   **Solution:** Identified as an external issue caused by the "Foxit PDF Reader" Chrome extension. User disabled the extension to resolve.

## 11. Image Loading Errors (`ERR_SSL_WRONG_VERSION_NUMBER`, `upstream image response timed out`, `Invalid src prop`)

*   **Problem:** `fetch` calls failed with `ERR_SSL_WRONG_VERSION_NUMBER` for `https://placehold.co` images, leading to image timeouts and `Invalid src prop` errors in `next/image`.
*   **Workaround/Solution:**
    *   Initially changed `protocol: 'https'` to `protocol: 'http'` in `next.config.js` for `placehold.co` as a temporary workaround for the SSL error.
    *   To fix `Invalid src prop`, added *both* `http` and `https` protocols for `placehold.co` in `next.config.js` `images.remotePatterns` to accommodate URLs with either protocol.
    ```javascript
    // next.config.js
    remotePatterns: [
      { protocol: 'http', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
    ],
    ```

# Implementation Plan: Cloudinary Migration

This section documents the implementation plan for migrating from Uploadthing to Cloudinary for image storage.

## Completed Changes

### Dependencies
- ✅ Removed `uploadthing` and `@uploadthing/react` packages
- ✅ Installed `cloudinary` Node.js SDK

### Server Actions
**Modified:** `src/actions/pokemon-actions.ts`
- Replaced Uploadthing SDK with Cloudinary v2 SDK
- Updated `addPokemon` to use `cloudinary.uploader.upload_stream` for file uploads
- Updated `updatePokemon` to upload new images and delete old ones from Cloudinary
- Updated `deletePokemon` to extract and delete images using Cloudinary's `public_id`
- Maintained placeholder fallback for cases where upload fails or credentials are missing

### API Routes
**Deleted:** Uploadthing API Routes
- Removed `src/app/api/uploadthing/core.ts`
- Removed `src/app/api/uploadthing/route.ts`

### Configuration
**Modified:** `next.config.js`
- Updated `remotePatterns` to allow images from `res.cloudinary.com` (Cloudinary's CDN)
- Removed `utfs.io` pattern
- Added support for `CLOUDINARY_URL` format

## Verification Plan

### Manual Verification Steps
1. **Add Card with Image**: Navigate to `/dashboard/add-pokemon`, upload an image, and save. Verify the image is hosted on `res.cloudinary.com`.
2. **Edit Card Image**: Update an existing card's image. Verify the new image is uploaded and the old one is deleted from Cloudinary.
3. **Delete Card**: Delete a card and verify its image is removed from Cloudinary.
4. **Fallback Check**: Try adding a card without credentials. Verify the placeholder image is still generated correctly.

## Benefits of Cloudinary

- ✅ **No Credit Card Required**: Free tier doesn't require payment information
- ✅ **Generous Free Tier**: 25GB storage and 25GB bandwidth per month
- ✅ **Automatic Optimization**: Images are automatically optimized for web delivery
- ✅ **Production Ready**: Works seamlessly on Vercel and other hosting platforms
- ✅ **Reliable Service**: Industry-standard solution with high uptime

---

# Walkthrough: Complete Application Implementation

This section documents the complete implementation journey from authentication to CRUD operations with Cloudinary integration.

## Authentication Implementation

### Fixes Implemented
1. **Session Persistence for Server Actions**: Added the `nextCookies` plugin to the `better-auth` configuration in `src/lib/auth.ts`. This ensures that session cookies are correctly set and managed when using Next.js Server Actions.

2. **Reliable Redirects and Error Handling**: Modified `signInUser` and `registerUser` in `src/actions/auth-actions.ts` to explicitly handle redirects and return descriptive error messages.

3. **Sign Out Functionality**: Fixed the `signOutAction` in `src/actions/auth-actions.ts` by:
   - Passing required headers to the `signOut` API
   - Adding a redirect to the home page after sign-out to ensure the UI updates correctly

4. **Pokémon Image Loading**: Enabled `dangerouslyAllowSVG` in `next.config.js` to allow SVG placeholders from `placehold.co` to load correctly in Next.js 16.

## CRUD Implementation

### Features Implemented
- **Dynamic Card List**: The dashboard fetches and displays all Pokémon cards in a responsive grid
- **Add Pokémon**: Dedicated page (`/dashboard/add-pokemon`) with form validation and image upload
- **Edit Pokémon**: Edit page (`/dashboard/edit-pokemon/[id]`) to update existing card details
- **Delete Pokémon**: Delete functionality with confirmation dialog and automatic image cleanup

## Cloudinary Migration

### Why Cloudinary?
- ✅ **No Credit Card Required**: Free tier available without payment information
- ✅ **Generous Free Tier**: 25GB storage and 25GB bandwidth per month
- ✅ **Automatic Optimization**: Images are automatically optimized for web delivery
- ✅ **Production Ready**: Works seamlessly on Vercel and other hosting platforms
- ✅ **Reliable Service**: Industry-standard solution with high uptime

### Implementation Details
1. **Server-Side Uploads**: Refactored `src/actions/pokemon-actions.ts` to use Cloudinary's `upload_stream` API
2. **Image Management**: 
   - All images are uploaded to the `pokemon-cards` folder in Cloudinary
   - Old images are automatically deleted when updated or when a card is removed
   - Public IDs are extracted from Cloudinary URLs for deletion operations
3. **Configuration**: 
   - Removed Uploadthing API routes (`src/app/api/uploadthing/`)
   - Updated `next.config.js` to allow images from `res.cloudinary.com`
   - Configured Cloudinary SDK with environment variables (supports both `CLOUDINARY_URL` and individual credentials)

### Environment Setup
Add these variables to your `.env` file:
```
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```
Or use individual credentials:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Fallback Mechanism
If Cloudinary credentials are missing or upload fails, the system gracefully falls back to placeholder images from `placehold.co`, ensuring the application remains functional.

## Final Application Status

### Feature Summary
- ✅ **Authentication**: Full user registration, login, session persistence, and sign-out
- ✅ **CRUD Operations**: Complete Create, Read, Update, Delete for Pokémon cards
- ✅ **Image Storage**: Cloudinary integration with automatic optimization and cleanup
- ✅ **Fallback System**: Placeholder images when uploads fail or credentials are missing
- ✅ **Responsive UI**: Mobile-friendly dashboard with modern design
- ✅ **Production Ready**: Deployable to Vercel or any Node.js hosting platform

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Authentication**: better-auth
- **Database**: PostgreSQL with Prisma ORM
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS + Shadcn/UI
- **Type Safety**: TypeScript

---

## Current Status

*   Both user registration and login flows are now working correctly.
*   The `better-auth` library is configured to handle email/password authentication.
*   Image loading issues have been addressed with a configuration workaround.
*   The UI has been updated to show a profile icon when a user is logged in.
*   **Full CRUD implementation** for Pokémon cards with Cloudinary image storage.
*   **Production-ready** application with authentication, database, and cloud storage.

# Application Template Transformations

This Pokemon Card App serves as an excellent foundation for building various types of applications. Below are documented templates that can be derived from this codebase.

## Template 1: E-commerce / Tienda Online 🛒

**Base Transformation:**
- Rename `Pokemon` → `Product`
- Rename `imageUrl` → `images` (array for multiple product images)

**New Features to Add:**
- **Product Management:**
  - Price, stock, SKU, categories
  - Product variants (size, color, etc.)
  - Inventory tracking
- **Shopping Cart:**
  - Add to cart functionality
  - Cart persistence (localStorage or database)
  - Quantity management
- **Checkout Process:**
  - Shipping address form
  - Payment integration (Stripe/PayPal)
  - Order confirmation emails
- **Order Management:**
  - Order history for users
  - Admin order dashboard
  - Order status tracking

**Additional Dependencies:**
```bash
npm install stripe @stripe/stripe-js
npm install nodemailer
npm install @tanstack/react-query
```

**Complexity:** Media-Alta | **Time:** 2-3 weeks

---

## Template 2: POS/TPV (Point of Sale) 💳

**Base Transformation:**
- Rename `Pokemon` → `Product`
- Add `barcode`, `category`, `currentStock` fields

**New Features to Add:**
- **Sales Interface:**
  - Quick product search by barcode/name
  - Calculator-style quantity input
  - Real-time total calculation
- **Inventory Management:**
  - Stock alerts (low stock warnings)
  - Automatic stock deduction on sale
  - Stock adjustment interface
- **Reports:**
  - Daily/monthly sales reports
  - Best-selling products
  - Revenue charts
- **Multi-User:**
  - Cashier shifts/sessions
  - User-specific sales tracking

**Additional Dependencies:**
```bash
npm install recharts
npm install react-hook-form
npm install zustand
npm install react-barcode-reader
```

**Complexity:** Media | **Time:** 2 semanas

---

## Template 3: Sistema de Inventario 📦

**Base Transformation:**
- Rename `Pokemon` → `Item`
- Add `location`, `supplier`, `minStock`, `maxStock` fields

**New Features to Add:**
- **Inventory Tracking:**
  - Stock movements (in/out)
  - Movement history log
  - Location management (warehouse, shelf, etc.)
- **Supplier Management:**
  - Supplier database
  - Purchase orders
  - Supplier contact info
- **Alerts & Notifications:**
  - Low stock alerts
  - Expiration date warnings (for perishables)
  - Email notifications
- **Reports:**
  - Stock valuation
  - Movement reports
  - Supplier performance

**Additional Dependencies:**
```bash
npm install recharts
npm install react-pdf
npm install date-fns
```

**Complexity:** Baja-Media | **Time:** 1 semana

---

## Template 4: CMS (Content Management System) 📝

**Base Transformation:**
- Rename `Pokemon` → `Post` or `Article`
- Add `content` (rich text), `slug`, `status`, `publishedAt` fields

**New Features to Add:**
- **Content Editor:**
  - Rich text editor (TipTap/Slate)
  - Markdown support
  - Image upload within content
  - Content Organization:
  - Categories and tags
  - Draft/Published status
  - Scheduled publishing
- **SEO:**
  - Meta descriptions
  - SEO-friendly URLs (slugs)
  - Open Graph tags
- **Comments (Optional):**
  - User comments system
  - Comment moderation

**Additional Dependencies:**
```bash
npm install @tiptap/react @tiptap/starter-kit
npm install slugify
npm install gray-matter
```

**Complexity:** Baja | **Time:** 1 semana

---

## Template 5: Gestión de Recetas / Cookbook 🍳

**Base Transformation:**
- Rename `Pokemon` → `Recipe`
- Add `ingredients` (array), `steps` (array), `prepTime`, `cookTime` fields

**New Features to Add:**
- **Recipe Details:**
  - Ingredients list with quantities
  - Step-by-step instructions
  - Preparation and cooking time
  - Servings/portions
- **Categories:**
  - Meal type (breakfast, lunch, dinner)
  - Cuisine type (Italian, Mexican, etc.)
  - Dietary restrictions (vegan, gluten-free)
- **User Interaction:**
  - Favorites/bookmarks
  - Star ratings
  - User reviews
- **Search & Filter:**
  - Search by ingredients
  - Filter by prep time, difficulty

**Additional Dependencies:**
```bash
npm install react-beautiful-dnd
npm install react-rating-stars-component
```

**Complexity:** Baja | **Time:** 3-5 días

---

## Template 6: Portfolio / Galería de Proyectos 🎨

**Base Transformation:**
- Rename `Pokemon` → `Project`
- Add `description` (long text), `technologies` (array), `liveUrl`, `githubUrl` fields

**New Features to Add:**
- **Project Showcase:**
  - Multiple images per project (gallery)
  - Project description (rich text)
  - Technologies used (tags)
  - Links (live demo, GitHub, etc.)
- **Filtering:**
  - Filter by technology
  - Filter by category (web, mobile, design)
  - Search functionality
- **Animations:**
  - Smooth transitions
  - Hover effects
  - Page animations

**Additional Dependencies:**
```bash
npm install framer-motion
npm install react-image-gallery
npm install react-icons
```

**Complexity:** Muy Baja | **Time:** 2-3 días

---

## Template 7: Sistema de Reservas 📅

**Base Transformation:**
- Rename `Pokemon` → `Service` or `Room`
- Add `availability` (calendar), `duration`, `price`, `capacity` fields

**New Features to Add:**
- **Booking System:**
  - Calendar view of availability
  - Time slot selection
  - Booking confirmation
  - Booking cancellation
- **Availability Management:**
  - Set available dates/times
  - Block specific dates
  - Recurring availability patterns
- **Notifications:**
  - Email confirmations
  - Reminder emails
  - SMS notifications (optional)
- **Payment:**
  - Deposit/full payment
  - Payment integration

**Additional Dependencies:**
```bash
npm install react-big-calendar
npm install date-fns
npm install nodemailer
npm install @stripe/stripe-js
```

**Complexity:** Media | **Time:** 1-2 semanas

---

## Common Enhancements for All Templates

Regardless of which template you choose, consider adding:

1.  **Role-Based Access Control (RBAC):**
    - Admin, User, Moderator roles
    - Permission-based features
    - Protected routes

2.  **Advanced Search & Filtering:**
    - Full-text search
    - Multiple filter criteria
    - Sort options

3.  **Analytics Dashboard:**
    - Usage statistics
    - Charts and graphs (Recharts)
    - Export to PDF/Excel

4.  **Email Notifications:**
    - Nodemailer setup
    - Email templates
    - Transactional emails

5.  **Multi-language Support (i18n):**
    - next-intl or react-i18next
    - Language switcher
    - Translated content

6.  **Dark Mode:**
    - Theme toggle
    - Persistent theme preference
    - System preference detection

## Recommended Next Steps

1.  **Choose a template** based on your goals (learning, business, portfolio)
2.  **Plan the transformation** (list specific changes needed)
3.  **Implement incrementally** (start with core features, add enhancements later)
4.  **Test thoroughly** (authentication, CRUD, edge cases)
5.  **Deploy to production** (Vercel, Netlify, or custom server)

This codebase provides a solid, production-ready foundation with:
- ✅ Authentication (better-auth)
- ✅ Database (PostgreSQL + Prisma)
- ✅ File uploads (Cloudinary)
- ✅ Modern UI (Tailwind + Shadcn)
- ✅ Server Actions (Next.js App Router)
- ✅ Type safety (TypeScript)

You can confidently build any of these templates knowing the foundation is robust and scalable.