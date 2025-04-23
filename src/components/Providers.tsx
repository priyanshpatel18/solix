"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps, ReactNode, useEffect, useState } from "react";
import { UserProvider } from "./UserContext";

interface ProviderProps {
  children: ReactNode;
}

export default function Providers({ children }: ProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SessionProvider>
        <UserProvider user={null} userData={null}>
          {children}
        </UserProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
