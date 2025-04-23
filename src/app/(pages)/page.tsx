"use client";

import IndexRequestForm from "@/components/forms/IndexSettingsForm";
import StoreDatabaseForm from "@/components/forms/StoreDatabaseForm";
import LandingPage from "@/components/landing/Landing";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User, useUserContext } from "@/components/UserContext";
import { montserrat } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Database, Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const steps = [
  {
    title: "Connect Database",
    description: "Connect your database to SolixDB for indexing.",
    action: "CONNECT",
    icon: <Database className="w-5 h-5" />,
  },
  {
    title: "Configure Parameters",
    description: "Specify tables, columns, and indexing criteria.",
    action: "CONFIGURE",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    title: "Start Indexing",
    description: "Begin indexing your blockchain data.",
    action: "START",
    icon: <ArrowRight className="w-5 h-5" />,
  },
  {
    title: "Explore Data",
    description: "Query and analyze your indexed blockchain data.",
    action: "EXPLORE",
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
  const { user } = useUserContext();

  useEffect(() => {
    if (user) {
      setStateUser(user);
    }
  }, [user]);

  if (!user) {
    return (
      <LandingPage />
    )
  }

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dialogContent, setDialogContent] = useState<"STORE" | "INDEX" | null>(null);
  const [databaseId, setDatabaseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [stateUser, setStateUser] = useState<User | null>(null);

  useEffect(() => {
    if (user && user.databases.length > 0 && user.indexSettings.length > 0) {
      setDatabaseId(user.databases[0].id);

      if (user.databases.length > 0) {
        setCompletedSteps([0]);
      }
      if (user.indexSettings.length > 0) {
        setCompletedSteps([0, 1]);
      }
      const statusArray = ["IN_PROGRESS", "COMPLETED", "FAILED"];
      if (user.databases.length > 0 && user.indexSettings.length > 0 && user.plan === "FREE" && statusArray.includes(user.indexSettings[0].status)) {
        setCompletedSteps([0, 1, 2]);
      }
    }
    if (user) {
      setStateUser(user);
    }
  }, [user]);

  const router = useRouter();

  async function startIndexing() {
    try {
      if (!databaseId) {
        return toast.error("Please select a database.");
      }

      setIsLoading(true);
      const response = await fetch("/api/indexing/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ databaseId }),
      });

      if (!response.ok) {
        return toast.error("Failed to start indexing.");
      }

      const { message } = await response.json();
      toast.success(message);
      setCompletedSteps((prev) => [...prev, 2]);
    } catch (error) {
      console.error("❌ Error starting indexing:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStepComplete = async (action: string) => {
    switch (action) {
      case "CONNECT":
        setDialogContent("STORE");
        break;
      case "CONFIGURE":
        setDialogContent("INDEX");
        break;
      case "START":
        await startIndexing();
        break;
      case "EXPLORE":
        router.push("/dashboard/explore");
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
      <div className={cn("py-8 px-4 md:px-6 bg-background h-[calc(100vh-8.1rem)]", montserrat)}>
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
                        disabled={isStepDisabled(index) || isLoading}
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
        </motion.div>
      </div>

      <DialogContent>
        {dialogContent === "STORE" && (
          <StoreDatabaseForm
            setShowStoreDatabaseForm={() => setDialogContent(null)}
            setCompletedSteps={setCompletedSteps}
            setUser={setStateUser}
          />
        )}
        {dialogContent === "INDEX" && (
          <IndexRequestForm
            setShowIndexRequestForm={() => setDialogContent(null)}
            setCompletedSteps={setCompletedSteps}
            setUser={setStateUser}
            databases={stateUser?.databases || []}
            setDatabaseId={setDatabaseId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}