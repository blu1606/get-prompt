'use client';

import React, { useState } from 'react';
import { Hero } from '@/components/hero';
import { Gallery } from '@/components/gallery';
import { Toast } from '@/components/toast';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    setShowToast(true);
  };

  return (
    <main className="min-h-screen pt-14">
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <Gallery searchQuery={searchQuery} onCopy={handleCopy} />

      <footer className="bg-canvas border-t border-border-subtle py-12 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-ink-subtle">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <p className="text-xs font-medium">Built with YouMind GPT-Image-2 Prompts</p>
            <p className="text-[10px] uppercase tracking-widest">725 Curated Prompts</p>
          </div>
          
          <div className="flex items-center gap-6 text-xs">
            <a href="#" className="hover:text-ink transition-colors">Privacy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms</a>
            <a href="#" className="hover:text-ink transition-colors">Contact</a>
          </div>

          <p className="text-[10px] text-ink-subtle/50">
            © 2024 Get Prompt. Design inspired by Apple.
          </p>
        </div>
      </footer>

      <Toast 
        message="Copied to clipboard" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </main>
  );
}
