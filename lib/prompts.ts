import Fuse from "fuse.js";
import promptsData from "@/public/prompts.json";

export interface PromptEntry {
  id: number;
  title: string;
  description: string;
  prompt: string;
  image: string;
  source: string;
  tags: string[];
}

export const allPrompts: PromptEntry[] = promptsData as PromptEntry[];

// Pre-compute unique tags with counts for the filter UI
export const tagCounts: Record<string, number> = {};
for (const p of allPrompts) {
  for (const tag of p.tags) {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  }
}

// Sorted tags by frequency (most popular first)
export const allTags = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([tag]) => tag);

// Fuse.js instance for fuzzy search
const fuse = new Fuse(allPrompts, {
  keys: [
    { name: "title", weight: 3 },
    { name: "description", weight: 2 },
    { name: "tags", weight: 1.5 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export function searchPrompts(query: string, activeTags: string[]): PromptEntry[] {
  let results: PromptEntry[];

  // Text search
  if (query.trim()) {
    results = fuse.search(query).map((r) => r.item);
  } else {
    results = allPrompts;
  }

  // Tag filter
  if (activeTags.length > 0) {
    results = results.filter((p) =>
      activeTags.some((tag) => p.tags.includes(tag))
    );
  }

  return results;
}

export function getPromptById(id: string | number) {
  return allPrompts.find((p) => p.id.toString() === id.toString());
}
