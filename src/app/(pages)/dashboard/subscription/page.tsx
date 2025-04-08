"use client";

import { AnimatedProgress, useCounter } from "@/components/AnimatedProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/components/UserContext";
import { motion } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";

export default function SubscriptionPage() {
  const { user } = useUserContext();

  const isPro = user?.plan === "PRO";
  const credits = user?.credits ?? 0;
  const quota = isPro ? 5000 : 500;

  const displayCredits = useCounter(credits);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          View your current plan and credit usage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <CardDescription>
                You're on the {isPro ? "Pro" : "Free"} Plan.
              </CardDescription>
            </div>
            <Badge variant={isPro ? "default" : "secondary"}>
              {isPro ? "Pro" : "Free"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <span>Credits Used</span>
              <span>
                <motion.span>{displayCredits}</motion.span> / {quota}
              </span>
            </div>
            <AnimatedProgress value={credits} max={quota} />
          </div>

          {!isPro && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro and unlock 10x more credits.
              </p>
              <Button disabled>
                <Zap className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          )}

          {isPro && (
            <div className="flex items-center text-sm text-green-600 dark:text-green-400 gap-2">
              <CheckCircle2 className="h-4 w-4" />
              You're enjoying Pro benefits!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}