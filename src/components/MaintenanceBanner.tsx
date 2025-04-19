"use client";

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MaintenanceBannerProps {
  message?: string;
  isDismissible?: boolean;
}

export default function MaintenanceBanner({
  message = "System maintenance in progress. Some features may be temporarily unavailable.",
  isDismissible = true
}: MaintenanceBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="border-b border-primary/30 rounded-none bg-primary/10 py-1 px-4 w-full"
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0 mr-2" />
              <AlertDescription className="text-sm text-primary flex-1 truncate">
                {message}
              </AlertDescription>
            </div>

            {isDismissible && (
              <button
                onClick={() => setIsVisible(false)}
                className="cursor-pointer ml-2 flex-shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close maintenance notification"
              >
                <X className="h-4 w-4 text-primary" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}