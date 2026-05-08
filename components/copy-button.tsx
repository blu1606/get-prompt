'use client';

import React, { useState } from 'react';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { copyToClipboard, cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  onCopy?: () => void;
  className?: string;
  variant?: 'pill' | 'ghost';
  label?: string;
}

export const CopyButton = ({ text, onCopy, className, variant = 'pill', label = 'Copy Prompt' }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal if inside a card
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "apple-press flex items-center justify-center gap-2 transition-all duration-200",
        variant === 'pill' 
          ? "bg-primary-blue hover:bg-primary-hover text-white rounded-full px-5 py-2 text-sm font-medium"
          : "text-primary-blue hover:opacity-80 text-sm font-medium",
        className
      )}
      aria-label={label}
    >
      {copied ? <ClipboardCheck className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
};
