"use client";
import type { User } from "@/lib/types";
import { login as apiLogin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for persisted user session (e.g., from localStorage)
    const storedUser = localStorage.getItem("messmate-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("messmate-user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      const loggedInUser = await apiLogin(email, pass);
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem("messmate-user", JSON.stringify(loggedInUser));
        setLoading(false);
        if (loggedInUser.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/student");
        }
        return true;
      }
      setUser(null);
      localStorage.removeItem("messmate-user");
      setLoading(false);
      return false;
    } catch (error) {
      console.error("Login failed", error);
      setUser(null);
      localStorage.removeItem("messmate-user");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("messmate-user");
    router.push("/");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
