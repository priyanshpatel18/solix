"use client";

import { Button } from "@/components/ui/button";
import { montserrat } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
};

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Page Not Found - SolixDB"; // Set a descriptive title
  }, []);

  return (
    <motion.div
      className={cn(
        "min-h-[calc(100vh_-_60px)] bg-background py-16 px-6 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center",
        montserrat
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ThemeToggle position="absolute" />
      <motion.div
        className="max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }}
      >
        <h1 className="text-4xl font-bold text-primary tracking-tight mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          The page you are looking for does not exist.
        </p>
        <Button onClick={() => router.back()} className="mr-2 cursor-pointer">
          Go Back
        </Button>
        <Button onClick={() => router.push("/")} variant="secondary" className="cursor-pointer">
          Go to Homepage
        </Button>
      </motion.div>
    </motion.div>
  );
}