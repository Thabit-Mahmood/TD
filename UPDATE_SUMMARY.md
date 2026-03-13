# TD Logistics - Comprehensive Updates

## Changes Being Implemented:

### 1. ✅ Caching & Redirects
- Added cache-busting headers (no-cache, no-store, must-revalidate)
- Added redirects from /ar and /en to home page
- Updated CSP to allow Google Maps

### 2. 🔄 Text Updates (In Progress)
**"Last Mile Delivery" → "Package Delivery"**
- Arabic: "التوصيل للميل الأخير" → "توصيل الطرود"
- English: "Last Mile Delivery" → "Package Delivery"

Files to update:
- src/lib/i18n/translations/ar.json
- src/lib/i18n/translations/en.json
- src/app/page.tsx (schema)
- src/app/services/last-mile/page.tsx (schema)

### 3. 🔄 Navbar Improvements
- Show navbar on scroll up
- Add active page indicator

### 4. 🔄 Qaseem Section Updates
- Reorder: Unaizah first, then Buraydah
- Add cities: المجمعة, الغاط, الزلفي
- Remove "24/7" from "Daily trips"
- Remove "Same Day" from delivery options

### 5. 🔄 Language Toggle
- Create toggle switch design
- Arabic 🇸🇦 ←→ English 🇬🇧

### 6. 🔄 Content Updates
- Remove "thousands" from CTA
- Fix phone number orientation (9200 15499)
- Change "shipping and delivery" → "logistics services"
- Change 99.2% → 93%

### 7. 🔄 Testimonials
- Make card heights consistent
- Add "Read More" button for long reviews
- Fix mobile view (one card per slide)
- Create endless loop animation

### 8. 🔄 Contact Page
- Replace OpenStreetMap with Google Maps
- Add zoom limits (Riyadh only)

### 9. 🔄 Login Page
- Fix eye icon alignment
- Translate error messages properly

## Priority Order:
1. Translations (text updates)
2. Navbar (scroll behavior + active indicator)
3. Qaseem section
4. Language toggle
5. Testimonials
6. Phone number fixes
7. Maps
8. Login page
