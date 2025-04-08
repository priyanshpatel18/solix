"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

export const useCounter = (value: number) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: "easeOut"
    });

    return controls.stop;
  }, [count, value]);

  return rounded;
};

export const AnimatedProgress = ({ value, max }: { value: number; max: number }) => {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, value, {
      duration: 0.8,
      ease: "easeOut"
    });

    return controls.stop;
  }, [progress, value]);

  const width = useTransform(progress, (latest) =>
    `${Math.min(100, (latest / max) * 100)}%`
  );

  return (
    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        style={{ width }}
      />
    </div>
  );
};