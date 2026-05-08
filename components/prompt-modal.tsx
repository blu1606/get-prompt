'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ExternalLink } from 'lucide-react';
import { PromptEntry } from '@/lib/prompts';
import { CopyButton } from './copy-button';

interface PromptModalProps {
  prompt: PromptEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export const PromptModal = ({ prompt, isOpen, onClose, onCopy }: PromptModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [editablePrompt, setEditablePrompt] = useState('');

  useEffect(() => {
    if (prompt) {
      setEditablePrompt(prompt.prompt);
    }
  }, [prompt]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !prompt) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-6xl h-[90vh] bg-surface-modal rounded-modal border border-border-subtle shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300"
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-14 px-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
          <button 
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white transition-colors bg-black/20 rounded-full hover:bg-black/40"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <a 
            href={prompt.source}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/40 rounded-full text-white/80 hover:text-white text-xs font-medium transition-all"
          >
            <span>Source</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Content Container (Split Screen on Desktop) */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Main Visual (Left) */}
          <div className="relative w-full md:w-1/2 bg-black flex-shrink-0 h-[40vh] md:h-full flex items-center justify-center">
            <Image
              src={prompt.image}
              alt={prompt.title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Info Section (Right) */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar h-[50vh] md:h-full">
            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              <h2 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
                {prompt.title}
              </h2>
              <p className="text-ink-muted text-base">
                {prompt.description}
              </p>
            </div>

            {/* Prompt Display */}
            <div className="flex flex-col gap-4 flex-1 min-h-[200px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">Image Prompt (Editable)</span>
              </div>
              
              <textarea
                value={editablePrompt}
                onChange={(e) => setEditablePrompt(e.target.value)}
                className="w-full bg-black/40 border border-border-subtle rounded-xl p-4 sm:p-6 font-mono text-sm leading-relaxed text-ink/90 whitespace-pre-wrap resize-y min-h-[200px] flex-1 focus:outline-none focus:border-primary transition-colors custom-scrollbar"
                spellCheck={false}
              />
            </div>

            {/* Footer Action */}
            <div className="flex justify-start pt-2">
              <CopyButton 
                text={editablePrompt} 
                onCopy={onCopy} 
                className="w-full sm:w-auto h-12 text-base px-8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
