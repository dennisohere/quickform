import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, FileText, Users, TrendingUp, Calendar, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '@/components/ui/chart';

interface Stats {
  totalSurveys: number;
  publishedSurveys: number;
  totalResponses: number;
  totalQuestions: number;
}

interface RecentResponse {
  id: string;
  respondent_name?: string;
  respondent_email?: string;
  created_at: string;
  survey: {
    id: string;
    title: string;
  };
}

interface ResponseTrend {
  date: string;
  count: number;
}

interface SurveyPerformance {
  id: string;
  title: string;
  questions_count: number;
  responses_count: number;
}

interface Props {
  stats: Stats;
  recentResponses: RecentResponse[];
  responseTrends: ResponseTrend[];
  surveyPerformance: SurveyPerformance[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: route('admin.dashboard'),
  },
  {
    title: 'Analytics',
            href: route('admin.analytics.index'),
  },
];

export default function AnalyticsIndex({ stats, recentResponses, responseTrends, surveyPerformance }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Analytics" />
      
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="d-stats shadow">
          <div className="d-stat">
            <div className="d-stat-figure text-primary">
              <FileText strokeWidth={0.6} className='size-16'/>
            </div>
            <div className="d-stat-title font-medium">Total Surveys</div>
            <div className="d-stat-value text-primary">{stats.totalSurveys}</div>
            <div className="d-stat-desc">{stats.publishedSurveys} published</div>
          </div>

          <div className="d-stat">
            <div className="d-stat-figure text-secondary">
              <Users strokeWidth={0.6} className='size-16'/>
            </div>
            <div className="d-stat-title font-medium">Total Responses</div>
            <div className="d-stat-value text-secondary">{stats.totalResponses}</div>
            <div className="d-stat-desc">Across all surveys</div>
          </div>

          <div className="d-stat">
            <div className="d-stat-figure text-accent">
              <BarChart3 strokeWidth={0.6} className='size-16'/>
            </div>
            <div className="d-stat-title font-medium">Total Questions</div>
            <div className="d-stat-value text-accent">{stats.totalQuestions}</div>
            <div className="d-stat-desc">Questions created</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Survey Performance */}
          <div className="d-card bg-base-100 shadow-xl">
            <div className="d-card-body">
              <h2 className="d-card-title">Top Performing Surveys</h2>
              {surveyPerformance.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-base-content/70">No surveys yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {surveyPerformance.map((survey) => (
                    <div key={survey.id} className="d-card bg-base-200 shadow-sm">
                      <div className="d-card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{survey.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-base-content/70 mt-1">
                              <span>{survey.questions_count} questions</span>
                              <span>{survey.responses_count} responses</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={route('admin.analytics.survey', survey.id)}>
                              <button className="d-btn d-btn-outline d-btn-sm">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="d-card bg-base-100 shadow-xl">
            <div className="d-card-body">
              <h2 className="d-card-title">Recent Responses</h2>
              {recentResponses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-base-content/70">No responses yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentResponses.map((response) => (
                    <div key={response.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {response.respondent_name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-base-content/70">
                          {response.survey.title}
                        </p>
                        <p className="text-xs text-base-content/70">
                          {new Date(response.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={route('admin.analytics.survey', response.survey.id)}>
                        <button className="d-btn d-btn-outline d-btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response Trends Chart */}
        <div className="d-card bg-base-100 shadow-xl">
          <div className="d-card-body">
            <h2 className="d-card-title">Response Trends (Last 30 Days)</h2>
            {responseTrends.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/70">No response data available</p>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={responseTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: any) => {
                        if (!value) return '';
                        const date = new Date(String(value));
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                      interval={Math.ceil(responseTrends.length / 8)} // Show ~8 labels max
                      minTickGap={30} // Minimum gap between ticks
                    />
                    <YAxis 
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: any) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--b1))',
                        border: '1px solid hsl(var(--bc) / 0.2)',
                        borderRadius: 'var(--rounded-box)',
                        color: 'hsl(var(--bc))',
                      }}
                      labelFormatter={(value: any) => {
                        if (!value) return '';
                        const date = new Date(String(value));
                        return date.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        });
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--p))" 
                      fill="hsl(var(--p) / 0.1)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 