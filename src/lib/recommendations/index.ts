/**
 * AI-Powered Recommendations Engine - Public API
 * 
 * This module provides a complete recommendation system with multiple algorithms:
 * - Content-Based Filtering: Similarity by category, tags, and difficulty
 * - Popularity-Based: Rankings by view count
 * - Trending-Based: Growth velocity (24h vs 7d views)
 * - Personalized: User history and preferences
 * - Hybrid: Combination of all above algorithms
 * 
 * Export all public APIs for recommendations
 */

// Core engine and types
export {
  type RecommendationContentItem,
  type RecommendationResult,
  type RecommendationOptions,
  RecommendationsEngine,
  createRecommendationsEngine,
} from './engine';

// Similarity calculations
export {
  jaccardSimilarity,
  cosineSimilarity,
  getCategoryVector,
  calculateContentSimilarity,
  getRecencyWeight,
  calculateTrendingScore,
  normalizeScores,
  combineScores,
} from './similarity';

// React Hooks
export {
  // Primary hooks
  useRecommendations,
  useTrendingContent,
  usePopularContent,
  usePersonalizedFeed,
  useHybridRecommendations,
  
  // Advanced hooks
  useRecommendationMetadata,
  useMultipleRecommendations,
  useRecommendationRefresh,
  useRecommendationConfidence,
  useAutoRefreshRecommendations,
} from './hooks';
