'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchBar = ({ value, onChange, className }: SearchBarProps) => {
  return (
    <div className={cn("relative group w-full", className)}>
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-subtle group-focus-within:text-primary-blue transition-colors">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder="Search prompts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 bg-surface-card border border-border-subtle rounded-full pl-14 pr-12 text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/50 transition-all text-base"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors p-1"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
