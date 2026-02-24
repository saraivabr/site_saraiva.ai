import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Props for MetricCard component
 */
interface MetricCardProps {
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Metric label/title */
  label: string;
  /** Numeric value to display */
  value: number;
  /** Optional trend indicator (positive or negative) */
  trend?: 'up' | 'down' | null;
  /** Trend percentage change */
  trendPercent?: number;
  /** Custom styling for the card */
  className?: string;
  /** Format function for the value (default: no decimals) */
  formatter?: (value: number) => string;
}

/**
 * MetricCard component
 *
 * Displays a single metric with icon, value, and optional trend indicator.
 * Features smooth animations and dark theme support.
 *
 * @example
 * ```tsx
 * <MetricCard
 *   icon={Eye}
 *   label="Total Views"
 *   value={2543}
 *   trend="up"
 *   trendPercent={12.5}
 *   formatter={(v) => v.toLocaleString()}
 * />
 * ```
 */
export function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  trendPercent = 0,
  className,
  formatter = (v) => Math.round(v).toString(),
}: MetricCardProps) {
  const isTrendUp = trend === 'up';
  const isTrendDown = trend === 'down';
  const showTrend = isTrendUp || isTrendDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/5">
            <Icon className="h-4 w-4 text-primary dark:text-primary" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground">
              {formatter(value)}
            </div>

            {showTrend && (
              <div className="flex items-center gap-1 text-xs">
                <div
                  className={cn(
                    'flex items-center gap-0.5 font-semibold',
                    isTrendUp && 'text-green-600 dark:text-green-400',
                    isTrendDown && 'text-red-600 dark:text-red-400'
                  )}
                >
                  {isTrendUp && <TrendingUp className="h-3 w-3" />}
                  {isTrendDown && <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(trendPercent).toFixed(1)}%</span>
                </div>
                <span className="text-muted-foreground dark:text-muted-foreground">
                  vs last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MetricCard;
