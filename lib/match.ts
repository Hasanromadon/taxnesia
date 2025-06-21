import levenshtein from "fast-levenshtein";
import { Message } from "@/types/chats";

function normalizeAndTokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .split(/\s+/)
    .filter(Boolean); // Filter out empty strings from multiple spaces
}

/**
 * Checks if the user's recent input is contextually related to tax keywords.
 * Uses a combination of exact matching and Levenshtein distance for fuzzy matching.
 * @param history The conversation history.
 * @param windowSize The number of recent user messages to consider for context.
 * @param keywords The allowed keywords.
 * @returns True if the context is in scope, false otherwise.
 */

export function isContextuallyInScope(
  history: Message[],
  windowSize: number = 3,
  keywords: string[]
): boolean {
  const recentUserTexts = history
    .filter((msg) => msg.role === "user")
    .slice(-windowSize)
    .map((msg) => msg.parts.map((p) => p.text).join(" "))
    .join(" ")
    .toLowerCase();

  // Optimization: Pre-process recentUserTexts
  const cleanedRecentUserTexts = recentUserTexts
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const inputWords = cleanedRecentUserTexts.split(" ").filter(Boolean);

  // 1. Check for exact phrase matches from the original taxKeywords
  for (const keyword of keywords) {
    // Check if the cleaned recent user text includes the exact keyword
    if (cleanedRecentUserTexts.includes(keyword.toLowerCase())) {
      return true;
    }
  }

  // 2. Fuzzy match using Levenshtein distance on individual words
  for (const inputWord of inputWords) {
    for (const keyword of keywords) {
      const keywordWords = normalizeAndTokenizeText(keyword);
      for (const kwWord of keywordWords) {
        const dist = levenshtein.get(inputWord, kwWord);
        // Adjusted thresholds for more robust fuzzy matching
        if (kwWord.length > 5 ? dist <= 2 : dist <= 1) {
          return true;
        }
      }
    }
  }
  return false;
}
