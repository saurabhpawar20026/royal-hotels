import { u } from "./images.js";

export const restaurants = [
  { name: "The Gold Room", cuisine: "Modern French · Fine Dining", hours: "7:00 PM – 11:30 PM", img: u("1517248135467-4c7edcad34c4", 800) },
  { name: "Saffron & Sea", cuisine: "Coastal Indian Seafood", hours: "12:30 PM – 11:00 PM", img: u("1414235077428-338989a2e8c0", 800) },
  { name: "Sky Lounge 28", cuisine: "Rooftop Bar & Tapas", hours: "5:00 PM – 1:00 AM", img: u("1551218808-94e220e084d2", 800) },
];

export const menuCategories = ["Signature", "Appetizers", "Main Course", "Desserts", "Beverages"];

export const menuItems = [
  // Signature
  { id: 1, category: "Signature", name: "Royal Saffron Risotto", price: 1850, veg: true, tag: "Chef's Special",
    desc: "Carnaroli rice, Kashmiri saffron, aged parmesan, gold leaf.", img: u("1476124369491-e7addf5db371", 600) },
  { id: 2, category: "Signature", name: "Lobster Thermidor Royale", price: 3400, veg: false, tag: "Most Loved",
    desc: "Whole lobster, brandy cream, gruyère gratin, micro herbs.", img: u("1559742811-822873691df8", 600) },
  { id: 3, category: "Signature", name: "Truffle Wagyu Tenderloin", price: 4200, veg: false, tag: "Premium",
    desc: "A5 wagyu, black truffle jus, pommes purée, charred asparagus.", img: u("1546833999-b9f581a1996d", 600) },
  // Appetizers
  { id: 4, category: "Appetizers", name: "Burrata & Heirloom Tomato", price: 1250, veg: true, tag: "",
    desc: "Creamy burrata, basil oil, aged balsamic pearls.", img: u("1505253716362-afaea1d3d1af", 600) },
  { id: 5, category: "Appetizers", name: "Seared Scallops", price: 1650, veg: false, tag: "",
    desc: "Pan-seared scallops, cauliflower velouté, crispy pancetta.", img: u("1432139509613-5c4255815697", 600) },
  { id: 6, category: "Appetizers", name: "Tandoori Paneer Tikka", price: 950, veg: true, tag: "",
    desc: "Clay-oven cottage cheese, mint chutney, charred peppers.", img: u("1567188040759-fb8a883dc6d8", 600) },
  // Main Course
  { id: 7, category: "Main Course", name: "Butter Chicken Royale", price: 1450, veg: false, tag: "Most Loved",
    desc: "Slow-cooked chicken, velvet tomato gravy, fenugreek butter.", img: u("1603894584373-5ac82b2ae398", 600) },
  { id: 8, category: "Main Course", name: "Dal Royal Bukhara", price: 1100, veg: true, tag: "",
    desc: "Black lentils simmered overnight, cream, smoked butter.", img: u("1546833999-b9f581a1996d", 600) },
  { id: 9, category: "Main Course", name: "Grilled Sea Bass", price: 2350, veg: false, tag: "",
    desc: "Mediterranean sea bass, saffron beurre blanc, fennel.", img: u("1519708227418-c8fd9a32b7a2", 600) },
  // Desserts
  { id: 10, category: "Desserts", name: "Gold Leaf Chocolate Sphere", price: 950, veg: true, tag: "Signature",
    desc: "Dark chocolate dome, warm salted caramel, 24k gold.", img: u("1606313564200-e75d5e30476c", 600) },
  { id: 11, category: "Desserts", name: "Rose & Pistachio Kulfi", price: 750, veg: true, tag: "",
    desc: "Traditional slow-churned kulfi, rose syrup, pistachio.", img: u("1488477181946-6428a0291777", 600) },
  { id: 12, category: "Desserts", name: "Crème Brûlée Trio", price: 850, veg: true, tag: "",
    desc: "Vanilla bean, espresso and saffron custards, brittle sugar.", img: u("1470124182917-cc6e71b22ecc", 600) },
  // Beverages
  { id: 13, category: "Beverages", name: "Royal Gold Martini", price: 1250, veg: true, tag: "Bar Favourite",
    desc: "Premium gin, dry vermouth, edible gold dust, citrus twist.", img: u("1514362545857-3bc16c4c7d1b", 600) },
  { id: 14, category: "Beverages", name: "Saffron Cardamom Chai", price: 450, veg: true, tag: "",
    desc: "Hand-blended chai, saffron, green cardamom, honey.", img: u("1571934811356-5cc061b6821f", 600) },
  { id: 15, category: "Beverages", name: "Vintage Champagne (Glass)", price: 2200, veg: true, tag: "Premium",
    desc: "Grande cuvée brut, fine persistent bead, brioche notes.", img: u("1510812431401-41d2bd2722f3", 600) },
];
