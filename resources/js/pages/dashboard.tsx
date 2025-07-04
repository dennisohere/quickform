import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, BarChart3, Users, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Link href="/surveys/create">
                        <button className="btn btn-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Survey
                        </button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="stat bg-base-100 shadow">
                        <div className="stat-figure text-primary">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Total Surveys</div>
                        <div className="stat-value text-primary">0</div>
                        <div className="stat-desc">Surveys created</div>
                    </div>

                    <div className="stat bg-base-100 shadow">
                        <div className="stat-figure text-secondary">
                            <Users className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Total Responses</div>
                        <div className="stat-value text-secondary">0</div>
                        <div className="stat-desc">Responses collected</div>
                    </div>

                    <div className="stat bg-base-100 shadow">
                        <div className="stat-figure text-accent">
                            <BarChart3 className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Active Surveys</div>
                        <div className="stat-value text-accent">0</div>
                        <div className="stat-desc">Published surveys</div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Quick Actions</h2>
                            <div className="space-y-4">
                                <Link href="/surveys">
                                    <button className="btn btn-outline w-full justify-start">
                                        <FileText className="w-4 h-4 mr-2" />
                                        View All Surveys
                                    </button>
                                </Link>
                                <Link href="/surveys/create">
                                    <button className="btn btn-outline w-full justify-start">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create New Survey
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Getting Started</h2>
                            <div className="space-y-3">
                                <div className="text-sm">
                                    <p className="font-medium">1. Create a Survey</p>
                                    <p className="text-base-content/70">Start by creating your first survey with custom questions.</p>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">2. Add Questions</p>
                                    <p className="text-base-content/70">Choose from various question types like text, multiple choice, and more.</p>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">3. Publish & Share</p>
                                    <p className="text-base-content/70">Publish your survey and share the link with respondents.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
