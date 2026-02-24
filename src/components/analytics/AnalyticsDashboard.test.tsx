/**
 * Tests for Analytics Dashboard Components
 * @module tests/components/analytics
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Eye } from 'lucide-react';
import { MetricCard } from './MetricCard';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe('MetricCard', () => {
  it('should render label and value', () => {
    render(
      <MetricCard
        label="Total Views"
        value={1234}
        icon={Eye}
      />
    );

    expect(screen.getByText('Total Views')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('should format values with custom formatter', () => {
    render(
      <MetricCard
        label="Big Number"
        value={1234567}
        icon={Eye}
        formatter={(v) => `${v} views`}
      />
    );

    expect(screen.getByText('1234567 views')).toBeInTheDocument();
  });

  it('should show positive trend indicator', () => {
    render(
      <MetricCard
        label="Growth"
        value={100}
        trend="up"
        trendPercent={15}
        icon={Eye}
      />
    );

    // Check trend exists (format: +15%)
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('should not show trend when not provided', () => {
    const { container } = render(
      <MetricCard
        label="Neutral"
        value={100}
        icon={Eye}
      />
    );

    // Without trend, there shouldn't be a trend percentage display
    expect(screen.queryByText(/\+\d+%/)).not.toBeInTheDocument();
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });
});
