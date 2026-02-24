/**
 * React Hooks for AI-Powered Recommendations Engine
 * Provides composable hooks with React Query integration for caching and automatic refetching
 */

import { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query';
import { getAllContent } from '@/lib/content';
import {
  createRecommendationsEngine,
  type RecommendationResult,
  type RecommendationContentItem,
} from './engine';

// Query key factory for consistent React Query usage
const recommendationKeys = {
  all: () => ['recommendations'] as const,
  similar: (contentId: string) => [...recommendationKeys.all(), 'similar', contentId] as const,
  popular: () => [...recommendationKeys.all(), 'popular'] as const,
  trending: () => [...recommendationKeys.all(), 'trending'] as const,
  personalized: () => [...recommendationKeys.all(), 'personalized'] as const,
};

/**
 * Hook: Get content recommendations similar to a given item
 * Content-Based Filtering using category, tags, and difficulty
 */
export function useRecommendations(
  contentId: string,
  limit: number = 3
): UseQueryResult<RecommendationResult, Error> {
  return useQuery({
    queryKey: recommendationKeys.similar(contentId),
    queryFn: async () => {
      const content = getAllContent();
      const engine = createRecommendationsEngine(content);

      // Find the source content item
      const sourceItem = content.find(
        item => item.meta.slug === contentId
      );

      if (!sourceItem) {
        throw new Error(`Content with id "${contentId}" not found`);
      }

      return engine.getSimilarContent(sourceItem, {
        limit,
        minConfidence: 0.2,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 1,
  });
}

/**
 * Hook: Get trending content based on view growth
 * Analyzes 24h vs 7d view velocity
 */
export function useTrendingContent(
  limit: number = 5
): UseQueryResult<RecommendationContentItem[], Error> {
  return useQuery({
    queryKey: recommendationKeys.trending(),
    queryFn: async () => {
      const content = getAllContent();
      const engine = createRecommendationsEngine(content);
      const result = engine.getTrendingContent({ limit });
      return result.items;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook: Get popular content by view count
 * Simple but effective popularity ranking
 */
export function usePopularContent(
  limit: number = 5
): UseQueryResult<RecommendationContentItem[], Error> {
  return useQuery({
    queryKey: recommendationKeys.popular(),
    queryFn: async () => {
      const content = getAllContent();
      const engine = createRecommendationsEngine(content);
      const result = engine.getPopularContent({ limit });
      return result.items;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook: Get personalized recommendations based on user history
 * Analyzes viewing history, searches, and category preferences
 */
export function usePersonalizedFeed(
  limit: number = 5
): UseQueryResult<RecommendationContentItem[], Error> {
  return useQuery({
    queryKey: recommendationKeys.personalized(),
    queryFn: async () => {
      const content = getAllContent();
      const engine = createRecommendationsEngine(content);
      const result = engine.getPersonalizedRecommendations({ limit });
      return result.items;
    },
    staleTime: 5 * 60 * 1000, // More frequent updates for personalized
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook: Get hybrid recommendations combining all algorithms
 * Weights: 25% popular, 25% trending, 25% personalized
 */
export function useHybridRecommendations(
  limit: number = 5,
  weights?: {
    popularity?: number;
    trending?: number;
    personalized?: number;
  }
): UseQueryResult<RecommendationContentItem[], Error> {
  return useQuery({
    queryKey: ['recommendations', 'hybrid', limit, weights],
    queryFn: async () => {
      const content = getAllContent();
      const engine = createRecommendationsEngine(content);
      const result = engine.getHybridRecommendations({
        limit,
        weights,
      });
      return result.items;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook: Get recommendation metadata with confidence scores
 * Returns full RecommendationResult with algorithm info
 */
export function useRecommendationMetadata(
  contentId: string,
  algorithm: 'similar' | 'popular' | 'trending' | 'personalized' = 'similar',
  limit: number = 3
): UseQueryResult<RecommendationResult, Error> {
  return useQuery({
    queryKey: ['recommendations', algorithm, contentId, limit],
    queryFn: async () => {
      const content = getAllContent();
      const engine = createRecommendationsEngine(content);

      const sourceItem = content.find(
        item => item.meta.slug === contentId
      );

      if (!sourceItem && algorithm !== 'popular' && algorithm !== 'trending') {
        throw new Error(`Content with id "${contentId}" not found`);
      }

      switch (algorithm) {
        case 'similar':
          if (!sourceItem) throw new Error('Content not found');
          return engine.getSimilarContent(sourceItem, { limit });
        case 'popular':
          return engine.getPopularContent({ limit });
        case 'trending':
          return engine.getTrendingContent({ limit });
        case 'personalized':
          return engine.getPersonalizedRecommendations({ limit });
        default:
          throw new Error(`Unknown algorithm: ${algorithm}`);
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook: Get multiple recommendation types in parallel
 * Useful for dashboard-style layouts
 */
export function useMultipleRecommendations(
  contentId: string | undefined,
  options?: {
    limits?: {
      similar?: number;
      popular?: number;
      trending?: number;
      personalized?: number;
    };
  }
): {
  similar: UseQueryResult<RecommendationResult, Error> | null;
  popular: UseQueryResult<RecommendationContentItem[], Error>;
  trending: UseQueryResult<RecommendationContentItem[], Error>;
  personalized: UseQueryResult<RecommendationContentItem[], Error>;
  isLoading: boolean;
  isError: boolean;
} {
  const limits = options?.limits || {
    similar: 3,
    popular: 5,
    trending: 5,
    personalized: 5,
  };

  // Always call all hooks in consistent order to avoid React Hook rules violation
  const similarQuery = useQuery({
    queryKey: contentId ? recommendationKeys.similar(contentId) : ['recommendations', 'similar', 'disabled'],
    queryFn: async () => {
      if (!contentId) throw new Error('Content ID required');
      const content = getAllContent();
      const engine = createRecommendationsEngine(content);
      const sourceItem = content.find(item => item.meta.slug === contentId);
      if (!sourceItem) throw new Error('Content not found');
      return engine.getSimilarContent(sourceItem, { limit: limits.similar || 3 });
    },
    enabled: !!contentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  const popularQuery = usePopularContent(limits.popular || 5);
  const trendingQuery = useTrendingContent(limits.trending || 5);
  const personalizedQuery = usePersonalizedFeed(limits.personalized || 5);

  const isLoading =
    (contentId && similarQuery.isLoading) ||
    popularQuery.isLoading ||
    trendingQuery.isLoading ||
    personalizedQuery.isLoading;

  const isError =
    (contentId && similarQuery.isError) ||
    popularQuery.isError ||
    trendingQuery.isError ||
    personalizedQuery.isError;

  return {
    similar: contentId ? similarQuery : null,
    popular: popularQuery,
    trending: trendingQuery,
    personalized: personalizedQuery,
    isLoading,
    isError,
  };
}

/**
 * Hook: Refresh recommendations manually
 * Useful for real-time updates or user-triggered refreshes
 */
export function useRecommendationRefresh(
  contentId: string,
  algorithm: 'similar' | 'popular' | 'trending' | 'personalized' = 'similar'
): {
  refresh: () => void;
  isRefetching: boolean;
} {
  const query = useRecommendationMetadata(contentId, algorithm);

  return {
    refresh: () => {
      query.refetch();
    },
    isRefetching: query.isRefetching,
  };
}

/**
 * Hook: Get recommendation confidence assessment
 * Returns confidence score and recommendation strength
 */
export function useRecommendationConfidence(
  contentId: string,
  limit: number = 3
): {
  confidence: number;
  strength: 'low' | 'medium' | 'high' | 'very_high';
  recommendation: RecommendationResult | undefined;
  isLoading: boolean;
} {
  const { data, isLoading } = useRecommendationMetadata(contentId, 'similar', limit);

  const getStrength = (confidence: number): 'low' | 'medium' | 'high' | 'very_high' => {
    if (confidence >= 0.75) return 'very_high';
    if (confidence >= 0.5) return 'high';
    if (confidence >= 0.3) return 'medium';
    return 'low';
  };

  return {
    confidence: data?.confidence || 0,
    strength: getStrength(data?.confidence || 0),
    recommendation: data,
    isLoading,
  };
}

/**
 * Hook: Watch analytics changes and refetch recommendations
 * Automatically updates recommendations when analytics data changes
 */
export function useAutoRefreshRecommendations(
  contentId: string,
  enabled: boolean = true
): UseQueryResult<RecommendationResult, Error> {
  const query = useRecommendations(contentId);
  const [lastAnalyticsCheck, setLastAnalyticsCheck] = useState(Date.now());

  useEffect(() => {
    if (!enabled) return;

    // Check for analytics changes every 30 seconds
    const interval = setInterval(() => {
      const now = Date.now();
      // If 30 seconds have passed, refetch
      if (now - lastAnalyticsCheck >= 30000) {
        query.refetch();
        setLastAnalyticsCheck(now);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [enabled, lastAnalyticsCheck, query]);

  return query;
}
