"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthContextType } from "@/types";
import {
  saveUser,
  getUserByEmail,
  saveCurrentUser,
  getCurrentUser,
  clearCurrentUser,
  hashPassword,
  verifyPassword,
  generateId,
} from "@/utils/localStorage";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const existingUser = getUserByEmail(email);

      if (!existingUser) {
        showNotification(
          "User not found. Please check your email or sign up.",
          "error"
        );
        return false;
      }

      // For demo purposes, we're storing hashed passwords
      // In production, this should be handled server-side
      const storedPassword = localStorage.getItem(`password_${email}`);
      if (!storedPassword || !verifyPassword(password, storedPassword)) {
        showNotification("Invalid password. Please try again.", "error");
        return false;
      }

      setUser(existingUser);
      saveCurrentUser(existingUser);
      showNotification(`Welcome back, ${existingUser.name}!`, "success");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      showNotification(
        "An error occurred during login. Please try again.",
        "error"
      );
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        showNotification(
          "An account with this email already exists. Please login instead.",
          "error"
        );
        return false;
      }

      // Create new user
      const newUser: User = {
        id: generateId(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      // Save user and password (hashed)
      saveUser(newUser);
      localStorage.setItem(`password_${email}`, hashPassword(password));

      setUser(newUser);
      saveCurrentUser(newUser);
      showNotification(
        `Welcome to Event Manager, ${name}! Your account has been created successfully.`,
        "success"
      );
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      showNotification(
        "An error occurred during signup. Please try again.",
        "error"
      );
      return false;
    }
  };

  const logout = (): void => {
    setUser(null);
    clearCurrentUser();
    showNotification("You have been logged out successfully.", "info");
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
