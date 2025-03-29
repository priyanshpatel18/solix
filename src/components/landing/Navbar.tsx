"use client";

import { montserrat } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Session, User } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import Logo from "./Logo";
import { signOut } from "next-auth/react";

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:px-6 lg:px-10"
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

        <div className="hidden md:flex items-center space-x-3">
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
              onClick={() => router.push("/auth/signin")}
            >
              Sign in
            </Button>
          )}
          <ThemeToggle position="relative" />
        </div>


        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <motion.div
        className={cn(
          "md:hidden absolute top-16 left-0 w-full bg-background border-b z-40 overflow-hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isMobileMenuOpen ? "auto" : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="py-4 flex flex-col items-center space-y-3">
          <ThemeToggle position="relative" />
          <div className="px-4 w-full">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => {
                router.push("/auth/signin");
                toggleMobileMenu();
              }}
            >
              Sign in
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.nav >
  );
}