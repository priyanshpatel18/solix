"use client"

import Logo from "@/components/landing/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative">
      <ThemeToggle position="absolute" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div
          className="flex justify-center mb-8  cursor-pointer"
          variants={itemVariants}
          onClick={() => {
            if (isLoading) return;
            router.push("/")
          }}
        >
          <div className="bg-card p-5 rounded-full shadow-md">
            <Logo width={70} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border shadow-lg">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold">Welcome to SolixDB</CardTitle>
              <CardDescription className="text-base">Sign in to your account</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 pb-8">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={() => {
                    setIsLoading(true);
                    signIn("google", { callbackUrl: "/" })
                  }}
                  className="w-full border flex items-center justify-center gap-3 h-14 text-base cursor-pointer"
                  variant="outline"
                  disabled={isLoading}
                >
                  <Image
                    src="/google.png"
                    alt="Google Logo"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <span className="ml-2 font-medium">Continue with Google</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={() => {
                    setIsLoading(true);
                    signIn("github", { callbackUrl: "/" })
                  }}
                  className="w-full flex items-center justify-center gap-3 h-14 text-base cursor-pointer"
                  disabled={isLoading}
                >
                  {resolvedTheme === "dark" ? (
                    <Image
                      src="/github-dark-theme.png"
                      alt="GitHub Logo"
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                  ) : (
                    <Image
                      src="/github-light-theme.png"
                      alt="GitHub Logo"
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                  )}
                  <span className="ml-2 font-medium">Continue with GitHub</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={() => signIn("discord", { callbackUrl: "/" })}
                  className="w-full border flex items-center justify-center gap-3 h-14 text-base cursor-pointer"
                  variant="outline"
                  disabled={isLoading}
                >
                  <Image
                    src="/discord.png"
                    alt="Discord Logo"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <span className="ml-2 font-medium">Continue with Discord</span>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          SolixDB © 2025 • v1.0.0
        </motion.div>
      </motion.div>
    </div>
  );
}