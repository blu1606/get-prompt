'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Nav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 z-50 backdrop-blur-apple border-b border-border-subtle transition-all duration-300">
      <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-ink tracking-tight hover:opacity-80 transition-opacity">
          Get Prompt
        </Link>
        
        <div className="flex items-center gap-6">
          <button className="text-ink-muted hover:text-ink transition-colors p-2" aria-label="Toggle Search">
            <Search className="w-5 h-5" />
          </button>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-ink-muted hover:text-ink transition-colors p-2"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
};
