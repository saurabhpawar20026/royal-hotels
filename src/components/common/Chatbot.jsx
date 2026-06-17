import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane, FaCrown } from "react-icons/fa";
import "./Chatbot.css";

// Lightweight rule-based concierge. Matches keywords -> canned replies.
const KNOWLEDGE = [
  { k: ["book", "reserve", "reservation", "availability"], a: "I'd be delighted to help you book! Browse our Rooms & Suites and tap “Book Now”, or tell me your dates and I'll guide you.", cta: { label: "Browse Rooms", to: "/rooms" } },
  { k: ["price", "cost", "rate", "how much", "cheap", "expensive"], a: "Our rooms range from ₹13,200/night for a Deluxe Room to ₹95,000/night for the Royal Presidential Suite. Stays of 3+ nights enjoy a 10% discount.", cta: { label: "See Pricing", to: "/rooms" } },
  { k: ["honeymoon", "romantic", "couple", "anniversary"], a: "How wonderful! Our Honeymoon Suites feature private plunge pools, candlelit dining and rose-petal turndown. The Honeymoon Pool Villa is our most-loved.", cta: { label: "Honeymoon Suites", to: "/rooms" } },
  { k: ["family", "kids", "children"], a: "Our Family Suites offer up to 6 guests, kids' nooks and connecting rooms — perfect for the whole family.", cta: { label: "Family Suites", to: "/rooms" } },
  { k: ["restaurant", "food", "dine", "dining", "eat", "menu"], a: "We have three signature venues including the two-Michelin-starred Gold Room. Shall I show you the menu?", cta: { label: "View Dining", to: "/restaurant" } },
  { k: ["spa", "wellness", "massage"], a: "The Royal Spa is a 12,000 sq.ft sanctuary of Ayurvedic rituals and hydrotherapy. Spa access is included with Premium and Honeymoon suites." },
  { k: ["pool", "swim"], a: "We feature three temperature-controlled infinity pools cascading toward the ocean, plus private plunge pools in select villas." },
  { k: ["location", "where", "address", "reach", "airport"], a: "We're located at 1 Marine Drive, South Mumbai — 25 minutes from the international airport. Complimentary limousine transfers are available.", cta: { label: "Contact & Map", to: "/contact" } },
  { k: ["pay", "payment", "upi", "card"], a: "We accept UPI, Credit/Debit Cards, Net Banking, Wallets and Pay-at-Hotel. All payments are fully secured." },
  { k: ["cancel", "refund", "policy"], a: "Free cancellation up to 48 hours before check-in. Check-in is 2 PM and check-out is 12 noon." },
  { k: ["hi", "hello", "hey", "namaste"], a: "Namaste! 🙏 Welcome to Royal Hotels. I'm your personal concierge. How may I make your stay extraordinary today?" },
  { k: ["thank", "thanks"], a: "It's my absolute pleasure. Is there anything else I can arrange for you?" },
];

const QUICK = ["Book a room", "Pricing", "Honeymoon suites", "Dining", "Location"];

const reply = (text) => {
  const t = text.toLowerCase();
  const hit = KNOWLEDGE.find((e) => e.k.some((kw) => t.includes(kw)));
  return hit || { a: "I'd be happy to help with rooms, dining, the spa, bookings or directions. You may also reach our concierge at +91 98765 43210." };
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Namaste! 🙏 I'm Aria, your Royal Hotels concierge. How may I assist you today?" },
  ]);
  const navigate = useNavigate();
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, open]);

  const send = (text) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setInput("");
    setMsgs((m) => [...m, { from: "user", text: value }]);
    setTimeout(() => {
      const r = reply(value);
      setMsgs((m) => [...m, { from: "bot", text: r.a, cta: r.cta }]);
    }, 480);
  };

  return (
    <>
      <button className={`chatbot-fab ${open ? "hidden" : ""}`} onClick={() => setOpen(true)} aria-label="Open concierge chat">
        <FaRobot />
        <span className="chatbot-fab__pulse" />
      </button>

      <div className={`chatbot ${open ? "open" : ""}`}>
        <div className="chatbot__head">
          <div className="chatbot__id">
            <span className="chatbot__avatar"><FaCrown /></span>
            <div>
              <strong>Aria · Concierge</strong>
              <span className="chatbot__status">Online · replies instantly</span>
            </div>
          </div>
          <button className="chatbot__close" onClick={() => setOpen(false)} aria-label="Close chat"><FaTimes /></button>
        </div>

        <div className="chatbot__body" ref={bodyRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`chat-msg chat-msg--${m.from}`}>
              <div className="chat-bubble">{m.text}</div>
              {m.cta && (
                <button className="chat-cta" onClick={() => { navigate(m.cta.to); setOpen(false); }}>
                  {m.cta.label} →
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="chatbot__quick">
          {QUICK.map((q) => (
            <button key={q} onClick={() => send(q)}>{q}</button>
          ))}
        </div>

        <form className="chatbot__input" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything…"
            aria-label="Message"
          />
          <button type="submit" className="btn btn-gold" aria-label="Send"><FaPaperPlane /></button>
        </form>
      </div>
    </>
  );
}
