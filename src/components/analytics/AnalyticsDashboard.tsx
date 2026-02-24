'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Eye, Search, MousePointer } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getAllAnalytics, getPopularSearches, getContentAnalytics } from '@/lib/analytics';
import MetricCard from './MetricCard';
import { cn } from '@/lib/utils';

/**
 * Analytics Dashboard Component
 *
 * Comprehensive dashboard displaying:
 * - Key metrics (views, searches, average CTR)
 * - 7-day view trend with line chart
 * - Top 10 content by views with bar chart
 * - Category distribution with pie chart
 * - Popular searches list
 *
 * All data sourced from localStorage via analytics.ts
 */
export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Get all analytics data
  const analyticsData = useMemo(() => getAllAnalytics(), []);
  const popularSearches = useMemo(() => getPopularSearches(10), []);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalViews = Object.values(analyticsData.views).reduce((a, b) => a + b, 0);
    const totalSearches = Object.values(analyticsData.searches).reduce((a, b) => a + b, 0);
    const totalClicks = analyticsData.events.filter(
      (e) => e.event === 'click_external'
    ).length;

    const avgCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    return {
      totalViews,
      totalSearches,
      avgCTR,
      totalClicks,
    };
  }, [analyticsData]);

  // Prepare 7-day view trend data
  const viewTrendData = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const dailyData: Record<string, number> = {};

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString('pt-BR', {
        month: 'short',
        day: 'numeric',
      });
      dailyData[dateStr] = 0;
    }

    // Count events by day
    analyticsData.events.forEach((event) => {
      if (event.event === 'view_content' && event.timestamp > sevenDaysAgo) {
        const date = new Date(event.timestamp);
        const dateStr = date.toLocaleDateString('pt-BR', {
          month: 'short',
          day: 'numeric',
        });
        dailyData[dateStr] = (dailyData[dateStr] || 0) + 1;
      }
    });

    return Object.entries(dailyData).map(([date, views]) => ({
      date,
      views,
    }));
  }, [analyticsData.events]);

  // Prepare top 10 content data
  const topContentData = useMemo(() => {
    return Object.entries(analyticsData.views)
      .map(([contentId, views]) => {
        const analytics = getContentAnalytics(contentId);
        return {
          contentId,
          title: `Content ${contentId.slice(0, 8)}...`,
          views,
          clicks: analytics.clicks,
          ctr: analytics.ctr,
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }, [analyticsData.views]);

  // Prepare category distribution data
  const categoryDistribution = useMemo(() => {
    const categories: Record<string, number> = {};

    analyticsData.events.forEach((event) => {
      if (event.category) {
        categories[event.category] = (categories[event.category] || 0) + 1;
      }
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [analyticsData.events]);

  // Colors for charts
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="space-y-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Real-time insights from your audience interactions
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <MetricCard
          icon={Eye}
          label="Total Views"
          value={metrics.totalViews}
          trend={metrics.totalViews > 0 ? 'up' : null}
          formatter={(v) => v.toLocaleString()}
        />
        <MetricCard
          icon={Search}
          label="Total Searches"
          value={metrics.totalSearches}
          trend={metrics.totalSearches > 0 ? 'up' : null}
          formatter={(v) => v.toLocaleString()}
        />
        <MetricCard
          icon={MousePointer}
          label="Avg CTR"
          value={metrics.avgCTR}
          trend={metrics.avgCTR > 0 ? 'up' : null}
          formatter={(v) => `${v.toFixed(2)}%`}
        />
      </motion.div>

      {/* Charts Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div variants={itemVariants}>
          <TabsList className="grid w-full grid-cols-3 dark:bg-slate-900 dark:border dark:border-slate-700">
            <TabsTrigger value="overview" className="dark:data-[state=active]:bg-slate-800">
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="dark:data-[state=active]:bg-slate-800">
              Content
            </TabsTrigger>
            <TabsTrigger value="searches" className="dark:data-[state=active]:bg-slate-800">
              Searches
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Views Trend (7 Days)</CardTitle>
                <CardDescription>
                  Daily content view distribution over the last week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={viewTrendData}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="dark:stroke-slate-700"
                      />
                      <XAxis
                        dataKey="date"
                        className="dark:text-slate-400 text-xs"
                      />
                      <YAxis className="dark:text-slate-400 text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 5 }}
                        activeDot={{ r: 7 }}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>
                  Breakdown of interactions by content category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  {categoryDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No category data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Top 10 Content by Views</CardTitle>
                <CardDescription>
                  Most viewed content with engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  {topContentData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topContentData}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="dark:stroke-slate-700"
                        />
                        <XAxis
                          dataKey="title"
                          className="dark:text-slate-400 text-xs"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis className="dark:text-slate-400 text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="views"
                          fill="#3b82f6"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="clicks"
                          fill="#8b5cf6"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No content data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Searches Tab */}
        <TabsContent value="searches" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card className="dark:bg-slate-900 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Top 10 Popular Searches</CardTitle>
                <CardDescription>
                  Most frequently searched terms by your users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularSearches.length > 0 ? (
                    popularSearches.map((search, index) => (
                      <motion.div
                        key={search.query}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted dark:bg-slate-800 border border-border dark:border-slate-700 hover:bg-muted/80 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground dark:text-foreground text-sm">
                              {search.query}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="dark:bg-slate-700 dark:text-slate-100"
                        >
                          {search.count} search{search.count !== 1 ? 'es' : ''}
                        </Badge>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No search data available yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default AnalyticsDashboard;
