'use client';

import type React from 'react';

import { SearchIcon } from 'lucide-react';

export function Search({ className, ...props }: React.ComponentProps<typeof SearchIcon>) {
  return <SearchIcon className={className} {...props} />;
}
