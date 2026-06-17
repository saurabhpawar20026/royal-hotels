# Royal Hotels — Build Spec (read before editing)

Luxury 5-star hotel booking site. React 19 + Vite + react-router-dom v7 + recharts + react-icons.
**Theme:** dark premium + gold accents + glassmorphism. Match the existing pages (Home, Rooms, RoomDetails).

## Rules
- Create ONLY the page files assigned to you. Do NOT modify `index.css`, shared components, contexts, data, or other pages.
- Each page = `src/pages/X.jsx` + co-located `src/pages/X.css` (import it at top of the JSX file).
- Prefix your CSS class names with a page key (e.g. `.about-team`, `.pay-method`) to avoid collisions.
- Use only imports that exist (listed below). Use `react-icons/fa` for icons. Prices via `formatINR`.
- Public pages render inside a layout that already provides Navbar/Footer/Chatbot and top padding (`.page`). Start most public pages with `<PageHero .../>`.
- Add `className="reveal"` to major blocks for scroll animation, and call `useReveal("somekey")` once per page.

## Global utility classes (already in index.css — use freely)
Layout: `.container`, `.section`, `.section-head` (+`.left`), `.grid` `.grid-2/3/4`.
Surfaces: `.glass`, `.card`. Text: `.eyebrow`, `.gold-text`, `.serif`, `.lead`, `.display`, `.divider-gold`.
Buttons: `.btn` + `.btn-gold` / `.btn-outline` / `.btn-ghost` / `.btn-sm` / `.btn-lg` / `.btn-block`.
Badges: `.badge` + `.badge-gold/success/danger/warning`.
Forms: wrap in `.field` (styles its `label`+`input`/`select`/`textarea`) or use `.input`.
Helpers: `.text-center .text-dim .text-gold .flex .flex-col .items-center .justify-between .gap-1/2/3 .mt-1/2/3 .mb-2 .wrap .full .relative .hide-mobile .stars .spinner`.
Sub-page hero: `.page-hero`, `.page-hero__crumbs`.

## CSS variables
`--gold #d4af37`, `--gold-soft`, `--gold-deep`, `--gold-grad`, `--gold-grad-text`,
`--bg`, `--bg-2`, `--bg-3`, `--surface`, `--surface-2`, `--glass`, `--glass-border`,
`--border`, `--border-strong`, `--text`, `--text-dim`, `--text-faint`, `--heading`,
`--success #4ade80`, `--warning #fbbf24`, `--danger #f87171`, `--info #60a5fa`,
`--shadow-md`, `--shadow-gold`, `--radius`, `--radius-sm`, `--radius-lg`,
`--font-display` (Playfair), `--font-serif` (Cormorant), `--font-sans` (Jost), `--nav-h 84px`.

## Shared components
- `import PageHero from "../components/layout/PageHero.jsx"` — props `{ image, eyebrow, title, subtitle, crumbs:[{label,to?}] }`.
- `import RoomCard from "../components/ui/RoomCard.jsx"` — props `{ room }`.
- `import Stars from "../components/ui/Stars.jsx"` — props `{ value, size? }`.
- `import AmenityIcon from "../components/ui/AmenityIcon.jsx"` — props `{ name }`.

## Context hooks
- `useAuth()` from `../context/AuthContext.jsx` → `{ user, isAuthed, isAdmin, login({email,name}), signup, logout, updateProfile(patch) }`. `user` = `{id,name,email,role,tier,avatar,memberSince}`. Admin when email starts with "admin".
- `useBooking()` from `../context/BookingContext.jsx` → `{ draft, updateDraft(patch), resetDraft(), toggleAddon(id), confirmBooking(method)→record|null, history, setHistory, priceBreakdown(draft) }`. `draft` = `{roomId,checkIn,checkOut,guests,rooms,addons[]}`. Also exported: `ADDONS` `[{id,label,price,perNight}]`, `TAX_RATE 0.12`, `SERVICE_RATE 0.05`, `nightsBetween(in,out)`, `priceBreakdown(draft)→{room,nights,roomTotal,addonTotal,subtotal,taxes,service,discount,total,addonLines:[{label,amount,...}]}`. `confirmBooking` returns a record `{ref,roomId,roomName,roomImage,checkIn,checkOut,nights,guests,rooms,total,paymentMethod,status,bookedOn}`.
- `useWishlist()` from `../context/WishlistContext.jsx` → `{ ids, count, has(id), toggle(id), remove(id), clear() }`.
- `useNotify()` from `../context/NotificationContext.jsx` → `{ notify(title, type, body?), ... }`. type = `"success"|"info"|"warning"`.
- `useTheme()` from `../context/ThemeContext.jsx` → `{ theme, toggleTheme }`.
- `useReveal` from `../hooks/useReveal.js` → call `useReveal("key")` once.

## Data (src/data)
- `rooms.js`: `rooms[]`, `CATEGORIES[{key,label,blurb}]`, `getRoomBySlug`, `getRoomById`, `featuredRooms`, `roomsByCategory(key)`, `similarRooms(room,n)`, `isAvailable(room)`, `formatINR(n)`, `priceRange{min,max}`. room = `{id,slug,name,category,size,capacity,beds,view,price,oldPrice,rating,reviewsCount,availableCount,featured,shortDesc,description,amenities[],images[]}`.
- `hotel.js`: `hotel{name,tagline,established,phone,phoneAlt,email,address,mapEmbed,socials[{name,icon,url}]}`, `stats[{value,suffix,label}]`, `highlights[{icon,title,text}]`, `awards[{year,title,body}]`, `team[{name,role,img}]`, `story{heading,paragraphs[],image}`.
- `reviews.js`: `reviews[{id,name,location,rating,room,date,avatar,text,photo}]`, `shortTestimonials[]`, `ratingBreakdown{overall,total,categories[{label,score}],distribution[{stars,percent}]}`.
- `gallery.js`: `galleryCategories[]` (incl. "All"), `galleryImages[{id,category,title,src}]`.
- `menu.js`: `restaurants[{name,cuisine,hours,img}]`, `menuCategories[]`, `menuItems[{id,category,name,price,veg,tag,desc,img}]`.
- `admin.js`: `kpis[{label,value,delta,up,sub}]`, `monthlyData[{month,revenue,occupancy,bookings}]`, `revenueByCategory[{name,value}]`, `bookingSources[{name,value}]`, `PIE_COLORS[]`, `bookings[{id,guest,room,checkIn,checkOut,nights,amount,status}]`, `BOOKING_STATUSES[]`, `customers[{id,name,email,tier,stays,spend,location,avatar}]`, `occupancyByType[{type,occupied,total}]`.
- `images.js`: `u(id,w)` builds an Unsplash URL; `heroes[]` (photo ids — use `u(heroes[n],1600)`).

## Admin pages (inside AdminLayout sidebar — NO PageHero)
Start with `<div className="admin-page-head"><h1>…</h1><p>…</p></div>`. Reusable admin classes in AdminLayout.css: `.kpi-grid .kpi .kpi__label .kpi__value .kpi__delta(.up/.down) .kpi__sub .panel .panel__head .admin-table .table-wrap`.
Recharts in dark theme: `<ResponsiveContainer width="100%" height={300}>`, axis/text fill `#a7a39b`, grid stroke `rgba(255,255,255,0.08)`, gold series `#d4af37`. Style tooltips with `contentStyle={{background:'#14141d',border:'1px solid rgba(212,175,55,0.3)',borderRadius:12,color:'#ece9e2'}}`.
