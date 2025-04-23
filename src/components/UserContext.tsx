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

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userData: Record<string, any[]> | null
  setUserData: React.Dispatch<React.SetStateAction<Record<string, any[]> | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider with state
export function UserProvider({
  user: initialUser,
  userData: initialData,
  children,
}: {
  user: User | null;
  userData: Record<string, any[]> | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [userData, setUserData] = useState<Record<string, any[]> | null>(initialData);

  return (
    <UserContext.Provider value={{ user, setUser, userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
