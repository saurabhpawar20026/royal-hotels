import { createContext, useContext, useRef, useState, useCallback } from "react";

const NotificationContext = createContext(null);

const SEED = [
  { id: 1, type: "success", title: "Welcome to Royal Hotels", body: "Enjoy 15% off your first suite booking.", read: false, time: "Just now" },
  { id: 2, type: "info", title: "Spa Offer", body: "Complimentary couples massage on 2-night stays.", read: false, time: "2h ago" },
  { id: 3, type: "info", title: "New Restaurant", body: "Sky Lounge 28 is now open for reservations.", read: true, time: "1d ago" },
];

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [list, setList] = useState(SEED);
  const counter = useRef(100);

  const notify = useCallback((title, type = "success", body = "") => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, title, type, body }]);
    setList((l) => [{ id, type, title, body, read: false, time: "Just now" }, ...l]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  const markAllRead = () => setList((l) => l.map((n) => ({ ...n, read: true })));
  const unread = list.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ toasts, list, unread, notify, dismissToast, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotify = () => useContext(NotificationContext);
