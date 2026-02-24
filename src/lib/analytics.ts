/**
 * Analytics System for SARAIVA.AI
 * Hybrid approach: localStorage for fast client-side tracking + server-side aggregation
 * 
 * NOTE: Once Supabase tables are created (analytics_events, popular_searches),
 * uncomment the server-side tracking sections below.
 */

export type AnalyticsEvent = 
  | 'view_content'
  | 'click_external'
  | 'search'
  | 'filter_category'
  | 'filter_pricing'
  | 'share_content'
  | 'copy_prompt';

interface TrackEventParams {
  event: AnalyticsEvent;
  content_id?: string;
  category?: string;
  search_query?: string;
  metadata?: Record<string, any>;
}

interface AnalyticsData {
  events: Array<TrackEventParams & { timestamp: number }>;
  views: Record<string, number>;
  searches: Record<string, number>;
}

const STORAGE_KEY = 'saraiva-analytics-v2';
const BATCH_SYNC_INTERVAL = 60000; // Sync to server every 60s
const MAX_LOCAL_EVENTS = 100; // Keep last 100 events locally

/**
 * Get stored analytics data
 */
function getStoredData(): AnalyticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Corrupted data - reset
  }
  return { events: [], views: {}, searches: {} };
}

/**
 * Save analytics data locally
 */
function saveData(data: AnalyticsData): void {
  try {
    // Keep only last MAX_LOCAL_EVENTS
    if (data.events.length > MAX_LOCAL_EVENTS) {
      data.events = data.events.slice(-MAX_LOCAL_EVENTS);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full - fail silently
  }
}

/**
 * Track analytics event (client-side only for now)
 * TODO: Enable server-side sync after running migrations
 */
export function trackEvent(params: TrackEventParams): void {
  try {
    const data = getStoredData();
    
    // Add to events log
    data.events.push({
      ...params,
      timestamp: Date.now(),
    });

    // Update aggregates
    if (params.event === 'view_content' && params.content_id) {
      data.views[params.content_id] = (data.views[params.content_id] || 0) + 1;
    }

    if (params.event === 'search' && params.search_query) {
      const query = params.search_query.toLowerCase().trim();
      data.searches[query] = (data.searches[query] || 0) + 1;
    }

    saveData(data);

    // TODO: Uncomment after running migrations
    // syncToServer(params);
  } catch (err) {
    console.warn('[Analytics] Error tracking event:', err);
  }
}

/**
 * Sync events to server (placeholder for future implementation)
 */
// async function syncToServer(params: TrackEventParams): Promise<void> {
//   try {
//     const { error } = await supabase
//       .from('analytics_events')
//       .insert({
//         event: params.event,
//         content_id: params.content_id || null,
//         category: params.category || null,
//         search_query: params.search_query || null,
//         metadata: params.metadata || null,
//         user_agent: navigator.userAgent,
//         referrer: document.referrer || null,
//       });

//     if (error) {
//       console.error('[Analytics] Server sync failed:', error);
//     }
//   } catch (err) {
//     console.warn('[Analytics] Server sync error:', err);
//   }
// }

/**
 * Track content view
 */
export function trackContentView(contentId: string, category: string): void {
  trackEvent({
    event: 'view_content',
    content_id: contentId,
    category,
  });
}

/**
 * Track external link click
 */
export function trackExternalClick(contentId: string, url: string): void {
  trackEvent({
    event: 'click_external',
    content_id: contentId,
    metadata: { url },
  });
}

/**
 * Track search query
 */
export function trackSearch(query: string, category?: string): void {
  if (!query || query.length < 2) return;
  
  trackEvent({
    event: 'search',
    search_query: query.toLowerCase().trim(),
    category,
  });
}

/**
 * Track filter usage
 */
export function trackFilter(filterType: 'category' | 'pricing', value: string): void {
  trackEvent({
    event: filterType === 'category' ? 'filter_category' : 'filter_pricing',
    metadata: { [filterType]: value },
  });
}

/**
 * Get popular searches (client-side)
 */
export function getPopularSearches(limit = 10): Array<{ query: string; count: number }> {
  const data = getStoredData();
  return Object.entries(data.searches)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get content analytics (client-side)
 */
export function getContentAnalytics(contentId: string) {
  const data = getStoredData();
  const views = data.views[contentId] || 0;
  const clicks = data.events.filter(
    e => e.event === 'click_external' && e.content_id === contentId
  ).length;
  const ctr = views > 0 ? (clicks / views) * 100 : 0;

  return { views, clicks, ctr };
}

/**
 * Get all analytics data
 */
export function getAllAnalytics(): AnalyticsData {
  return getStoredData();
}

/**
 * Clear analytics data
 */
export function clearAnalytics(): void {
  localStorage.removeItem(STORAGE_KEY);
}
