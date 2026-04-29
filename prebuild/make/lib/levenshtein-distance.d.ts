/**
 * Calculate the Levenshtein distance between two strings.
 *
 * The Levenshtein distance is the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change one string into another.
 *
 * @param str1 - The first string to compare
 * @param str2 - The second string to compare
 * @returns The Levenshtein distance between the two strings
 *
 * @example
 * ```typescript
 * levenshteinDistance("kitten", "sitting"); // returns 3
 * levenshteinDistance("hello", "hello"); // returns 0
 * levenshteinDistance("", "abc"); // returns 3
 * ```
 */
export declare function levenshteinDistance(str1: string, str2: string): number;
