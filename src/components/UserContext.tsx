"use client";

import { Database, IndexSettings } from "@prisma/client";
import { createContext, useContext } from "react";

const UserContext = createContext<User | null>(null);

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  databases: Database[];
  indexSettings: IndexSettings[];
}

export function UserProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  return useContext(UserContext);
}
