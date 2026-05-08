'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast = ({ message, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-surface-card border border-border-subtle backdrop-blur-apple rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl">
        <CheckCircle2 className="w-5 h-5 text-primary-blue" />
        <span className="text-sm font-medium text-ink">{message}</span>
      </div>
    </div>
  );
};
