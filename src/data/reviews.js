import { u } from "./images.js";

export const reviews = [
  {
    id: 1, name: "Priya Nair", location: "Bengaluru, India", rating: 5, room: "Honeymoon Pool Villa",
    date: "May 2025", avatar: u("1494790108377-be9c29b29330", 200),
    text:
      "Our honeymoon was nothing short of magical. The private plunge pool, the rose-petal turndown, the sunset champagne — every detail was orchestrated to perfection. The butler remembered our names and preferences from day one.",
    photo: u("1582719508461-905c673771fd", 800),
  },
  {
    id: 2, name: "James Whitfield", location: "London, UK", rating: 5, room: "Royal Presidential Suite",
    date: "April 2025", avatar: u("1500648767791-00dcc994a43e", 200),
    text:
      "I travel for business 200 nights a year and few hotels truly impress me. Royal Hotels did. The Presidential Suite, the seamless service, the Michelin dining — this is hospitality at its absolute finest.",
    photo: u("1542314831-068cd1dbfeeb", 800),
  },
  {
    id: 3, name: "Aisha Khan", location: "Dubai, UAE", rating: 5, room: "Premium Ocean Suite",
    date: "March 2025", avatar: u("1438761681033-6461ffad8d80", 200),
    text:
      "Waking up to the ocean from a freestanding tub by the window is something I'll never forget. The spa was world-class and the staff anticipated needs I didn't even know I had.",
    photo: u("1571003123894-1f0594d2b5d9", 800),
  },
  {
    id: 4, name: "Rajesh & Meera Iyer", location: "Chennai, India", rating: 5, room: "Royal Family Suite",
    date: "February 2025", avatar: u("1507003211169-0a1dd7228f2d", 200),
    text:
      "Travelling with two children is never easy, but the Family Suite made it effortless. The kids' nook, the welcome amenities, the patient staff — our whole family left relaxed and happy.",
    photo: u("1566073771259-6a8506099945", 800),
  },
  {
    id: 5, name: "Sophie Laurent", location: "Paris, France", rating: 4, room: "Executive Skyline Room",
    date: "January 2025", avatar: u("1534528741775-53994a69daeb", 200),
    text:
      "An exquisite stay. The Executive Lounge was a haven and the skyline views at dusk were breathtaking. A touch more variety at breakfast would make it flawless, but I will absolutely return.",
    photo: u("1618773928121-c32242e63f39", 800),
  },
  {
    id: 6, name: "Daniel Okafor", location: "Lagos, Nigeria", rating: 5, room: "Premium Spa Suite",
    date: "December 2024", avatar: u("1506794778202-cad84cf45f1d", 200),
    text:
      "The wellness-led suite changed how I think about hotels. In-suite steam shower, aromatherapy turndown, direct spa access — I left feeling completely restored. Impeccable in every way.",
    photo: u("1590490360182-c33d57733427", 800),
  },
];

// Compact testimonials used in marquee / home strip
export const shortTestimonials = reviews.map((r) => ({
  id: r.id, name: r.name, location: r.location, rating: r.rating, avatar: r.avatar,
  text: r.text.length > 160 ? r.text.slice(0, 157) + "…" : r.text,
}));

export const ratingBreakdown = {
  overall: 4.9,
  total: 3284,
  categories: [
    { label: "Cleanliness", score: 4.9 },
    { label: "Service", score: 5.0 },
    { label: "Location", score: 4.8 },
    { label: "Amenities", score: 4.9 },
    { label: "Value", score: 4.6 },
    { label: "Dining", score: 4.9 },
  ],
  distribution: [
    { stars: 5, percent: 88 },
    { stars: 4, percent: 9 },
    { stars: 3, percent: 2 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 0 },
  ],
};
