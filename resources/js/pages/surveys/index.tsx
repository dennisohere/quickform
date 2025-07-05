import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2, Copy, FileText, Users, Calendar, BarChart3 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import SurveyFormModal from '@/components/survey-form-modal';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: route('admin.dashboard'),
    },
    {
      title: 'Surveys',
      href: route('admin.surveys.index'),
    },
  ];

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/survey/${token}`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const deleteSurvey = (id: string) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      router.delete(route('admin.surveys.destroy', id));
    }
  };

  const handleEditSurvey = (survey: Survey) => {
    setEditingSurvey(survey);
  };

  const handleCloseEditModal = () => {
    setEditingSurvey(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Surveys" />
      
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Surveys</h1>
          <button 
            className="d-btn d-btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Survey
          </button>
        </div>

        {surveys.length === 0 ? (
          <div className="d-card bg-base-100 shadow-xl">
            <div className="d-card-body text-center">
              <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
              <p className="text-base-content/70 mb-4">
                Create your first survey to start collecting responses.
              </p>
              <button 
                className="d-btn d-btn-primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Survey
              </button>
            </div>
          </div>
        ) : (
          <div className="d-card bg-base-100 shadow-xl">
            <div className="d-card-body p-0">
              <ul className="d-list">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide font-medium">
                  {surveys.length} survey{surveys.length !== 1 ? 's' : ''} • Click to view details
                </li>
                
                {surveys.map((survey) => (
                  <li key={survey.id} className="d-list-row">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-box flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{survey.title}</div>
                        {survey.description && (
                          <div className="text-xs text-base-content/70 line-clamp-1">
                            {survey.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-base-content/70">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {survey.questions_count} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {survey.responses_count} responses
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(survey.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`d-badge d-badge-xs ${survey.is_published ? 'd-badge-success' : 'd-badge-neutral'}`}>
                        {survey.is_published ? 'Published' : 'Draft'}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Link href={route('admin.surveys.show', survey.id)}>
                        <button className="d-btn d-btn-square d-btn-ghost d-btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={route('admin.analytics.survey', survey.id)}>
                        <button className="d-btn d-btn-square d-btn-ghost d-btn-sm">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        className="d-btn d-btn-square d-btn-ghost d-btn-sm"
                        onClick={() => handleEditSurvey(survey)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {survey.is_published && survey.share_token && (
                        <button
                          className="d-btn d-btn-square d-btn-ghost d-btn-sm"
                          onClick={() => copyShareLink(survey.share_token!)}
                          title="Copy share link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="d-btn d-btn-square d-btn-ghost d-btn-sm text-error"
                        onClick={() => deleteSurvey(survey.id)}
                        title="Delete survey"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Create Survey Modal */}
        <SurveyFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          mode="create"
        />

        {/* Edit Survey Modal */}
        {editingSurvey && (
          <SurveyFormModal
            survey={editingSurvey}
            isOpen={true}
            onClose={handleCloseEditModal}
            mode="edit"
          />
        )}
      </div>
    </AppLayout>
  );
} 