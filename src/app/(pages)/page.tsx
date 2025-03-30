"use client";

import IndexRequestForm from "@/components/forms/IndexRequestForm";
import StoreDatabaseForm from "@/components/forms/StoreDatabaseForm";
import LandingPage from "@/components/landing/Landing";
import { User, useUserContext } from "@/components/SessionProvder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { montserrat } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Database, Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  {
    title: "Connect Database",
    description: "Connect your database to SolixDB for indexing.",
    action: "CONNECT",
    link: "/dashboard",
    icon: <Database className="w-5 h-5" />,
  },
  {
    title: "Configure Parameters",
    description: "Specify tables, columns, and indexing criteria.",
    action: "CONFIGURE",
    link: "/index-settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    title: "Start Indexing",
    description: "Begin indexing your blockchain data.",
    action: "START",
    link: "/indexing-progress",
    icon: <ArrowRight className="w-5 h-5" />,
  },
  {
    title: "Explore Data",
    description: "Query and analyze your indexed blockchain data.",
    action: "EXPLORE",
    link: "/explorer",
    icon: <Search className="w-5 h-5" />,
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function HomePage() {
  const user = useUserContext();

  useEffect(() => {
    if (user) {
      setStoreUser(user);
      if (user.databases && user.databases.length > 0) {
        setCompletedSteps([0]);
      }
    }
  }, [user]);

  if (!user) {
    return (
      <LandingPage />
    )
  }

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dialogContent, setDialogContent] = useState<"STORE" | "INDEX" | null>(null);
  const [storeUser, setStoreUser] = useState<User | null>(null);

  const handleStepComplete = (action: string) => {
    switch (action) {
      case "CONNECT":
        setDialogContent("STORE");
        break;
      case "CONFIGURE":
        setDialogContent("INDEX");
        break;
      default:
        break;
    }
  };

  const isStepDisabled = (index: number) => {
    if (index === 0) return false;
    return !completedSteps.includes(index - 1);
  };

  return (
    <Dialog open={dialogContent !== null} onOpenChange={() => setDialogContent(null)}>
      <div className={cn("py-8 px-4 md:px-6 bg-background min-h-[calc(100vh-8.1rem)]", montserrat)}>
        <motion.div
          className="max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center mb-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-primary">
              Get Started with SolixDB
            </h2>
            <p className="mt-2 text-muted-foreground">
              Follow these steps to index your blockchain data
            </p>
          </motion.div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                className={cn(
                  "bg-card rounded-lg p-4 border border-border",
                  completedSteps.includes(index) && "border-primary/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center",
                    completedSteps.includes(index)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {completedSteps.includes(index) ? <CheckCircle className="w-4 h-4" /> : step.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-foreground">{step.title}</h3>
                      {index < steps.length - 1 && completedSteps.includes(index) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                    <div className="mt-3 flex justify-between items-center">
                      <Button
                        size="sm"
                        variant={completedSteps.includes(index) ? "outline" : "default"}
                        disabled={isStepDisabled(index)}
                        onClick={() => {
                          if (completedSteps.includes(index)) {
                            return;
                          }
                          handleStepComplete(step.action)
                        }}
                        className={`cursor-pointer ${completedSteps.includes(index) ? "cursor-not-allowed" : ""}`}
                      >
                        {completedSteps.includes(index) ? "Completed" : step.action}
                      </Button>

                      {completedSteps.includes(index) && (
                        <motion.span
                          className="text-xs text-primary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Done
                        </motion.span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {completedSteps.length === steps.length && (
            <motion.div
              className="mt-8 text-center bg-primary/10 p-4 rounded-lg"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-medium text-primary">All Steps Completed!</h3>
              <p className="mt-1 text-muted-foreground">Your blockchain data is now indexed and ready to explore.</p>
              <Button asChild className="mt-3">
                <a href="/explorer">Go to Data Explorer</a>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <DialogContent>
        {dialogContent === "STORE" && (
          <StoreDatabaseForm
            setShowStoreDatabaseForm={() => setDialogContent(null)}
            setCompletedSteps={setCompletedSteps}
            setUser={setStoreUser}
          />
        )}
        {dialogContent === "INDEX" && (
          <IndexRequestForm
            setShowIndexRequestForm={() => setDialogContent(null)}
            setCompletedSteps={setCompletedSteps}
            setUser={setStoreUser}
            databases={storeUser?.databases || []}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}