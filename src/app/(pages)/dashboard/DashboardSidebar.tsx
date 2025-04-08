"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/components/UserContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  CreditCard,
  Database,
  Home,
  Layers,
  Settings,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  user: User | null;
  databases: number;
  indexJobs: number;
}

export default function DashboardSidebar({
  collapsed,
  setCollapsed,
  user,
  databases,
  indexJobs,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Databases", href: "/dashboard/databases", icon: Database, count: databases },
    { name: "Indexing", href: "/dashboard/indexing", icon: Layers, count: indexJobs },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  ];

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <motion.div
      className={cn(
        "fixed h-[calc(100vh-8.1rem)] bg-background p-4 w-full",
        "md:border-r",
        collapsed ? "lg:w-18" : "lg:w-64"
      )}
      initial={false}
      animate={isDesktop ? { width: collapsed ? 72 : 256 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-3 mb-8">
          <div className="relative w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
            {user?.image ? (
              <Image
                src={user?.image}
                alt={user?.name || user?.email}
                className="w-full h-full object-cover"
                width={40}
                height={40}
              />
            ) : (
              <UserIcon size={20} className="text-primary" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 truncate">
              <p className="font-medium text-sm truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.plan?.toLowerCase()} · {user?.credits} credits
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1 flex flex-col w-full" >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setCollapsed(false)} className="w-full">
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer",
                  !collapsed && "justify-between"
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <item.icon size={20} />
                  {!collapsed && <span>{item.name}</span>}
                </div>

                {!collapsed && item.count !== undefined && (
                  <span className="text-xs bg-secondary text-secondary-foreground rounded-full px-2">
                    {item.count}
                  </span>
                )}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
