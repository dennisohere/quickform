import React, { useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, BarChart3, Users, FileText, Eye, LibraryBig, TextQuote, ListTodo } from 'lucide-react';
import SurveyFormModal from '@/components/survey-form-modal';

interface Stats {
    totalSurveys: number;
    activeSurveys: number;
    totalResponses: number;
}

interface RecentSurvey {
    id: string;
    title: string;
    is_published: boolean;
    created_at: string;
    questions_count: number;
    responses_count: number;
}

interface Props {
    stats: Stats;
    recentSurveys: RecentSurvey[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats, recentSurveys }: Props) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <button 
                        className="d-btn d-btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Survey
                    </button>
                </div>

                <div className="d-stats shadow">
                    <div className="d-stat">
                        <div className="d-stat-figure text-primary">
                            <LibraryBig strokeWidth={0.6} className='size-16'/>
                        </div>
                        <div className="d-stat-title font-medium">Total Surveys</div>
                        <div className="d-stat-value text-primary">{stats.totalSurveys}</div>
                        <div className="d-stat-desc">Surveys created</div>
                    </div>

                    <div className="d-stat">
                        <div className="d-stat-figure text-secondary">
                            <TextQuote strokeWidth={0.6} className='size-16'/>
                        </div>
                        <div className="d-stat-title font-medium">Total responses</div>
                        <div className="d-stat-value text-secondary">{stats.totalResponses}</div>
                        <div className="d-stat-desc">Responses collected</div>
                    </div>

                    <div className="d-stat">
                        <div className="d-stat-figure text-accent">
                            <ListTodo strokeWidth={0.6} className='size-16'/>
                        </div>
                        <div className="d-stat-title font-medium">Active Surveys</div>
                        <div className="d-stat-value text-accent">{stats.activeSurveys}</div>
                        <div className="d-stat-desc">Published surveys</div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="d-card bg-base-100 shadow-xl">
                        <div className="d-card-body">
                            <h2 className="d-card-title">Recent Surveys</h2>
                            {recentSurveys.length === 0 ? (
                                                            <div className="text-center py-8">
                              <p className="text-base-content/70 mb-4">No surveys yet</p>
                              <button 
                                className="d-btn d-btn-primary"
                                onClick={() => setIsCreateModalOpen(true)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Survey
                              </button>
                            </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentSurveys.map((survey) => (
                                        <div key={survey.id} className="d-card bg-base-200 shadow-sm">
                                            <div className="d-card-body p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">{survey.title}</h3>
                                                        <div className="flex items-center gap-4 text-sm text-base-content/70 mt-1">
                                                            <span>{survey.questions_count} questions</span>
                                                            <span>{survey.responses_count} responses</span>
                                                            <div className={`d-badge d-badge-xs ${survey.is_published ? 'd-badge-success' : 'd-badge-neutral'}`}>
                                                                {survey.is_published ? 'Published' : 'Draft'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link href={`/surveys/${survey.id}`}>
                                                            <button className="d-btn d-btn-outline d-btn-sm">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-center pt-2">
                                        <Link href="/surveys">
                                            <button className="d-btn d-btn-outline d-btn-sm">
                                                View All Surveys
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-card bg-base-100 shadow-xl">
                        <div className="d-card-body">
                            <h2 className="d-card-title">Quick Actions</h2>
                            <div className="space-y-4">
                                <button 
                                    className="d-btn d-btn-primary w-full justify-start"
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Survey
                                </button>
                                <Link href="/surveys">
                                    <button className="d-btn d-btn-outline w-full justify-start">
                                        <FileText className="w-4 h-4 mr-2" />
                                        View All Surveys
                                    </button>
                                </Link>
                            </div>

                            <div className="d-divider">Getting Started</div>

                            <div className="space-y-3">
                                <div className="text-sm">
                                    <p className="font-medium">1. Create a Survey</p>
                                    <p className="text-base-content/70">Start by creating your first survey with custom questions.</p>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">2. Add Questions</p>
                                    <p className="text-base-content/70">Choose from various question types like text, radio buttons, and more.</p>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">3. Publish & Share</p>
                                    <p className="text-base-content/70">Publish your survey and share the link with respondents.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Survey Modal */}
                <SurveyFormModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    mode="create"
                />
            </div>
        </AppLayout>
    );
}
