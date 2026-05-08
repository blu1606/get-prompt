'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SearchBar } from './search-bar';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Hero = ({ searchQuery, setSearchQuery }: HeroProps) => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-canvas px-6 overflow-hidden">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-blue/20 rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-ink mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          Get Prompt
        </h1>
        <p className="text-lg md:text-xl text-ink-muted mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          725 curated AI image prompts. Browse, preview, copy.
        </p>
        
        <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-subtle animate-bounce">
        <span className="text-xs uppercase tracking-widest font-medium">Browse Gallery</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
};
