import type { MDXFile } from "@/lib/mdx-utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchResult {
  folder: string;
  file: MDXFile;
  score: number;
  matchType: string;
  excerpt?: string;
}

interface FieldScore {
  score: number;
  matchedWords: Set<string>;
}

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

/** Lowercase, split on whitespace, drop tokens shorter than 2 chars. */
export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

// ---------------------------------------------------------------------------
// Field scoring
// ---------------------------------------------------------------------------

const FIELD_WEIGHTS = {
  title: 10,
  tags: 8,
  keywords: 6,
  description: 5,
  folder: 3,
  content: 1,
} as const;

/** Escape special regex characters in a string. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Score a single text field against an array of query words.
 * Returns the weighted score and which words matched.
 */
function scoreField(
  text: string | undefined | null,
  words: string[],
  weight: number,
): FieldScore {
  if (!text) return { score: 0, matchedWords: new Set() };

  const lower = text.toLowerCase();
  const matched = new Set<string>();
  let score = 0;

  for (const word of words) {
    if (lower.includes(word)) {
      matched.add(word);
      score += weight;

      // Bonus: word appears at a word boundary (start of a word)
      const boundary = new RegExp(`(?:^|[\\s\\-_./,;:!?()\\[\\]])${escapeRegex(word)}`, "i");
      if (boundary.test(text)) {
        score += 2;
      }
    }
  }

  return { score, matchedWords: matched };
}

/**
 * Score tags: each tag is checked individually against each query word.
 * Exact tag match gets a bonus.
 */
function scoreTags(
  tags: string[] | undefined,
  words: string[],
  weight: number,
): FieldScore {
  if (!tags || tags.length === 0) return { score: 0, matchedWords: new Set() };

  const matched = new Set<string>();
  let score = 0;

  for (const tag of tags) {
    const tagLower = tag.toLowerCase();
    for (const word of words) {
      if (tagLower.includes(word)) {
        matched.add(word);
        score += weight;
        // Bonus for exact tag match
        if (tagLower === word) {
          score += 3;
        }
      }
    }
  }

  return { score, matchedWords: matched };
}

// ---------------------------------------------------------------------------
// Document scoring
// ---------------------------------------------------------------------------

/**
 * Score an entire MDXFile against the query words.
 * Returns null if not ALL query words matched at least one field (AND logic).
 */
export function scoreDocument(
  file: MDXFile,
  folder: string,
  words: string[],
  rawQuery: string,
): SearchResult | null {
  if (words.length === 0) return null;

  // Score each field
  const titleScore = scoreField(file.title, words, FIELD_WEIGHTS.title);
  const tagScore = scoreTags(file.tags, words, FIELD_WEIGHTS.tags);
  const keywordScore = scoreTags(file.keywords, words, FIELD_WEIGHTS.keywords);
  const descScore = scoreField(file.description, words, FIELD_WEIGHTS.description);
  const folderScore = scoreField(folder, words, FIELD_WEIGHTS.folder);
  const contentScore = scoreField(file.content, words, FIELD_WEIGHTS.content);

  // Collect all matched words across every field
  const allMatched = new Set<string>();
  for (const fs of [titleScore, tagScore, keywordScore, descScore, folderScore, contentScore]) {
    for (const w of fs.matchedWords) allMatched.add(w);
  }

  // AND-logic gate: every query word must match somewhere
  if (words.some((w) => !allMatched.has(w))) return null;

  let totalScore =
    titleScore.score +
    tagScore.score +
    keywordScore.score +
    descScore.score +
    folderScore.score +
    contentScore.score;

  // --- Bonuses ---

  // Exact phrase bonus: the full raw query appears consecutively in title or description
  const rawLower = rawQuery.toLowerCase().trim();
  if (rawLower.length > 0 && words.length > 1) {
    if (file.title.toLowerCase().includes(rawLower)) {
      totalScore += 20;
    } else if (file.description?.toLowerCase().includes(rawLower)) {
      totalScore += 10;
    } else if (file.content?.toLowerCase().includes(rawLower)) {
      totalScore += 5;
    }
  }

  // Title-starts-with bonus
  const titleLower = file.title.toLowerCase();
  if (titleLower.startsWith(words[0])) {
    totalScore += 5;
  }

  // Determine primary match type for the badge
  const matchType = determinePrimaryMatch(titleScore, tagScore, keywordScore, descScore, folderScore, contentScore);

  // Extract best excerpt
  const excerpt = extractBestExcerpt(file.content, words);

  return {
    folder,
    file,
    score: totalScore,
    matchType,
    excerpt,
  };
}

/** Pick the highest-scoring field as the primary match label. */
function determinePrimaryMatch(
  ...fields: { score: number }[]
): string {
  const names = ["title", "tag", "keyword", "description", "folder", "content"];
  let best = 0;
  let bestIdx = 5; // default to "content"

  for (let i = 0; i < fields.length; i++) {
    if (fields[i].score > best) {
      best = fields[i].score;
      bestIdx = i;
    }
  }

  return names[bestIdx];
}

// ---------------------------------------------------------------------------
// Excerpt extraction
// ---------------------------------------------------------------------------

/**
 * Find the best ~200-char window in content that contains the most
 * query words clustered together.
 */
export function extractBestExcerpt(
  content: string | undefined,
  words: string[],
  windowSize: number = 200,
): string {
  if (!content || words.length === 0) return "";

  const lower = content.toLowerCase();

  // Collect all match positions for all words
  const positions: { index: number; word: string }[] = [];
  for (const word of words) {
    let startFrom = 0;
    while (startFrom < lower.length) {
      const idx = lower.indexOf(word, startFrom);
      if (idx === -1) break;
      positions.push({ index: idx, word });
      startFrom = idx + 1;
    }
  }

  if (positions.length === 0) return "";

  // Sort by position
  positions.sort((a, b) => a.index - b.index);

  // Sliding window: find the window that contains the most unique words
  let bestStart = positions[0].index;
  let bestUniqueCount = 0;
  let bestDensity = Infinity;

  for (let i = 0; i < positions.length; i++) {
    const winStart = positions[i].index;
    const winEnd = winStart + windowSize;
    const uniqueInWindow = new Set<string>();

    for (let j = i; j < positions.length; j++) {
      if (positions[j].index > winEnd) break;
      uniqueInWindow.add(positions[j].word);
    }

    const density = winEnd - winStart;

    // Prefer more unique words; break ties by tighter clustering
    if (
      uniqueInWindow.size > bestUniqueCount ||
      (uniqueInWindow.size === bestUniqueCount && density < bestDensity)
    ) {
      bestUniqueCount = uniqueInWindow.size;
      bestDensity = density;
      bestStart = winStart;
    }
  }

  // Expand window to not cut words mid-way
  const excerptStart = Math.max(0, content.lastIndexOf(" ", bestStart) + 1);
  const rawEnd = bestStart + windowSize;
  const excerptEnd = Math.min(
    content.length,
    content.indexOf(" ", rawEnd) !== -1 ? content.indexOf(" ", rawEnd) : content.length,
  );

  const slice = content.substring(excerptStart, excerptEnd).trim();
  if (!slice) return "";

  const prefix = excerptStart > 0 ? "..." : "";
  const suffix = excerptEnd < content.length ? "..." : "";
  return `${prefix}${slice}${suffix}`;
}

// ---------------------------------------------------------------------------
// Full search entry point
// ---------------------------------------------------------------------------

/**
 * Run a scored search across all grouped files.
 * Returns results sorted by descending score.
 */
export function searchFiles(
  groupedFiles: Record<string, MDXFile[]>,
  query: string,
): SearchResult[] {
  const words = tokenize(query);
  if (words.length === 0) return [];

  const results: SearchResult[] = [];

  for (const [folderName, files] of Object.entries(groupedFiles)) {
    for (const file of files) {
      const result = scoreDocument(file, folderName, words, query);
      if (result) results.push(result);
    }
  }

  // Sort by score descending; tie-break alphabetically by title
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.file.title.localeCompare(b.file.title);
  });

  return results;
}
