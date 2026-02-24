/**
 * Tests for Similarity Functions
 * @module tests/recommendations/similarity
 */

import { describe, it, expect } from 'vitest';
import {
  jaccardSimilarity,
  cosineSimilarity,
  calculateContentSimilarity,
  calculateTrendingScore,
  normalizeScores,
  combineScores,
} from './similarity';

describe('Similarity Functions', () => {
  describe('jaccardSimilarity', () => {
    it('should return 1 for identical sets', () => {
      const tags = ['react', 'typescript', 'vite'];
      expect(jaccardSimilarity(tags, tags)).toBe(1);
    });

    it('should return 0 for completely different sets', () => {
      const tagsA = ['react', 'typescript'];
      const tagsB = ['python', 'django'];
      expect(jaccardSimilarity(tagsA, tagsB)).toBe(0);
    });

    it('should calculate correct similarity for partial overlap', () => {
      const tagsA = ['react', 'typescript', 'vite'];
      const tagsB = ['react', 'typescript', 'nextjs'];
      // Intersection: 2, Union: 4 -> 2/4 = 0.5
      expect(jaccardSimilarity(tagsA, tagsB)).toBe(0.5);
    });

    it('should handle empty arrays', () => {
      expect(jaccardSimilarity([], [])).toBe(1); // both empty = identical
      expect(jaccardSimilarity(['a'], [])).toBe(0);
    });
  });

  describe('cosineSimilarity', () => {
    it('should return 1 for identical vectors', () => {
      const vec = [1, 2, 3, 4, 5];
      expect(cosineSimilarity(vec, vec)).toBeCloseTo(1, 5);
    });

    it('should return 0 for orthogonal vectors', () => {
      const vecA = [1, 0, 0];
      const vecB = [0, 1, 0];
      expect(cosineSimilarity(vecA, vecB)).toBe(0);
    });

    it('should calculate correct similarity for similar vectors', () => {
      const vecA = [1, 1, 1];
      const vecB = [1, 1, 0];
      // cos(theta) = (1+1+0) / (sqrt(3) * sqrt(2)) = 2 / sqrt(6) ≈ 0.816
      expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(0.816, 2);
    });

    it('should handle zero vectors', () => {
      expect(cosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
    });
  });

  describe('calculateTrendingScore', () => {
    it('should return 1.5 for new content with views', () => {
      expect(calculateTrendingScore(5, 0)).toBe(1.5);
    });

    it('should return 0 for content with no views', () => {
      expect(calculateTrendingScore(0, 0)).toBe(0);
    });

    it('should calculate growth multiplier correctly', () => {
      // 7 views in 24h vs 7 views in 7 days = 7x growth (7/1 vs 1/1)
      expect(calculateTrendingScore(7, 7)).toBe(7);
    });

    it('should cap growth at 10x', () => {
      expect(calculateTrendingScore(100, 1)).toBe(10);
    });
  });

  describe('normalizeScores', () => {
    it('should normalize to 0-1 range', () => {
      const normalized = normalizeScores([0, 50, 100]);
      expect(normalized[0]).toBe(0);
      expect(normalized[1]).toBe(0.5);
      expect(normalized[2]).toBe(1);
    });

    it('should handle single value', () => {
      expect(normalizeScores([42])).toEqual([1]);
    });

    it('should handle empty array', () => {
      expect(normalizeScores([])).toEqual([]);
    });

    it('should handle all same values', () => {
      expect(normalizeScores([5, 5, 5])).toEqual([1, 1, 1]);
    });
  });

  describe('combineScores', () => {
    it('should combine weighted scores correctly', () => {
      const combined = combineScores([
        { score: 1, weight: 0.5 },
        { score: 0.5, weight: 0.5 },
      ]);
      expect(combined).toBe(0.75);
    });

    it('should handle empty array', () => {
      expect(combineScores([])).toBe(0);
    });

    it('should handle zero weights', () => {
      expect(combineScores([{ score: 1, weight: 0 }])).toBe(0);
    });
  });
});
