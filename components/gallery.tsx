'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { allPrompts, searchPrompts, allTags, tagCounts } from '@/lib/prompts';
import { PromptCard } from './prompt-card';
import { PromptModal } from './prompt-modal';
import { TagFilter } from './tag-filter';

interface GalleryProps {
  searchQuery: string;
  onCopy: () => void;
}

const ITEMS_PER_PAGE = 24;

export const Gallery = ({ searchQuery, onCopy }: GalleryProps) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Sync with URL for shareability
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('prompt');
    if (id) {
      setSelectedPromptId(parseInt(id, 10));
    }
    const tag = params.get('tag');
    if (tag) {
      setActiveTags(tag.split(','));
    }
  }, []);

  const filteredPrompts = useMemo(() => {
    return searchPrompts(searchQuery, activeTags);
  }, [searchQuery, activeTags]);

  const visiblePrompts = useMemo(() => {
    return filteredPrompts.slice(0, visibleCount);
  }, [filteredPrompts, visibleCount]);

  const selectedPrompt = useMemo(() => {
    if (selectedPromptId === null) return null;
    return allPrompts.find(p => p.id === selectedPromptId) || null;
  }, [selectedPromptId]);

  const handleCardClick = (id: number) => {
    setSelectedPromptId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('prompt', id.toString());
    window.history.pushState({ id }, '', url);
  };

  const handleCloseModal = () => {
    setSelectedPromptId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('prompt');
    window.history.pushState({}, '', url);
  };

  const handleToggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      // Sync URL
      const url = new URL(window.location.href);
      if (next.length > 0) {
        url.searchParams.set('tag', next.join(','));
      } else {
        url.searchParams.delete('tag');
      }
      window.history.replaceState({}, '', url);

      return next;
    });
  };

  const handleClearTags = () => {
    setActiveTags([]);
    const url = new URL(window.location.href);
    url.searchParams.delete('tag');
    window.history.replaceState({}, '', url);
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredPrompts.length));
  };

  // Reset count when search/tags change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, activeTags]);

  return (
    <section className="bg-canvas px-6 pb-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Tag Filter */}
        <div className="mb-6">
          <TagFilter
            tags={allTags}
            activeTags={activeTags}
            tagCounts={tagCounts}
            onToggleTag={handleToggleTag}
            onClearTags={handleClearTags}
          />
        </div>

        {/* Results Info */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">
            {filteredPrompts.length} Prompts found
          </p>
          {activeTags.length > 0 && (
            <button
              onClick={handleClearTags}
              className="text-xs text-ink-muted hover:text-ink transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {visiblePrompts.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onClick={handleCardClick}
                onCopy={onCopy}
              />
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <p className="text-xl text-ink-muted mb-2">No prompts found</p>
            <p className="text-sm text-ink-subtle">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredPrompts.length && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={loadMore}
              className="apple-press px-8 py-3 rounded-full border border-border-subtle bg-surface-card hover:border-border-hover text-sm font-medium text-ink transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <PromptModal 
        prompt={selectedPrompt}
        isOpen={selectedPromptId !== null}
        onClose={handleCloseModal}
        onCopy={onCopy}
      />
    </section>
  );
};
