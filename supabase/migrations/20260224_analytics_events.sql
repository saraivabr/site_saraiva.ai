-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event VARCHAR(50) NOT NULL,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  category VARCHAR(50),
  search_query TEXT,
  metadata JSONB,
  user_ip_hash VARCHAR(64), -- SHA-256 hash for privacy
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_analytics_events_event ON analytics_events(event);
CREATE INDEX idx_analytics_events_content_id ON analytics_events(content_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_category ON analytics_events(category);

-- Popular searches tracking
CREATE TABLE IF NOT EXISTS popular_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 1,
  last_searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_popular_searches_count ON popular_searches(count DESC);
CREATE INDEX idx_popular_searches_last_searched ON popular_searches(last_searched_at DESC);

-- Function to increment search count
CREATE OR REPLACE FUNCTION increment_search_count(search_query TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO popular_searches (query, count, last_searched_at)
  VALUES (search_query, 1, NOW())
  ON CONFLICT (query) 
  DO UPDATE SET 
    count = popular_searches.count + 1,
    last_searched_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- View for analytics summary
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
  DATE(created_at) as date,
  event,
  category,
  COUNT(*) as event_count
FROM analytics_events
GROUP BY DATE(created_at), event, category
ORDER BY date DESC, event_count DESC;

COMMENT ON TABLE analytics_events IS 'Tracks user interactions for analytics and recommendations';
COMMENT ON TABLE popular_searches IS 'Stores popular search queries with frequency count';
