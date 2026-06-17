// Curated Unsplash imagery for Royal Hotels.
// u(id, w) builds an optimized Unsplash URL at a given width.
export const u = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Hero / brand backgrounds
export const heroes = [
  "1566073771259-6a8506099945", // resort facade dusk
  "1571003123894-1f0594d2b5d9", // infinity pool
  "1582719508461-905c673771fd", // suite
  "1542314831-068cd1dbfeeb", // resort pool palms
];

// Room photography pools (reused across the catalogue)
export const roomShots = [
  "1611892440504-42a792e24d32",
  "1631049307264-da0ec9d70304",
  "1590490360182-c33d57733427",
  "1578683010236-d716f9a3f461",
  "1618773928121-c32242e63f39",
  "1582719478250-c89cae4dc85b",
  "1591088398332-8a7791972843",
  "1566665797739-1674de7a421a",
  "1505693416388-ac5ce068fe85",
  "1611048267451-e6ed903d4a38",
  "1560448204-e02f11c3d0e2",
  "1560185007-cde436f6a4d0",
  "1582719508461-905c673771fd",
  "1571896349842-33c89424de2d",
  "1606046604972-77cc76aee944",
  "1631049035182-249067d7618e",
  "1614518921956-0b9d2c2c4e0c",
  "1596394516093-501ba68a0ba6",
  "1551882547-ff40c63fe5fa",
  "1564501049412-61c2a3083791",
];

export const bathShots = ["1584622650111-993a426fbf0a", "1620626011761-996317b8d101", "1507652313519-d4e9174996dd"];
export const viewShots = ["1507525428034-b723cf961d3e", "1505228395891-9a51e7e86bf6", "1540541338287-41700207dee6"];
