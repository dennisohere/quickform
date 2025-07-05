import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Users, CheckCircle, Calendar, Eye, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface Survey {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
  questions_count: number;
}

interface Stats {
  totalResponses: number;
  completedResponses: number;
  completionRate: number;
  respondentStats: {
    withName: number;
    withEmail: number;
    anonymous: number;
  };
}

interface ResponseTrend {
  date: string;
  count: number;
}

interface QuestionAnalytics {
  id: string;
  question_text: string;
  question_type: string;
  total_answers: number;
  response_rate: number;
  option_counts?: Record<string, number>;
}

interface RecentResponse {
  id: string;
  respondent_name?: string;
  respondent_email?: string;
  created_at: string;
  is_completed: boolean;
  questionResponses: Array<{
    question: {
      question_text: string;
    };
    answer: string;
  }>;
}

interface Props {
  survey: Survey;
  stats: Stats;
  responseTrends: ResponseTrend[];
  questionAnalytics: QuestionAnalytics[];
  recentResponses: RecentResponse[];
}

export default function SurveyAnalytics({
  survey,
  stats,
  responseTrends = [],
  questionAnalytics = [],
  recentResponses = [],
}: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: route('admin.dashboard'),
    },
    {
      title: 'Analytics',
      href: route('admin.analytics'),
    },
    {
      title: survey.title,
      href: route('admin.analytics.survey', survey.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Analytics - ${survey.title}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href={route('admin.analytics')}>
                <button className="d-btn d-btn-ghost d-btn-sm">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
              <h1 className="text-3xl font-bold">{survey.title}</h1>
            </div>
            {survey.description && (
              <p className="text-base-content/70">{survey.description}</p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <div className={`d-badge ${survey.is_published ? 'd-badge-success' : 'd-badge-neutral'}`}>
                {survey.is_published ? 'Published' : 'Draft'}
              </div>
              <span className="text-sm text-base-content/70">
                Created {new Date(survey.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="d-stats shadow">
          <div className="d-stat">
            <div className="d-stat-figure text-primary">
              <Users strokeWidth={0.6} className='size-16'/>
            </div>
            <div className="d-stat-title font-medium">Total Responses</div>
            <div className="d-stat-value text-primary">{stats.totalResponses}</div>
            <div className="d-stat-desc">All responses</div>
          </div>

          <div className="d-stat">
            <div className="d-stat-figure text-secondary">
              <CheckCircle strokeWidth={0.6} className='size-16'/>
            </div>
            <div className="d-stat-title font-medium">Completion Rate</div>
            <div className="d-stat-value text-secondary">{stats.completionRate}%</div>
            <div className="d-stat-desc">{stats.completedResponses} completed</div>
          </div>

          <div className="d-stat">
            <div className="d-stat-figure text-accent">
              <BarChart3 strokeWidth={0.6} className='size-16'/>
            </div>
            <div className="d-stat-title font-medium">Questions</div>
            <div className="d-stat-value text-accent">{survey.questions_count}</div>
            <div className="d-stat-desc">Total questions</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Response Trends */}
          <div className="d-card bg-base-100 shadow-xl">
            <div className="d-card-body">
              <h2 className="d-card-title">Response Trends (Last 90 Days)</h2>
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

          {/* Respondent Stats */}
          <div className="d-card bg-base-100 shadow-xl">
            <div className="d-card-body">
              <h2 className="d-card-title">Respondent Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">With Name</p>
                    <p className="text-sm text-base-content/70">Respondents who provided their name</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{stats.respondentStats.withName}</p>
                    <p className="text-xs text-base-content/70">
                      {stats.totalResponses > 0 ? Math.round((stats.respondentStats.withName / stats.totalResponses) * 100) : 0}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">With Email</p>
                    <p className="text-sm text-base-content/70">Respondents who provided their email</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">{stats.respondentStats.withEmail}</p>
                    <p className="text-xs text-base-content/70">
                      {stats.totalResponses > 0 ? Math.round((stats.respondentStats.withEmail / stats.totalResponses) * 100) : 0}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">Anonymous</p>
                    <p className="text-sm text-base-content/70">Respondents who didn't provide name or email</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">{stats.respondentStats.anonymous}</p>
                    <p className="text-xs text-base-content/70">
                      {stats.totalResponses > 0 ? Math.round((stats.respondentStats.anonymous / stats.totalResponses) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Analytics */}
        <div className="d-card bg-base-100 shadow-xl">
          <div className="d-card-body">
            <h2 className="d-card-title">Question Performance</h2>
            {questionAnalytics.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/70">No question data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questionAnalytics.map((question) => (
                  <div key={question.id} className="d-card bg-base-200 shadow-sm">
                    <div className="d-card-body p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{question.question_text}</h3>
                          <div className="flex items-center gap-4 text-sm text-base-content/70 mt-1">
                            <span className="d-badge d-badge-xs">{question.question_type}</span>
                            <span>{question.total_answers} answers</span>
                            <span>{question.response_rate}% response rate</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Option counts for choice questions */}
                      {question.option_counts && Object.keys(question.option_counts).length > 0 && (
                        <div className="mt-4 space-y-2">
                          {Object.entries(question.option_counts).map(([option, count]) => (
                            <div key={option} className="flex items-center justify-between">
                              <span className="text-sm">{option}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-base-300 rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ 
                                      width: `${(count / question.total_answers) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Responses */}
        <div className="d-card bg-base-100 shadow-xl">
          <div className="d-card-body">
            <h2 className="d-card-title">Recent Responses</h2>
            {recentResponses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/70">No responses yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentResponses.map((response) => (
                  <div key={response.id} className="d-card bg-base-200 shadow-sm">
                    <div className="d-card-body p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">
                            {response.respondent_name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-base-content/70">
                            {response.respondent_email}
                          </p>
                          <p className="text-xs text-base-content/70">
                            {new Date(response.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`d-badge ${response.is_completed ? 'd-badge-success' : 'd-badge-warning'}`}>
                          {response.is_completed ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {response.questionResponses.slice(0, 3).map((qr, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium">{qr.question.question_text}</p>
                            <p className="text-base-content/70">{qr.answer}</p>
                          </div>
                        ))}
                        {response.questionResponses.length > 3 && (
                          <p className="text-xs text-base-content/70">
                            +{response.questionResponses.length - 3} more answers
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
