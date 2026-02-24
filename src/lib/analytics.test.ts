/**
 * Tests for Analytics System
 * @module tests/analytics
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  trackEvent,
  trackContentView,
  trackSearch,
  trackFilter,
  getPopularSearches,
  getContentAnalytics,
  getAllAnalytics,
  clearAnalytics,
} from './analytics';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Analytics System', () => {
  beforeEach(() => {
    localStorageMock.clear();
    clearAnalytics();
  });

  describe('trackEvent', () => {
    it('should track view_content events', () => {
      trackEvent({
        event: 'view_content',
        content_id: 'test-article',
        category: 'ai-tools',
      });

      const data = getAllAnalytics();
      expect(data.events).toHaveLength(1);
      expect(data.events[0].event).toBe('view_content');
      expect(data.events[0].content_id).toBe('test-article');
    });

    it('should track search events and update aggregates', () => {
      trackEvent({
        event: 'search',
        search_query: 'ChatGPT',
      });

      const data = getAllAnalytics();
      expect(data.searches['chatgpt']).toBe(1);
    });

    it('should increment view counts', () => {
      trackContentView('article-1', 'ai-tools');
      trackContentView('article-1', 'ai-tools');
      trackContentView('article-1', 'ai-tools');

      const data = getAllAnalytics();
      expect(data.views['article-1']).toBe(3);
    });
  });

  describe('trackSearch', () => {
    it('should ignore empty queries', () => {
      trackSearch('');
      trackSearch('a'); // too short

      const data = getAllAnalytics();
      expect(data.events).toHaveLength(0);
    });

    it('should normalize and count searches', () => {
      trackSearch('ChatGPT');
      trackSearch('CHATGPT');
      trackSearch('chatgpt');

      const popular = getPopularSearches();
      expect(popular[0].query).toBe('chatgpt');
      expect(popular[0].count).toBe(3);
    });
  });

  describe('trackFilter', () => {
    it('should track category filters', () => {
      trackFilter('category', 'ai-tools');

      const data = getAllAnalytics();
      expect(data.events[0].event).toBe('filter_category');
    });

    it('should track pricing filters', () => {
      trackFilter('pricing', 'free');

      const data = getAllAnalytics();
      expect(data.events[0].event).toBe('filter_pricing');
    });
  });

  describe('getPopularSearches', () => {
    it('should return top searches sorted by count', () => {
      trackSearch('react');
      trackSearch('react');
      trackSearch('react');
      trackSearch('vue');
      trackSearch('vue');
      trackSearch('angular');

      const popular = getPopularSearches(2);
      expect(popular).toHaveLength(2);
      expect(popular[0].query).toBe('react');
      expect(popular[0].count).toBe(3);
      expect(popular[1].query).toBe('vue');
      expect(popular[1].count).toBe(2);
    });
  });

  describe('getContentAnalytics', () => {
    it('should calculate views, clicks, and CTR', () => {
      // 10 views
      for (let i = 0; i < 10; i++) {
        trackContentView('article-1', 'ai-tools');
      }
      
      // 2 clicks
      trackEvent({ event: 'click_external', content_id: 'article-1', metadata: { url: 'https://example.com' } });
      trackEvent({ event: 'click_external', content_id: 'article-1', metadata: { url: 'https://example.com' } });

      const analytics = getContentAnalytics('article-1');
      expect(analytics.views).toBe(10);
      expect(analytics.clicks).toBe(2);
      expect(analytics.ctr).toBe(20); // 2/10 * 100
    });

    it('should handle content with no data', () => {
      const analytics = getContentAnalytics('non-existent');
      expect(analytics.views).toBe(0);
      expect(analytics.clicks).toBe(0);
      expect(analytics.ctr).toBe(0);
    });
  });

  describe('clearAnalytics', () => {
    it('should clear all analytics data', () => {
      trackContentView('article-1', 'ai-tools');
      trackSearch('test');

      clearAnalytics();

      const data = getAllAnalytics();
      expect(data.events).toHaveLength(0);
      expect(Object.keys(data.views)).toHaveLength(0);
      expect(Object.keys(data.searches)).toHaveLength(0);
    });
  });
});
