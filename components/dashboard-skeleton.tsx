import React from 'react';
import { cn } from '@/lib/utils'; // optional if you're using classnames helper

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-4 p-4">
      <div className="bg-muted/50 dark:bg-muted min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
