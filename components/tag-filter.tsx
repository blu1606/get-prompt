'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Human-readable display names for tags
const TAG_LABELS: Record<string, string> = {
  'infographic': 'Infographic',
  'brand-identity': 'Brand Identity',
  'ui-ux-design': 'UI/UX Design',
  'product-ad': 'Product & Ads',
  'anime-manga': 'Anime & Manga',
  'illustration': 'Illustration',
  'photography': 'Photography',
  'game-mockup': 'Game Mockup',
  'fashion': 'Fashion',
  'food-culinary': 'Food & Culinary',
  'medical-science': 'Medical & Science',
  'comic-satire': 'Comic & Satire',
  'character-design': 'Character Design',
  'poster-event': 'Poster & Event',
  'educational': 'Educational',
  '3d-render': '3D Render',
  'concept-art': 'Concept Art',
  'logo-design': 'Logo Design',
  'social-media': 'Social Media',
  'technical-diagram': 'Technical Diagram',
};

interface TagFilterProps {
  tags: string[];
  activeTags: string[];
  tagCounts: Record<string, number>;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export const TagFilter = ({
  tags,
  activeTags,
  tagCounts,
  onToggleTag,
  onClearTags,
}: TagFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      {/* Scroll shadow left */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none" />
      )}

      {/* Scroll button left */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-surface-card border border-border-subtle rounded-full shadow-sm hover:border-border-hover transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-ink-subtle" />
        </button>
      )}

      {/* Scrollable tags */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-1 py-1"
      >
        {/* "All" pill */}
        <button
          onClick={onClearTags}
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border",
            activeTags.length === 0
              ? "bg-ink text-canvas border-ink"
              : "bg-surface-card text-ink-muted border-border-subtle hover:border-border-hover hover:text-ink"
          )}
        >
          All
        </button>

        {tags.map((tag) => {
          const isActive = activeTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border whitespace-nowrap",
                isActive
                  ? "bg-ink text-canvas border-ink"
                  : "bg-surface-card text-ink-muted border-border-subtle hover:border-border-hover hover:text-ink"
              )}
            >
              {TAG_LABELS[tag] || tag}
              <span className={cn(
                "ml-1.5 text-[10px]",
                isActive ? "text-canvas/60" : "text-ink-subtle/50"
              )}>
                {tagCounts[tag]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scroll shadow right */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none" />
      )}

      {/* Scroll button right */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-surface-card border border-border-subtle rounded-full shadow-sm hover:border-border-hover transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-ink-subtle" />
        </button>
      )}
    </div>
  );
};
