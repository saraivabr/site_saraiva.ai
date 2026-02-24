/**
 * Similarity calculation functions for recommendation engine
 * Implements multiple algorithms: Jaccard, Cosine, and vector-based similarity
 */

import type { ContentMeta } from '@/types/content';

/**
 * Calculate Jaccard Similarity between two sets of tags
 * Formula: |A ∩ B| / |A ∪ B|
 * Returns value between 0 and 1
 */
export function jaccardSimilarity(tagsA: string[], tagsB: string[]): number {
  if (tagsA.length === 0 && tagsB.length === 0) return 1;
  if (tagsA.length === 0 || tagsB.length === 0) return 0;

  const setA = new Set(tagsA.map(t => t.toLowerCase()));
  const setB = new Set(tagsB.map(t => t.toLowerCase()));

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Calculate Cosine Similarity between two vectors
 * Formula: (A · B) / (||A|| * ||B||)
 * Returns value between 0 and 1
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Create a category-based one-hot encoding vector
 * Used for cosine similarity calculations
 */
export function getCategoryVector(
  category: string,
  allCategories: string[]
): number[] {
  return allCategories.map(cat => (cat === category ? 1 : 0));
}

/**
 * Calculate combined similarity score considering multiple factors
 * Weights: tags (40%), category (40%), difficulty level (20%)
 */
export function calculateContentSimilarity(
  source: ContentMeta,
  target: ContentMeta,
  allCategories: string[]
): number {
  // Tag similarity (Jaccard)
  const tagSimilarity = jaccardSimilarity(source.tags, target.tags);

  // Category similarity (binary - exact match or not)
  const categorySimilarity = source.category === target.category ? 1 : 0;

  // Difficulty similarity (consider relative proximity)
  const difficultyLevels = ['iniciante', 'intermediario', 'avancado'];
  const sourceDiffIdx = difficultyLevels.indexOf(source.difficulty || 'intermediario');
  const targetDiffIdx = difficultyLevels.indexOf(target.difficulty || 'intermediario');
  const diffDist = Math.abs(sourceDiffIdx - targetDiffIdx);
  const difficultySimilarity = 1 - diffDist / 2; // Max diff is 2, so divide by 2

  // Weighted combination
  return (
    tagSimilarity * 0.4 +
    categorySimilarity * 0.4 +
    difficultySimilarity * 0.2
  );
}

/**
 * Calculate recency weight for trending calculations
 * Items viewed more recently get higher weight
 * Formula: decay factor based on hours since last view
 */
export function getRecencyWeight(
  lastViewTimestamp: number,
  nowTimestamp: number = Date.now()
): number {
  const hoursSinceView = (nowTimestamp - lastViewTimestamp) / (1000 * 60 * 60);
  // Exponential decay: weight = e^(-0.1 * hours)
  return Math.exp(-0.1 * hoursSinceView);
}

/**
 * Calculate trending score based on view velocity
 * Formula: (recent_views / recent_period) / (older_views / older_period)
 * Returns growth multiplier (1 = no growth, 2 = 2x growth, etc.)
 */
export function calculateTrendingScore(
  views24h: number,
  views7d: number
): number {
  if (views7d === 0) {
    // New content gets boost if it has any views
    return views24h > 0 ? 1.5 : 0;
  }

  // Normalize: views per day in each period
  const avgDaily24h = views24h / 1;
  const avgDaily7d = views7d / 7;

  if (avgDaily7d === 0) return views24h > 0 ? 1.5 : 0;

  // Growth multiplier (capped at 10x to avoid outliers)
  return Math.min(avgDaily24h / avgDaily7d, 10);
}

/**
 * Normalize scores to 0-1 range using min-max normalization
 */
export function normalizeScores(scores: number[]): number[] {
  if (scores.length === 0) return [];
  if (scores.length === 1) return [1];

  const min = Math.min(...scores);
  const max = Math.max(...scores);

  if (min === max) return scores.map(() => 1);

  return scores.map(score => (score - min) / (max - min));
}

/**
 * Combine multiple similarity scores with weights
 */
export function combineScores(
  scores: { score: number; weight: number }[]
): number {
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight === 0) return 0;

  return (
    scores.reduce((sum, s) => sum + s.score * s.weight, 0) / totalWeight
  );
}
