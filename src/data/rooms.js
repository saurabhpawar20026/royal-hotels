import { u, roomShots } from "./images.js";

// Build a gallery of n images starting at an offset within the shared pool.
const gallery = (offset, n = 4) =>
  Array.from({ length: n }, (_, i) => u(roomShots[(offset + i) % roomShots.length], 1400));

export const CATEGORIES = [
  { key: "deluxe", label: "Deluxe Rooms", blurb: "Refined comfort with city or garden vistas." },
  { key: "executive", label: "Executive Rooms", blurb: "Elevated workspaces for the modern traveller." },
  { key: "premium", label: "Premium Rooms", blurb: "Indulgent interiors and panoramic outlooks." },
  { key: "family", label: "Family Suites", blurb: "Spacious sanctuaries crafted for togetherness." },
  { key: "honeymoon", label: "Honeymoon Suites", blurb: "Romantic retreats for unforgettable beginnings." },
  { key: "presidential", label: "Presidential Suites", blurb: "The pinnacle of opulence and privacy." },
];

const BASE_AMENITIES = [
  "Free WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "Room Service", "In-room Safe", "Coffee Machine",
];

export const rooms = [
  // ---------------- DELUXE (4) ----------------
  {
    id: "deluxe-101", slug: "deluxe-garden-room", name: "Deluxe Garden Room", category: "deluxe",
    size: 380, capacity: 2, beds: "1 King Bed", view: "Garden View",
    price: 14500, oldPrice: 17000, rating: 4.7, reviewsCount: 214, availableCount: 6, featured: true,
    shortDesc: "Serene garden-facing comfort with handcrafted teak furnishings.",
    description:
      "A graceful 380 sq.ft retreat opening onto manicured tropical gardens. The Deluxe Garden Room pairs handcrafted teak furnishings with plush linens, a marble bath, and a private sit-out where mornings begin with birdsong and freshly brewed coffee.",
    amenities: [...BASE_AMENITIES, "Bathtub", "Rain Shower", "Private Balcony", "Daily Housekeeping"],
    images: gallery(0),
  },
  {
    id: "deluxe-102", slug: "deluxe-city-room", name: "Deluxe City Room", category: "deluxe",
    size: 360, capacity: 2, beds: "2 Twin Beds", view: "City View",
    price: 13800, oldPrice: 16000, rating: 4.6, reviewsCount: 188, availableCount: 4, featured: false,
    shortDesc: "Contemporary elegance overlooking the glittering skyline.",
    description:
      "Floor-to-ceiling windows frame the city skyline in this 360 sq.ft sanctuary. Warm woods, brushed-gold accents and a curated minibar make the Deluxe City Room an ideal base for discerning urban travellers.",
    amenities: [...BASE_AMENITIES, "Rain Shower", "Workspace", "Blackout Curtains", "Daily Housekeeping"],
    images: gallery(2),
  },
  {
    id: "deluxe-103", slug: "deluxe-poolside-room", name: "Deluxe Poolside Room", category: "deluxe",
    size: 400, capacity: 3, beds: "1 King + Daybed", view: "Pool View",
    price: 16200, oldPrice: 18500, rating: 4.8, reviewsCount: 263, availableCount: 0, featured: true,
    shortDesc: "Direct lagoon-pool access steps from your private terrace.",
    description:
      "Step from your terrace straight into the shimmering lagoon pool. This 400 sq.ft poolside haven features a deep soaking tub, a daybed for lazy afternoons, and uninterrupted views of turquoise water fringed by palms.",
    amenities: [...BASE_AMENITIES, "Bathtub", "Private Terrace", "Pool Access", "Daily Housekeeping"],
    images: gallery(4),
  },
  {
    id: "deluxe-104", slug: "deluxe-courtyard-room", name: "Deluxe Courtyard Room", category: "deluxe",
    size: 370, capacity: 2, beds: "1 Queen Bed", view: "Courtyard View",
    price: 13200, oldPrice: 15500, rating: 4.5, reviewsCount: 142, availableCount: 8, featured: false,
    shortDesc: "Quiet heritage courtyard charm with modern indulgences.",
    description:
      "Overlooking a tranquil heritage courtyard, this 370 sq.ft room is a study in understated luxury — handwoven rugs, a writing desk, and a marble bath with premium amenities for a restful, unhurried stay.",
    amenities: [...BASE_AMENITIES, "Rain Shower", "Workspace", "Daily Housekeeping"],
    images: gallery(6),
  },

  // ---------------- EXECUTIVE (4) ----------------
  {
    id: "exec-201", slug: "executive-skyline-suite", name: "Executive Skyline Room", category: "executive",
    size: 520, capacity: 2, beds: "1 King Bed", view: "Skyline View",
    price: 21500, oldPrice: 24500, rating: 4.8, reviewsCount: 198, availableCount: 5, featured: true,
    shortDesc: "Executive Lounge access with sweeping skyline panoramas.",
    description:
      "A 520 sq.ft executive haven with complimentary access to the Royal Executive Lounge, evening cocktails, and dedicated check-in. An ergonomic workspace and Nespresso bar keep you productive in absolute comfort.",
    amenities: [...BASE_AMENITIES, "Executive Lounge", "Workspace", "Bathtub", "Butler on Call", "Breakfast Included"],
    images: gallery(8),
  },
  {
    id: "exec-202", slug: "executive-club-room", name: "Executive Club Room", category: "executive",
    size: 500, capacity: 2, beds: "1 King Bed", view: "City View",
    price: 20200, oldPrice: 23000, rating: 4.7, reviewsCount: 176, availableCount: 3, featured: false,
    shortDesc: "Club privileges, premium workspace and curated turndown.",
    description:
      "Designed for the business elite, the 500 sq.ft Executive Club Room offers club-floor privileges, a spacious workspace, high-speed connectivity and a nightly turndown ritual with artisanal chocolates.",
    amenities: [...BASE_AMENITIES, "Executive Lounge", "Workspace", "Rain Shower", "Breakfast Included"],
    images: gallery(10),
  },
  {
    id: "exec-203", slug: "executive-corner-room", name: "Executive Corner Room", category: "executive",
    size: 540, capacity: 3, beds: "1 King + Sofa Bed", view: "Panoramic Corner View",
    price: 22800, oldPrice: 26000, rating: 4.9, reviewsCount: 221, availableCount: 2, featured: true,
    shortDesc: "Dual-aspect corner windows and a private lounge nook.",
    description:
      "Wrapped in glass on two sides, this 540 sq.ft corner room floods with natural light and frames panoramic views. A private lounge nook and rainfall shower complete this sought-after address.",
    amenities: [...BASE_AMENITIES, "Executive Lounge", "Workspace", "Bathtub", "Lounge Nook", "Breakfast Included"],
    images: gallery(12),
  },
  {
    id: "exec-204", slug: "executive-business-room", name: "Executive Business Room", category: "executive",
    size: 480, capacity: 2, beds: "1 King Bed", view: "City View",
    price: 19500, oldPrice: 22000, rating: 4.6, reviewsCount: 154, availableCount: 7, featured: false,
    shortDesc: "Purpose-built for productivity with smart-room controls.",
    description:
      "The 480 sq.ft Executive Business Room blends comfort and capability — smart-room lighting controls, a large desk, ergonomic seating and lightning-fast WiFi, with the Executive Lounge moments away.",
    amenities: [...BASE_AMENITIES, "Executive Lounge", "Workspace", "Smart Controls", "Breakfast Included"],
    images: gallery(14),
  },

  // ---------------- PREMIUM (4) ----------------
  {
    id: "prem-301", slug: "premium-ocean-suite", name: "Premium Ocean Suite", category: "premium",
    size: 640, capacity: 3, beds: "1 King + Sofa Bed", view: "Ocean View",
    price: 29500, oldPrice: 34000, rating: 4.9, reviewsCount: 287, availableCount: 4, featured: true,
    shortDesc: "Floor-to-ceiling ocean views with a private soaking tub.",
    description:
      "A 640 sq.ft premium suite where the horizon becomes your art. Wake to sunrise over the ocean, soak in a freestanding tub by the window, and unwind on a private balcony with a chilled glass of champagne.",
    amenities: [...BASE_AMENITIES, "Bathtub", "Private Balcony", "Butler on Call", "Breakfast Included", "Nespresso Bar"],
    images: gallery(1),
  },
  {
    id: "prem-302", slug: "premium-panorama-suite", name: "Premium Panorama Suite", category: "premium",
    size: 620, capacity: 3, beds: "1 King + Sofa Bed", view: "Panoramic View",
    price: 28200, oldPrice: 32500, rating: 4.8, reviewsCount: 209, availableCount: 3, featured: false,
    shortDesc: "Wrap-around vistas and a separate living lounge.",
    description:
      "This 620 sq.ft suite offers a separate living lounge, wrap-around windows and bespoke furnishings. Ideal for travellers who refuse to compromise on space, light or service.",
    amenities: [...BASE_AMENITIES, "Bathtub", "Living Lounge", "Butler on Call", "Breakfast Included"],
    images: gallery(3),
  },
  {
    id: "prem-303", slug: "premium-spa-suite", name: "Premium Spa Suite", category: "premium",
    size: 660, capacity: 2, beds: "1 King Bed", view: "Garden & Spa View",
    price: 31000, oldPrice: 35500, rating: 4.9, reviewsCount: 176, availableCount: 0, featured: true,
    shortDesc: "In-suite spa amenities and a private steam shower.",
    description:
      "A wellness-led 660 sq.ft retreat featuring an in-suite steam shower, aromatherapy turndown and direct access to the Royal Spa. Designed to restore body and mind in equal measure.",
    amenities: [...BASE_AMENITIES, "Steam Shower", "Bathtub", "Spa Access", "Breakfast Included", "Yoga Mat"],
    images: gallery(5),
  },
  {
    id: "prem-304", slug: "premium-terrace-suite", name: "Premium Terrace Suite", category: "premium",
    size: 700, capacity: 4, beds: "1 King + 1 Queen", view: "Terrace & Skyline View",
    price: 32500, oldPrice: 37000, rating: 4.8, reviewsCount: 162, availableCount: 5, featured: false,
    shortDesc: "Expansive private terrace with an outdoor lounge.",
    description:
      "The 700 sq.ft Premium Terrace Suite extends your living space outdoors with a sprawling private terrace, plush loungers and a dining nook beneath the stars — luxury without limits.",
    amenities: [...BASE_AMENITIES, "Private Terrace", "Outdoor Lounge", "Bathtub", "Breakfast Included"],
    images: gallery(7),
  },

  // ---------------- FAMILY SUITES (3) ----------------
  {
    id: "fam-401", slug: "royal-family-suite", name: "Royal Family Suite", category: "family",
    size: 880, capacity: 5, beds: "2 King + Bunk Nook", view: "Garden View",
    price: 38500, oldPrice: 44000, rating: 4.9, reviewsCount: 241, availableCount: 3, featured: true,
    shortDesc: "Two bedrooms, a kids' nook and a generous living area.",
    description:
      "An 880 sq.ft two-bedroom sanctuary built for family memories. A dedicated children's bunk nook, a spacious living area and thoughtful childproofing let the whole family relax in elegant comfort.",
    amenities: [...BASE_AMENITIES, "Two Bathrooms", "Kids' Nook", "Living Area", "Breakfast Included", "Kids' Amenities"],
    images: gallery(9),
  },
  {
    id: "fam-402", slug: "garden-family-suite", name: "Garden Family Suite", category: "family",
    size: 820, capacity: 4, beds: "1 King + 2 Singles", view: "Garden View",
    price: 35500, oldPrice: 40000, rating: 4.7, reviewsCount: 168, availableCount: 4, featured: false,
    shortDesc: "Ground-level suite opening to a private lawn.",
    description:
      "This 820 sq.ft ground-level suite opens onto a private lawn where children can play in safety. Connecting bedrooms and a cosy lounge make family togetherness effortless.",
    amenities: [...BASE_AMENITIES, "Private Lawn", "Connecting Rooms", "Living Area", "Breakfast Included"],
    images: gallery(11),
  },
  {
    id: "fam-403", slug: "duplex-family-suite", name: "Duplex Family Suite", category: "family",
    size: 950, capacity: 6, beds: "2 King + Sofa Beds", view: "Pool View",
    price: 42500, oldPrice: 48000, rating: 4.8, reviewsCount: 133, availableCount: 0, featured: true,
    shortDesc: "Two-storey living with a private pool-view balcony.",
    description:
      "Spanning two storeys and 950 sq.ft, the Duplex Family Suite offers separate sleeping and living levels, a pool-view balcony and dining for six — the ultimate base for multigenerational getaways.",
    amenities: [...BASE_AMENITIES, "Two Floors", "Two Bathrooms", "Dining Area", "Breakfast Included", "Pool Access"],
    images: gallery(13),
  },

  // ---------------- HONEYMOON SUITES (3) ----------------
  {
    id: "honey-501", slug: "honeymoon-pool-villa", name: "Honeymoon Pool Villa", category: "honeymoon",
    size: 780, capacity: 2, beds: "1 King Bed", view: "Private Pool & Ocean",
    price: 46500, oldPrice: 53000, rating: 5.0, reviewsCount: 312, availableCount: 2, featured: true,
    shortDesc: "Private plunge pool, rose-petal turndown and ocean sunsets.",
    description:
      "A 780 sq.ft villa of pure romance — a private plunge pool, a canopy bed, and sunsets that melt into the ocean. Arrive to rose-petal turndown, sparkling wine and a couples' spa welcome.",
    amenities: [...BASE_AMENITIES, "Private Plunge Pool", "Bathtub for Two", "Couples Spa", "Champagne Welcome", "Butler on Call"],
    images: gallery(15),
  },
  {
    id: "honey-502", slug: "romance-sky-suite", name: "Romance Sky Suite", category: "honeymoon",
    size: 720, capacity: 2, beds: "1 King Bed", view: "Skyline View",
    price: 41000, oldPrice: 47000, rating: 4.9, reviewsCount: 198, availableCount: 3, featured: false,
    shortDesc: "Candlelit terrace dining high above the city lights.",
    description:
      "Perched high above the city, this 720 sq.ft suite sets the stage for romance with a candlelit terrace, a deep twin soaking tub and a private dinner curated by our chef under the stars.",
    amenities: [...BASE_AMENITIES, "Twin Soaking Tub", "Private Terrace", "Candlelit Dining", "Champagne Welcome"],
    images: gallery(17),
  },
  {
    id: "honey-503", slug: "secret-garden-suite", name: "Secret Garden Suite", category: "honeymoon",
    size: 760, capacity: 2, beds: "1 King Bed", view: "Private Garden View",
    price: 43500, oldPrice: 49000, rating: 5.0, reviewsCount: 156, availableCount: 0, featured: true,
    shortDesc: "A walled tropical garden with an outdoor rain shower.",
    description:
      "Hidden behind walls of bougainvillea, this 760 sq.ft suite features a private tropical garden, an outdoor rain shower and a daybed built for two — a secluded paradise for newlyweds.",
    amenities: [...BASE_AMENITIES, "Private Garden", "Outdoor Shower", "Bathtub for Two", "Couples Spa", "Butler on Call"],
    images: gallery(0),
  },

  // ---------------- PRESIDENTIAL SUITES (2) ----------------
  {
    id: "pres-601", slug: "royal-presidential-suite", name: "Royal Presidential Suite", category: "presidential",
    size: 1650, capacity: 4, beds: "2 King Bedrooms", view: "360° Panoramic View",
    price: 95000, oldPrice: 110000, rating: 5.0, reviewsCount: 89, availableCount: 1, featured: true,
    shortDesc: "The crown jewel — two bedrooms, private gym, dedicated butler.",
    description:
      "Occupying the top floor, the 1650 sq.ft Royal Presidential Suite is the address heads of state choose. Two master bedrooms, a private gym, a grand living and dining room, a wraparound terrace and a 24-hour dedicated butler define the pinnacle of luxury.",
    amenities: [...BASE_AMENITIES, "Private Gym", "Dedicated Butler", "Grand Living Room", "Private Dining", "Wraparound Terrace", "Limousine Transfer"],
    images: gallery(4),
  },
  {
    id: "pres-602", slug: "imperial-presidential-suite", name: "Imperial Presidential Suite", category: "presidential",
    size: 1480, capacity: 4, beds: "2 King Bedrooms", view: "Ocean & Skyline View",
    price: 88000, oldPrice: 102000, rating: 5.0, reviewsCount: 74, availableCount: 1, featured: true,
    shortDesc: "Imperial grandeur with a private spa and home cinema.",
    description:
      "A 1480 sq.ft palace in the sky featuring a private in-suite spa, a home cinema, a baby-grand piano and panoramic ocean-meets-skyline views. Every detail is orchestrated by your personal butler and private chef on request.",
    amenities: [...BASE_AMENITIES, "Private Spa", "Home Cinema", "Dedicated Butler", "Private Chef on Request", "Grand Terrace", "Limousine Transfer"],
    images: gallery(8),
  },
];

// ---- Helpers used across the app ----
export const getRoomBySlug = (slug) => rooms.find((r) => r.slug === slug);
export const getRoomById = (id) => rooms.find((r) => r.id === id);
export const featuredRooms = rooms.filter((r) => r.featured);
export const roomsByCategory = (key) => rooms.filter((r) => r.category === key);
export const similarRooms = (room, n = 3) =>
  rooms.filter((r) => r.category === room.category && r.id !== room.id).slice(0, n);
export const isAvailable = (room) => room.availableCount > 0;
export const formatINR = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
export const priceRange = (() => {
  const prices = rooms.map((r) => r.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
})();
