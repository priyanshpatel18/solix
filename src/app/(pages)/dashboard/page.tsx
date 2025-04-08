"use client";

import { AnimatedProgress, useCounter } from "@/components/AnimatedProgressBar";
import { useUserContext } from "@/components/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart, CheckCircle2, Database, List, RefreshCcw, Settings, Zap } from "lucide-react";
import Link from "next/link";

export default function MainPage() {
  const { user } = useUserContext();
  const isPro = user?.plan === "PRO";
  const credits = user?.credits ?? 0;
  const quota = isPro ? 5000 : 500;

  const totalDatabases = user?.databases?.length ?? 0;
  const totalIndexes = user?.indexSettings?.length ?? 0;

  const animatedCredits = useCounter(credits);

  // Staggered animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-10 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="space-y-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">A quick glance at your account activity and resources.</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Plan</CardTitle>
                  <CardDescription>
                    You're on the <span className="font-semibold">{isPro ? "Pro" : "Free"}</span> plan.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isPro ? "default" : "secondary"}>
                    {isPro ? "Pro" : "Free"}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 cursor-pointer"
                    onClick={() => window.location.reload()}
                  >
                    <motion.div
                      whileTap={{ rotate: 360 }}
                      whileHover={{ rotate: 180 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Credits Used:</span>{" "}
                <motion.span>{animatedCredits}</motion.span> / {quota}
              </div>
              <AnimatedProgress value={credits} max={quota} />

              {!isPro ? (
                <motion.div >
                  <Button className="mt-2" disabled>
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center text-sm text-green-600 dark:text-green-400 gap-2 mt-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  You're enjoying Pro benefits!
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>


        <motion.div variants={item}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/dashboard/databases">
              <motion.div
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)"
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Card className="cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Databases</CardTitle>
                    <motion.div
                      initial={{ rotate: -10, opacity: 0.5 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="text-2xl font-bold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {totalDatabases}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">connected</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link href="/dashboard/indexing">
              <motion.div
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)"
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Card className="cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Indexes</CardTitle>
                    <motion.div
                      initial={{ rotate: -10, opacity: 0.5 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="text-2xl font-bold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {totalIndexes}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">active</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link href="/dashboard/settings">
              <motion.div
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)"
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Card className="cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Settings</CardTitle>
                    <motion.div
                      initial={{ rotate: -10, opacity: 0.5 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="text-2xl font-bold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      {user?.name ?? "—"}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">user</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/databases">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Database className="h-4 w-4 mr-2" />
                    Manage Databases
                  </Button>
                </motion.div>
              </Link>
              <Link href="/dashboard/indexing">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <List className="h-4 w-4 mr-2" />
                    View Indexes
                  </Button>
                </motion.div>
              </Link>
              <Link href="/dashboard/subscription">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Zap className="h-4 w-4 mr-2" />
                    Plan & Usage
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}