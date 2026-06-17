import { u } from "./images.js";

export const hotel = {
  name: "Royal Hotels",
  tagline: "Timeless Luxury, Redefined",
  established: 1928,
  phone: "+91 98765 43210",
  phoneAlt: "+91 22 4000 8000",
  email: "reservations@royalhotels.com",
  address: "1 Marine Drive, South Mumbai, Maharashtra 400020, India",
  mapEmbed:
    "https://www.google.com/maps?q=Marine+Drive+Mumbai&output=embed",
  socials: [
    { name: "Instagram", icon: "instagram", url: "https://instagram.com" },
    { name: "Facebook", icon: "facebook", url: "https://facebook.com" },
    { name: "Twitter", icon: "twitter", url: "https://twitter.com" },
    { name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com" },
    { name: "YouTube", icon: "youtube", url: "https://youtube.com" },
  ],
};

export const stats = [
  { value: "96", suffix: "", label: "Years of Heritage" },
  { value: "1.2", suffix: "M+", label: "Guests Hosted" },
  { value: "48", suffix: "", label: "Global Awards" },
  { value: "4.9", suffix: "/5", label: "Guest Rating" },
];

export const highlights = [
  {
    icon: "spa",
    title: "Royal Spa & Wellness",
    text: "A 12,000 sq.ft sanctuary of Ayurvedic rituals, hydrotherapy pools and master therapists.",
  },
  {
    icon: "dining",
    title: "Michelin-Starred Dining",
    text: "Seven restaurants and bars led by world-renowned chefs, from coastal seafood to fine French.",
  },
  {
    icon: "pool",
    title: "Infinity Pools",
    text: "Three temperature-controlled infinity pools cascading toward an uninterrupted ocean horizon.",
  },
  {
    icon: "concierge",
    title: "24-Hour Butler Service",
    text: "Anticipatory, discreet and personal — your dedicated butler orchestrates every detail.",
  },
  {
    icon: "car",
    title: "Chauffeured Fleet",
    text: "A fleet of Rolls-Royce and Mercedes-Maybach for airport transfers and city excursions.",
  },
  {
    icon: "events",
    title: "Grand Ballrooms",
    text: "Pillarless ballrooms and garden lawns for weddings and galas of up to 1,200 guests.",
  },
];

export const awards = [
  { year: "2025", title: "World's Leading Luxury Hotel", body: "World Travel Awards" },
  { year: "2024", title: "Forbes Five-Star Rating", body: "Forbes Travel Guide" },
  { year: "2024", title: "Best Hotel Spa in Asia", body: "Condé Nast Traveller" },
  { year: "2023", title: "Top 10 City Hotels Worldwide", body: "Travel + Leisure" },
  { year: "2023", title: "Two Michelin Stars", body: "Michelin Guide" },
  { year: "2022", title: "Hotel of the Year", body: "Luxury Travel Intelligence" },
];

export const team = [
  { name: "Vikram Rathore", role: "General Manager", img: u("1560250097-0b93528c311a", 600) },
  { name: "Ananya Sharma", role: "Director of Guest Experience", img: u("1573496359142-b8d87734a5a2", 600) },
  { name: "Rohan Mehta", role: "Executive Chef", img: u("1577219491135-ce391730fb2c", 600) },
  { name: "Isabella Rossi", role: "Spa & Wellness Director", img: u("1580489944761-15a19d654956", 600) },
];

export const story = {
  heading: "A Legacy of Grace Since 1928",
  paragraphs: [
    "What began as a single seafront mansion overlooking the Arabian Sea has, over nearly a century, become a byword for refined Indian hospitality. Royal Hotels was founded on a simple belief: that a guest should feel not merely accommodated, but genuinely cherished.",
    "Across decades we have welcomed maharajas and movie stars, diplomats and dreamers — each greeted with the same warmth, discretion and artistry. Our spaces marry colonial-era grandeur with contemporary design, and our service remains gloriously, unfailingly personal.",
    "Today, Royal Hotels stands among the world's most celebrated luxury collections, yet our soul is unchanged: timeless luxury, redefined for every generation that walks through our doors.",
  ],
  image: u("1564501049412-61c2a3083791", 1400),
};
