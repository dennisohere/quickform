import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Users, CheckCircle, Calendar, Eye, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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

export default function SurveyAnalytics({ survey, stats, responseTrends, questionAnalytics, recentResponses }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Analytics',
      href: '/analytics',
    },
    {
      title: survey.title,
      href: `/analytics/survey/${survey.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Analytics - ${survey.title}`} />
      
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/analytics">
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
          {responseTrends.length > 0 && (
            <div className="d-card bg-base-100 shadow-xl">
              <div className="d-card-body">
                <h2 className="d-card-title">Response Trends (Last 30 Days)</h2>
                <div className="h-64 flex items-end justify-between gap-2 p-4">
                  {responseTrends.map((trend) => {
                    const maxCount = Math.max(...responseTrends.map(t => t.count));
                    const height = maxCount > 0 ? (trend.count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={trend.date} className="flex-1 flex flex-col items-center">
                        <div 
                          className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary-focus"
                          style={{ height: `${height}%` }}
                          title={`${trend.count} responses on ${new Date(trend.date).toLocaleDateString()}`}
                        />
                        <span className="text-xs text-base-content/70 mt-2">
                          {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Respondent Demographics */}
          <div className="d-card bg-base-100 shadow-xl">
            <div className="d-card-body">
              <h2 className="d-card-title">Respondent Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <span>With Name</span>
                  <div className="d-badge d-badge-primary">{stats.respondentStats.withName}</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <span>With Email</span>
                  <div className="d-badge d-badge-secondary">{stats.respondentStats.withEmail}</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <span>Anonymous</span>
                  <div className="d-badge d-badge-neutral">{stats.respondentStats.anonymous}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Analytics */}
        <div className="d-card bg-base-100 shadow-xl">
          <div className="d-card-body">
            <h2 className="d-card-title">Question Analytics</h2>
            {questionAnalytics.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/70">No questions yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {questionAnalytics.map((question) => (
                  <div key={question.id} className="d-card bg-base-200 shadow-sm">
                    <div className="d-card-body">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{question.question_text}</h3>
                          <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                            <span className="capitalize">{question.question_type}</span>
                            <span>• {question.total_answers} answers</span>
                            <span>• {question.response_rate}% response rate</span>
                          </div>
                        </div>
                      </div>

                      {/* Option counts for choice questions */}
                      {question.option_counts && Object.keys(question.option_counts).length > 0 && (
                        <div className="space-y-2">
                          {Object.entries(question.option_counts).map(([option, count]) => {
                            const percentage = question.total_answers > 0 ? (count / question.total_answers) * 100 : 0;
                            return (
                              <div key={option} className="flex items-center justify-between">
                                <span className="text-sm">{option}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 bg-base-300 rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium w-12 text-right">
                                    {count} ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            );
                          })}
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
                    <div className="d-card-body">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">
                            {response.respondent_name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-base-content/70">
                            {new Date(response.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`d-badge ${response.is_completed ? 'd-badge-success' : 'd-badge-neutral'}`}>
                          {response.is_completed ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                      
                      {response.questionResponses.length > 0 && (
                        <div className="space-y-2">
                          {response.questionResponses.slice(0, 3).map((qr, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{qr.question.question_text}:</span>
                              <span className="ml-2 text-base-content/70">
                                {typeof qr.answer === 'string' ? qr.answer : JSON.stringify(qr.answer)}
                              </span>
                            </div>
                          ))}
                          {response.questionResponses.length > 3 && (
                            <p className="text-xs text-base-content/70">
                              +{response.questionResponses.length - 3} more answers
                            </p>
                          )}
                        </div>
                      )}
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