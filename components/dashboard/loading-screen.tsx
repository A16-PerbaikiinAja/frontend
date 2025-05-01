'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}>
          <Loader2 className="text-primary h-12 w-12" />
        </motion.div>
        <p className="text-muted-foreground text-lg font-medium">Loading your dashboard...</p>
      </motion.div>
    </div>
  );
}
