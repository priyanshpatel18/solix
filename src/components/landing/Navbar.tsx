"use client";

import { montserrat } from "@/fonts/fonts";
import { motion } from "framer-motion";
import { Session, User } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import Logo from "./Logo";

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:px-6 lg:px-10 box-border"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div
          className="flex items-center space-x-1 select-none cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Logo width={40} />
          <h1 className={`font-bold text-xl md:text-2xl tracking-tight text-foreground ${montserrat}`}>
            SolixDB
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          ) : (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => router.push("/signin")}
            >
              Sign in
            </Button>
          )}
          <ThemeToggle position="relative" />
        </div>

      </div>
    </motion.nav >
  );
}