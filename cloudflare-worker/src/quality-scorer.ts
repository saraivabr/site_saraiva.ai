import type { Env, SourceItem } from './types';

export interface QualityScore {
  overall: number; // 1-10
  relevance: number; // 1-10 (how relevant to AI/tech)
  sentiment: 'positive' | 'neutral' | 'negative';
  freshness: number; // 1-10 (how recent)
  credibility: number; // 1-10 (source reputation)
  shouldPublish: boolean;
}

const MIN_QUALITY_THRESHOLD = 6;
const MIN_RELEVANCE_THRESHOLD = 5;

/**
 * Evaluate content quality using Claude API
 */
export async function evaluateQuality(
  item: SourceItem,
  env: Env
): Promise<QualityScore> {
  try {
    const prompt = `Evaluate the following AI/tech content for quality and relevance:

Title: ${item.title}
Description: ${item.description}
Source: ${item.source}
Date: ${item.date}

Rate the following on a scale of 1-10:
1. **Quality**: Writing quality, clarity, depth, usefulness
2. **Relevance**: How relevant is this to AI, machine learning, or technology?
3. **Credibility**: Based on the source and content, how credible is this?

Also determine:
- **Sentiment**: positive, neutral, or negative
- **Freshness**: How timely/current is this information? (10 = breaking news, 1 = outdated)

Respond ONLY with valid JSON in this exact format:
{
  "quality": <number 1-10>,
  "relevance": <number 1-10>,
  "credibility": <number 1-10>,
  "sentiment": "<positive|neutral|negative>",
  "freshness": <number 1-10>
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: prompt,
        }],
      }),
    });

    if (!response.ok) {
      console.error('[QualityScorer] Claude API error:', response.status);
      return getFallbackScore(item);
    }

    const data: any = await response.json();
    const content = data.content?.[0]?.text;
    
    if (!content) {
      return getFallbackScore(item);
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[QualityScorer] No JSON found in response');
      return getFallbackScore(item);
    }

    const scores = JSON.parse(jsonMatch[0]);
    
    // Calculate overall score (weighted average)
    const overall = Math.round(
      (scores.quality * 0.4) +
      (scores.relevance * 0.3) +
      (scores.credibility * 0.2) +
      (scores.freshness * 0.1)
    );

    const shouldPublish = 
      overall >= MIN_QUALITY_THRESHOLD && 
      scores.relevance >= MIN_RELEVANCE_THRESHOLD;

    return {
      overall,
      relevance: scores.relevance,
      sentiment: scores.sentiment,
      freshness: scores.freshness,
      credibility: scores.credibility,
      shouldPublish,
    };
  } catch (err) {
    console.error('[QualityScorer] Evaluation failed:', err);
    return getFallbackScore(item);
  }
}

/**
 * Fallback scoring when Claude API fails
 * Uses heuristics based on source and recency
 */
function getFallbackScore(item: SourceItem): QualityScore {
  // Source credibility mapping
  const sourceCredibility: Record<string, number> = {
    'hackernews': 8,
    'producthunt': 7,
    'futurepedia': 7,
    'rundown': 8,
    'rss': 6,
  };

  // Calculate freshness based on date
  const now = new Date();
  const itemDate = new Date(item.date);
  const daysOld = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let freshness = 10;
  if (daysOld > 7) freshness = 7;
  if (daysOld > 30) freshness = 5;
  if (daysOld > 90) freshness = 3;

  const credibility = sourceCredibility[item.source.toLowerCase()] || 5;
  
  // Assume neutral quality for fallback
  const quality = 7;
  const relevance = 7; // Assume relevant since it passed source filters

  const overall = Math.round(
    (quality * 0.4) +
    (relevance * 0.3) +
    (credibility * 0.2) +
    (freshness * 0.1)
  );

  return {
    overall,
    relevance,
    sentiment: 'neutral',
    freshness,
    credibility,
    shouldPublish: overall >= MIN_QUALITY_THRESHOLD,
  };
}

/**
 * Batch evaluate multiple items
 */
export async function evaluateQualityBatch(
  items: SourceItem[],
  env: Env
): Promise<Map<string, QualityScore>> {
  const scores = new Map<string, QualityScore>();
  
  // Evaluate in parallel (max 3 concurrent to avoid rate limits)
  const batchSize = 3;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(item => evaluateQuality(item, env))
    );
    
    batch.forEach((item, index) => {
      scores.set(item.url, results[index]);
    });
  }

  return scores;
}
