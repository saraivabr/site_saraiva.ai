const STORAGE_KEY = 'saraiva-analytics';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  timestamp: number;
}

interface PageView {
  pathname: string;
  timestamp: number;
}

interface ScrollRecord {
  maxDepth: number;
  timestamp: number;
}

interface AnalyticsData {
  events: AnalyticsEvent[];
  pageViews: PageView[];
  scrollDepth: ScrollRecord[];
}

function getStoredData(): AnalyticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data — reset
  }
  return { events: [], pageViews: [], scrollDepth: [] };
}

function save(data: AnalyticsData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full — silently fail
  }
}

export function trackEvent(category: string, action: string, label?: string): void {
  const data = getStoredData();
  data.events.push({ category, action, label, timestamp: Date.now() });
  save(data);
}

export function trackPageView(): void {
  const data = getStoredData();
  data.pageViews.push({ pathname: window.location.pathname, timestamp: Date.now() });
  save(data);
}

export function trackScrollDepth(percentage: number): void {
  const data = getStoredData();
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));
  const last = data.scrollDepth[data.scrollDepth.length - 1];
  if (!last || clamped > last.maxDepth) {
    data.scrollDepth.push({ maxDepth: clamped, timestamp: Date.now() });
    save(data);
  }
}

export function getAnalytics(): AnalyticsData {
  return getStoredData();
}

export function clearAnalytics(): void {
  localStorage.removeItem(STORAGE_KEY);
}
