import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage("rh_wishlist", []);

  const has = (id) => ids.includes(id);
  const toggle = (id) =>
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const remove = (id) => setIds((cur) => cur.filter((x) => x !== id));
  const clear = () => setIds([]);

  return (
    <WishlistContext.Provider value={{ ids, count: ids.length, has, toggle, remove, clear }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
