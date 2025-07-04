import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2, Copy } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Survey {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  share_token: string | null;
  created_at: string;
  questions_count: number;
  responses_count: number;
}

interface Props {
  surveys: Survey[];
}

export default function SurveysIndex({ surveys }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Surveys',
      href: '/surveys',
    },
  ];

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/survey/${token}`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const deleteSurvey = (id: string) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      router.delete(`/surveys/${id}`);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Surveys" />
      
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Surveys</h1>
          <Link href="/surveys/create">
            <button className="d-btn d-btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Survey
            </button>
          </Link>
        </div>

        {surveys.length === 0 ? (
          <div className="d-card bg-base-100 shadow-xl">
            <div className="d-card-body text-center">
              <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
              <p className="text-base-content/70 mb-4">
                Create your first survey to start collecting responses.
              </p>
              <Link href="/surveys/create">
                <button className="d-btn d-btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Survey
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <div key={survey.id} className="d-card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="d-card-body">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="d-card-title text-lg">{survey.title}</h2>
                    <div className={`d-badge ${survey.is_published ? 'd-badge-success' : 'd-badge-neutral'}`}>
                      {survey.is_published ? 'Published' : 'Draft'}
                    </div>
                  </div>
                  
                  {survey.description && (
                    <p className="text-base-content/70 line-clamp-2 mb-4">
                      {survey.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center mb-4 text-sm text-base-content/70">
                    <span>{survey.questions_count} questions</span>
                    <span>{survey.responses_count} responses</span>
                  </div>
                  
                  <div className="d-card-actions justify-end">
                    <Link href={`/surveys/${survey.id}`}>
                      <button className="d-btn d-btn-outline d-btn-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </Link>
                    <Link href={`/surveys/${survey.id}/edit`}>
                      <button className="d-btn d-btn-outline d-btn-sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </Link>
                    {survey.is_published && survey.share_token && (
                      <button
                        className="d-btn d-btn-outline d-btn-sm"
                        onClick={() => copyShareLink(survey.share_token!)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Link
                      </button>
                    )}
                    <button
                      className="d-btn d-btn-outline d-btn-sm d-btn-error"
                      onClick={() => deleteSurvey(survey.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
} 