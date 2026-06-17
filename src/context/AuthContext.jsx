import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { u } from "../data/images.js";

const AuthContext = createContext(null);

const DEMO_AVATAR = u("1633332755192-727a05c4013d", 200);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("rh_user", null);

  // Dummy auth — accepts any credentials. Admin if email starts with "admin".
  const login = ({ email, name }) => {
    const isAdmin = /^admin/i.test(email || "");
    const profile = {
      id: "u_" + (email || "guest").split("@")[0],
      name: name || (email ? email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase()) : "Guest"),
      email: email || "guest@royalhotels.com",
      role: isAdmin ? "admin" : "guest",
      tier: isAdmin ? "Staff" : "Platinum",
      avatar: DEMO_AVATAR,
      memberSince: "2021",
    };
    setUser(profile);
    return profile;
  };

  const signup = (data) => login(data);
  const logout = () => setUser(null);
  const updateProfile = (patch) => setUser((u) => ({ ...u, ...patch }));

  return (
    <AuthContext.Provider
      value={{ user, isAuthed: !!user, isAdmin: user?.role === "admin", login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
