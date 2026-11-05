/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * YuvaPoshan Multilingual & Fuzzy Search Utility
 * Supports South Indian phonetic variations (Lakshmi/Laxmi, Karthik/Karthick, Soumya/Sowmya, etc.)
 */

// Common phonetic replacements for South Indian English transliterations
const PHONETIC_MAP: Array<[RegExp, string]> = [
  [/ksh/g, 'x'],
  [/ch/g, 'c'],
  [/th/g, 't'],
  [/dh/g, 'd'],
  [/bh/g, 'b'],
  [/ph/g, 'f'],
  [/sh/g, 's'],
  [/ee/g, 'i'],
  [/oo/g, 'u'],
  [/ow/g, 'ou'],
  [/w/g, 'v'],
  [/ck/g, 'k'],
];

export function normalizePhonetic(str: string): string {
  let normalized = str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  for (const [pattern, replacement] of PHONETIC_MAP) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized;
}

export function fuzzyStudentMatch(
  query: string,
  targetName: string,
  targetId: string,
  nativeName?: string
): { matches: boolean; score: number } {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return { matches: true, score: 1.0 };

  const cleanName = targetName.toLowerCase();
  const cleanId = targetId.toLowerCase();

  // Exact ID match or prefix
  if (cleanId.includes(cleanQuery)) {
    return { matches: true, score: 1.0 };
  }

  // Exact name substring
  if (cleanName.includes(cleanQuery)) {
    return { matches: true, score: 0.9 };
  }

  // Native script match (Kannada, Tamil, Telugu, Malayalam)
  if (nativeName && nativeName.toLowerCase().includes(cleanQuery)) {
    return { matches: true, score: 0.95 };
  }

  // Phonetic transliteration match (e.g. Laxmi <-> Lakshmi, Soumya <-> Sowmya)
  const normQuery = normalizePhonetic(cleanQuery);
  const normName = normalizePhonetic(cleanName);

  if (normName.includes(normQuery) || normQuery.includes(normName)) {
    return { matches: true, score: 0.8 };
  }

  // Levenshtein distance check for short typos
  if (cleanQuery.length >= 3 && Math.abs(cleanName.length - cleanQuery.length) <= 3) {
    const dist = levenshteinDistance(cleanQuery, cleanName.slice(0, cleanQuery.length + 2));
    if (dist <= 2) {
      return { matches: true, score: 0.7 - dist * 0.1 };
    }
  }

  return { matches: false, score: 0 };
}

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}
