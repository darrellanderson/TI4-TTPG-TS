"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levenshteinDistance = levenshteinDistance;
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
function levenshteinDistance(str1, str2) {
    // Handle edge cases
    if (str1.length === 0) {
        return str2.length;
    }
    if (str2.length === 0) {
        return str1.length;
    }
    // Create a 2D array to store the distances
    // dp[i][j] represents the distance between str1[0...i-1] and str2[0...j-1]
    const dp = [];
    for (let i = 0; i <= str1.length; i++) {
        dp[i] = [];
        for (let j = 0; j <= str2.length; j++) {
            dp[i][j] = 0;
        }
    }
    // Initialize the first row and column
    // These represent the distance from an empty string
    for (let i = 0; i <= str1.length; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= str2.length; j++) {
        dp[0][j] = j;
    }
    // Fill in the rest of the matrix
    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            // If characters match, no operation needed
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            }
            else {
                // Take the minimum of three operations:
                // 1. Substitution: dp[i-1][j-1] + 1
                // 2. Deletion: dp[i-1][j] + 1
                // 3. Insertion: dp[i][j-1] + 1
                dp[i][j] = Math.min(dp[i - 1][j - 1] + 1, // substitution
                dp[i - 1][j] + 1, // deletion
                dp[i][j - 1] + 1);
            }
        }
    }
    // Return the bottom-right cell, which contains the final distance
    return dp[str1.length][str2.length];
}
//# sourceMappingURL=levenshtein-distance.js.map