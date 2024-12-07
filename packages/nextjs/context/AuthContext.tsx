"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string | null, id: string | null, refresh: string | null) => void;
  clearTokens: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize tokens from localStorage
  useEffect(() => {
    try {
      const storedAccess = localStorage.getItem("access_token");
      const storedId = localStorage.getItem("id_token");
      const storedRefresh = localStorage.getItem("refresh_token");

      if (storedAccess) setAccessToken(storedAccess);
      if (storedId) setIdToken(storedId);
      if (storedRefresh) setRefreshToken(storedRefresh);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setTokens = (access: string | null, id: string | null, refresh: string | null) => {
    try {
      // Update state
      if (access !== undefined) setAccessToken(access);
      if (id !== undefined) setIdToken(id);
      if (refresh !== undefined) setRefreshToken(refresh);

      // Update localStorage
      if (access) {
        localStorage.setItem("access_token", access);
      }
      if (id) {
        localStorage.setItem("id_token", id);
      }
      if (refresh) {
        localStorage.setItem("refresh_token", refresh);
      }

      console.log("Tokens saved successfully");
    } catch (error) {
      console.error("Error saving tokens:", error);
    }
  };

  const clearTokens = () => {
    try {
      // Clear state
      setAccessToken(null);
      setIdToken(null);
      setRefreshToken(null);

      // Clear localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("refresh_token");

      console.log("Tokens cleared successfully");
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  };

  // Don't render children until tokens are initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        idToken,
        refreshToken,
        setTokens,
        clearTokens,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}