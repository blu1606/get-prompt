export interface PromptEntry {
  id: number;
  title: string;
  description: string;
  prompt: string;
  image: string;
  source: string;
}

import promptsData from "@/public/prompts.json";

export const allPrompts: PromptEntry[] = promptsData as PromptEntry[];

export function getPromptById(id: string | number) {
  return allPrompts.find((p) => p.id.toString() === id.toString());
}
