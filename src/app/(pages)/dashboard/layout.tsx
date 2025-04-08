"use client";

import { useUserContext } from "@/components/UserContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUserContext();

  const closeMobileSidebar = () => setMobileOpen(false);

  return (
    <div className="flex h-[calc(100vh-8.1rem)] relative">
      <div className="absolute top-3 left-4 z-50 md:hidden">
        <Button variant="secondary" size="icon" onClick={() => {
          console.log("CLICK");

          setMobileOpen(true)
        }} className="cursor-pointer z-40">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <div className="hidden md:block">
        <DashboardSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          user={user}
          databases={user?.databases.length || 0}
          indexJobs={user?.indexSettings.length || 0}
        />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed top-16 left-0 bottom-16 z-50 w-full bg-background md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-4 right-4 z-40">
              <Button variant="ghost" size="icon" onClick={closeMobileSidebar}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <DashboardSidebar
              collapsed={false}
              setCollapsed={closeMobileSidebar}
              user={user}
              databases={user?.databases.length || 0}
              indexJobs={user?.indexSettings.length || 0}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        className={cn(
          "flex-1 overflow-auto p-4 md:p-6 transition-all duration-300 relative",
          collapsed ? "lg:ml-18" : "lg:ml-64",
          "md:ml-auto"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer absolute top-3 left-4 z-40"
        >
          <Menu className="w-5 h-5" />
        </Button>
        {children}
      </motion.main>
    </div>
  );
}
