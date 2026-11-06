import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type User, getCurrentUser } from "../api/userApi";
import { ApiError, API_URL } from "../api/http";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");

    fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  };

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {

        const me = await getCurrentUser();
        if (!cancelled) setUser(me);
      } catch (err) {

        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          localStorage.removeItem("userId");
          if (!cancelled) setUser(null);
        } else {
          console.error("Session restore failed (not an auth error):", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};