import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {type User, getUserInfo } from "../api/userApi";
import { refreshAccessToken } from "../api/auth"; 

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
  };

  useEffect(() => {
    const restoreSession = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
        try {  
        const userData = await getUserInfo(userId);
        setUser(userData);
        console.log(userData)

      } catch (error) {
          try {

            await refreshAccessToken();
            const userData = await getUserInfo(userId);
            console.log(userData)
            setUser(userData);

          } catch (refreshError) {
            setUser(null);
              localStorage.removeItem("userId");
          }
    } finally {
      setLoading(false);
    }
    };

    restoreSession();
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