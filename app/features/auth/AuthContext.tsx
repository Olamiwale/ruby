'use client';

import { createContext, useContext, useState, useEffect } from "react";
import api from "../../lib/api/api.js";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const setAccessTokenCookie = (token: string) => {
  document.cookie = `accessToken=${token}; path=/; max-age=900; SameSite=Lax; domain=.mapbyruby.com`;
};

const clearAccessTokenCookie = () => {
  document.cookie = `accessToken=; path=/; max-age=0 domain=.mapbyruby.com`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get("/auth/me");
        const { user, accessToken } = res.data.data;
        setUser(user);
        setAccessToken(accessToken);
        setAccessTokenCookie(accessToken);
      } catch {
        setUser(null);
        setAccessToken(null);
        clearAccessTokenCookie();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    setAccessTokenCookie(token);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      setUser(null);
      setAccessToken(null);
      clearAccessTokenCookie();
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}