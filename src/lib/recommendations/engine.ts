/**
 * AI-Powered Recommendations Engine
 * Implements multiple recommendation algorithms: content-based, popularity-based, trending, and personalized
 */

import type { ContentItem, ContentMeta } from '@/types/content';
import { getAllAnalytics } from '@/lib/analytics';
import {
  calculateContentSimilarity,
  calculateTrendingScore,
  getRecencyWeight,
  normalizeScores,
  combineScores,
} from './similarity';

/**
 * Content item interface for recommendations
 */
export interface RecommendationContentItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  views?: number;
  score?: number;
}

/**
 * Recommendation result with confidence and reasoning
 */
export interface RecommendationResult {
  items: RecommendationContentItem[];
  reason: 'similar' | 'popular' | 'trending' | 'personalized';
  confidence: number;
  algorithm: string;
}

/**
 * Options for recommendation generation
 */
export interface RecommendationOptions {
  limit?: number;
  excludeId?: string;
  minConfidence?: number;
  weights?: {
    contentBased?: number;
    popularity?: number;
    trending?: number;
    personalized?: number;
  };
}

/**
 * Recommendations Engine class
 * Provides multiple algorithms for content recommendations
 */
export class RecommendationsEngine {
  private contentItems: ContentItem[];
  private allCategories: string[];

  constructor(contentItems: ContentItem[]) {
    this.contentItems = contentItems;
    this.allCategories = [...new Set(contentItems.map(item => item.meta.category))];
  }

  /**
   * Get recommendations similar to a given content item (Content-Based Filtering)
   */
  getSimilarContent(
    sourceItem: ContentItem,
    options: RecommendationOptions = {}
  ): RecommendationResult {
    const limit = options.limit || 3;
    const minConfidence = options.minConfidence || 0.3;

    const scored = this.contentItems
      .filter(item => item.meta.slug !== sourceItem.meta.slug && item.meta.slug !== options.excludeId)
      .map(item => ({
        item,
        score: calculateContentSimilarity(sourceItem.meta, item.meta, this.allCategories),
      }));

    scored.sort((a, b) => b.score - a.score);

    const topItems = scored
      .filter(s => s.score >= minConfidence)
      .slice(0, limit);

    const avgScore = topItems.length > 0
      ? topItems.reduce((sum, s) => sum + s.score, 0) / topItems.length
      : 0;

    return {
      items: topItems.map(s => this.itemToRecommendation(s.item, s.score)),
      reason: 'similar',
      confidence: Math.min(avgScore, 1),
      algorithm: 'Content-Based Filtering (Jaccard + Category + Difficulty)',
    };
  }

  /**
   * Get popular content based on view counts (Popularity-Based)
   */
  getPopularContent(options: RecommendationOptions = {}): RecommendationResult {
    const limit = options.limit || 5;
    const analytics = getAllAnalytics();

    const scored = this.contentItems
      .filter(item => item.meta.slug !== options.excludeId)
      .map(item => {
        // Create ID for analytics: category/slug
        const analyticsId = `${item.meta.category}/${item.meta.slug}`;
        const views = analytics.views[analyticsId] || 0;
        return { item, views, score: views };
      });

    scored.sort((a, b) => b.score - a.score);

    const topItems = scored.slice(0, limit);
    const maxViews = Math.max(...topItems.map(s => s.views), 1);

    // Normalize confidence based on views
    const confidence = maxViews > 0
      ? (topItems[0]?.views || 0) / maxViews
      : 0;

    return {
      items: topItems.map(s => this.itemToRecommendation(s.item, (s.views / maxViews))),
      reason: 'popular',
      confidence,
      algorithm: 'Popularity-Based (View Count)',
    };
  }

  /**
   * Get trending content based on recent growth (Trending)
   */
  getTrendingContent(options: RecommendationOptions = {}): RecommendationResult {
    const limit = options.limit || 5;
    const analytics = getAllAnalytics();
    const now = Date.now();

    // Calculate view windows
    const oneDayMs = 24 * 60 * 60 * 1000;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const scored = this.contentItems
      .filter(item => item.meta.slug !== options.excludeId)
      .map(item => {
        const analyticsId = `${item.meta.category}/${item.meta.slug}`;
        
        // Count views in each time window
        const views24h = analytics.events.filter(
          e =>
            e.event === 'view_content' &&
            e.content_id === analyticsId &&
            e.timestamp > now - oneDayMs
        ).length;

        const views7d = analytics.events.filter(
          e =>
            e.event === 'view_content' &&
            e.content_id === analyticsId &&
            e.timestamp > now - sevenDaysMs
        ).length;

        const trendingScore = calculateTrendingScore(views24h, views7d);
        const recencyWeight = views24h > 0 ? getRecencyWeight(analytics.events.find(
          e => e.event === 'view_content' && e.content_id === analyticsId
        )?.timestamp || 0, now) : 0;

        return {
          item,
          score: trendingScore * recencyWeight,
          trendingScore,
        };
      });

    scored.sort((a, b) => b.score - a.score);

    const topItems = scored.slice(0, limit);
    const maxScore = Math.max(...topItems.map(s => s.score), 1);

    return {
      items: topItems.map(s => this.itemToRecommendation(s.item, s.score / maxScore)),
      reason: 'trending',
      confidence: topItems.length > 0 ? Math.min(topItems[0].score / maxScore, 1) : 0,
      algorithm: 'Trending-Based (24h vs 7d Growth)',
    };
  }

  /**
   * Get personalized recommendations based on user's viewing history (Personalized)
   */
  getPersonalizedRecommendations(options: RecommendationOptions = {}): RecommendationResult {
    const limit = options.limit || 5;
    const analytics = getAllAnalytics();

    // Find categories and tags user has interacted with
    const userCategories = new Set<string>();
    const userTags = new Set<string>();
    const userViewedIds = new Set<string>();

    analytics.events.forEach(event => {
      if (event.event === 'view_content' && event.content_id) {
        userViewedIds.add(event.content_id);
      }
      if (event.event === 'search' && event.search_query) {
        // Add search query as a pseudo-tag
        userTags.add(event.search_query.toLowerCase());
      }
      if (event.category) {
        userCategories.add(event.category);
      }
    });

    // If user has no history, fall back to popular content
    if (userViewedIds.size === 0) {
      return this.getPopularContent(options);
    }

    // Score items based on user preferences
    const scored = this.contentItems
      .filter(
        item =>
          !userViewedIds.has(item.meta.slug) &&
          item.meta.slug !== options.excludeId
      )
      .map(item => {
        let score = 0;

        // Boost if in frequently viewed category
        if (userCategories.has(item.meta.category)) {
          score += 0.5;
        }

        // Boost if shares tags with viewed content
        const sharedTags = item.meta.tags.filter(tag =>
          userTags.has(tag.toLowerCase())
        );
        score += sharedTags.length * 0.2;

        // Normalize
        score = Math.min(score, 1);

        return { item, score };
      });

    scored.sort((a, b) => b.score - a.score);

    const topItems = scored.slice(0, limit);
    const avgScore = topItems.length > 0
      ? topItems.reduce((sum, s) => sum + s.score, 0) / topItems.length
      : 0;

    return {
      items: topItems.map(s => this.itemToRecommendation(s.item, s.score)),
      reason: 'personalized',
      confidence: Math.min(avgScore, 1),
      algorithm: 'Personalized (User History + Preferences)',
    };
  }

  /**
   * Get hybrid recommendations combining multiple algorithms
   */
  getHybridRecommendations(options: RecommendationOptions = {}): RecommendationResult {
    const defaultWeights = {
      contentBased: 0.25,
      popularity: 0.25,
      trending: 0.25,
      personalized: 0.25,
    };

    const weights = { ...defaultWeights, ...options.weights };

    // Get results from each algorithm
    const results = [
      { result: this.getPopularContent(options), weight: weights.popularity },
      { result: this.getTrendingContent(options), weight: weights.trending },
      { result: this.getPersonalizedRecommendations(options), weight: weights.personalized },
    ];

    // Merge and deduplicate by slug
    const itemMap = new Map<string, { score: number; item: RecommendationContentItem }>();

    results.forEach(({ result, weight }) => {
      result.items.forEach((item) => {
        const existing = itemMap.get(item.slug);
        const weighted = (item.score || 0) * weight;

        if (existing) {
          existing.score += weighted;
        } else {
          itemMap.set(item.slug, { score: weighted, item });
        }
      });
    });

    // Sort by combined score
    const items = Array.from(itemMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, options.limit || 5)
      .map(s => ({
        ...s.item,
        score: Math.min(s.score, 1),
      }));

    const avgScore = items.length > 0
      ? items.reduce((sum, item) => sum + (item.score || 0), 0) / items.length
      : 0;

    return {
      items,
      reason: 'personalized',
      confidence: Math.min(avgScore, 1),
      algorithm: 'Hybrid (Popular + Trending + Personalized)',
    };
  }

  /**
   * Convert ContentItem to RecommendationContentItem
   */
  private itemToRecommendation(
    item: ContentItem,
    score?: number
  ): RecommendationContentItem {
    const analytics = getAllAnalytics();
    const analyticsId = `${item.meta.category}/${item.meta.slug}`;
    const views = analytics.views[analyticsId] || 0;

    return {
      id: `${item.meta.category}/${item.meta.slug}`,
      title: item.meta.title,
      slug: item.meta.slug,
      category: item.meta.category,
      tags: item.meta.tags,
      views,
      score: score ? Math.min(score, 1) : 0,
    };
  }
}

/**
 * Factory function to create engine from content items
 */
export function createRecommendationsEngine(contentItems: ContentItem[]): RecommendationsEngine {
  return new RecommendationsEngine(contentItems);
}
