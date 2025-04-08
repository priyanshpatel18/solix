"use client";

import { Database, IndexSettings, Plan } from "@prisma/client";
import React, { createContext, useContext, useState } from "react";

// Define your types
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  databases: ContextDatabase[];
  indexSettings: ContextIndex[];
  credits: number;
  plan: Plan;
}

export interface ContextDatabase extends Database {
  indexSettings: IndexSettings[];
}

export interface ContextIndex extends IndexSettings {
  database: Database;
}

// New type includes setUser
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Initialize context with undefined to enforce provider
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider with state
export function UserProvider({ user: initialUser, children }: { user: User | null; children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use context
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
