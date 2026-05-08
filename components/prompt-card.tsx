'use client';

import React from 'react';
import Image from 'next/image';
import { PromptEntry } from '@/lib/prompts';
import { CopyButton } from './copy-button';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: PromptEntry;
  onClick: (id: number) => void;
  onCopy: () => void;
}

export const PromptCard = ({ prompt, onClick, onCopy }: PromptCardProps) => {
  return (
    <div 
      id={`prompt-${prompt.id}`}
      onClick={() => onClick(prompt.id)}
      className="group relative flex flex-col bg-surface-card rounded-card border border-border-subtle hover:border-border-hover hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden apple-press break-inside-avoid mb-6"
    >
      {/* Image Container */}
      <div className="relative w-full overflow-hidden">
        <img
          src={prompt.image}
          alt={prompt.title}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 block"
        />
        
        {/* Copy Button (only visible on hover on desktop, or always on mobile via CSS but we'll use a standard hover overlay) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <CopyButton 
            text={prompt.prompt} 
            onCopy={onCopy} 
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-ink truncate">
          {prompt.title}
        </h3>
        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
          {prompt.description}
        </p>
      </div>
    </div>
  );
};
