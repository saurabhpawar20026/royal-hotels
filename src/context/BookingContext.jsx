import { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { getRoomById } from "../data/rooms.js";

const BookingContext = createContext(null);

export const TAX_RATE = 0.12; // GST
export const SERVICE_RATE = 0.05; // service charge

export const ADDONS = [
  { id: "breakfast", label: "Gourmet Breakfast (per night)", price: 1500, perNight: true },
  { id: "airport", label: "Luxury Airport Transfer", price: 4500, perNight: false },
  { id: "spa", label: "Royal Spa Couples Ritual", price: 8000, perNight: false },
  { id: "dining", label: "Private Candlelit Dinner", price: 6500, perNight: false },
];

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(ms / 86400000));
}

// Full price breakdown for a draft. Returns zeros when incomplete.
export function priceBreakdown(draft) {
  const room = draft?.roomId ? getRoomById(draft.roomId) : null;
  const nights = nightsBetween(draft?.checkIn, draft?.checkOut);
  if (!room || nights <= 0) {
    return { room, nights: 0, roomTotal: 0, addonTotal: 0, subtotal: 0, taxes: 0, service: 0, discount: 0, total: 0, addonLines: [] };
  }
  const roomTotal = room.price * nights;
  const addonLines = (draft.addons || [])
    .map((id) => ADDONS.find((a) => a.id === id))
    .filter(Boolean)
    .map((a) => ({ ...a, amount: a.perNight ? a.price * nights : a.price }));
  const addonTotal = addonLines.reduce((s, a) => s + a.amount, 0);
  const subtotal = roomTotal + addonTotal;
  const discount = nights >= 3 ? Math.round(roomTotal * 0.1) : 0; // 10% off 3+ nights
  const taxedBase = subtotal - discount;
  const taxes = Math.round(taxedBase * TAX_RATE);
  const service = Math.round(taxedBase * SERVICE_RATE);
  const total = taxedBase + taxes + service;
  return { room, nights, roomTotal, addonTotal, subtotal, taxes, service, discount, total, addonLines };
}

const emptyDraft = { roomId: null, checkIn: "", checkOut: "", guests: 2, rooms: 1, addons: [] };

export function BookingProvider({ children }) {
  const [draft, setDraft] = useLocalStorage("rh_draft", emptyDraft);
  const [history, setHistory] = useLocalStorage("rh_bookings", []);

  const updateDraft = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), [setDraft]);
  const resetDraft = useCallback(() => setDraft(emptyDraft), [setDraft]);

  const toggleAddon = (id) =>
    setDraft((d) => ({
      ...d,
      addons: (d.addons || []).includes(id)
        ? d.addons.filter((a) => a !== id)
        : [...(d.addons || []), id],
    }));

  // Finalize a booking and add it to history. paymentMethod optional.
  const confirmBooking = (paymentMethod = "Card") => {
    const bd = priceBreakdown(draft);
    if (!bd.room || bd.nights <= 0) return null;
    const ref = "RH-" + Math.floor(100000 + (Date.now() % 900000));
    const record = {
      ref,
      roomId: bd.room.id,
      roomName: bd.room.name,
      roomImage: bd.room.images[0],
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      nights: bd.nights,
      guests: draft.guests,
      rooms: draft.rooms,
      total: bd.total,
      paymentMethod,
      status: "Confirmed",
      bookedOn: new Date().toISOString().slice(0, 10),
    };
    setHistory((h) => [record, ...h]);
    return record;
  };

  return (
    <BookingContext.Provider
      value={{ draft, updateDraft, resetDraft, toggleAddon, confirmBooking, history, setHistory, priceBreakdown }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
