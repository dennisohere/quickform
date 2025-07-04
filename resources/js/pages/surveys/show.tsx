import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Copy, Eye, Trash2, ArrowUpDown } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import SurveyFormModal from '@/components/survey-form-modal';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  is_required: boolean;
  order: number;
  options?: string[];
}

interface Response {
  id: string;
  respondent_name?: string;
  respondent_email?: string;
  is_completed: boolean;
  created_at: string;
  completed_at?: string;
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  share_token: string | null;
  created_at: string;
  require_respondent_name: boolean;
  require_respondent_email: boolean;
  questions: Question[];
  responses: Response[];
}

interface Props {
  survey: Survey;
}

export default function SurveyShow({ survey }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Surveys',
      href: '/surveys',
    },
    {
      title: survey.title,
      href: `/surveys/${survey.id}`,
    },
  ];

  const copyShareLink = async () => {
    if (survey.share_token) {
      const url = `${window.location.origin}/survey/${survey.share_token}`;
      try {
        await navigator.clipboard.writeText(url);
        // Show success message
        alert('Link copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('Link copied to clipboard!');
        } catch (fallbackErr) {
          alert('Failed to copy link. Please copy it manually.');
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const togglePublish = () => {
    router.patch(`/surveys/${survey.id}/toggle-publish`);
  };

  const regenerateToken = () => {
    router.patch(`/surveys/${survey.id}/regenerate-token`);
  };

  const deleteSurvey = () => {
    if (confirm('Are you sure you want to delete this survey?')) {
      router.delete(`/surveys/${survey.id}`);
    }
  };

  const handleEditSurvey = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={survey.title} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{survey.title}</h1>
            {survey.description && (
              <p className="text-base-content/70 mt-2">{survey.description}</p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <div className={`d-badge ${survey.is_published ? 'd-badge-success' : 'd-badge-neutral'}`}>
                {survey.is_published ? 'Published' : 'Draft'}
              </div>
              <span className="text-sm text-base-content/70">
                Created {new Date(survey.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {/* Respondent Requirements */}
            {(survey.require_respondent_name || survey.require_respondent_email) && (
              <div className="mt-4">
                <p className="text-sm font-medium text-base-content/70 mb-2">Required from respondents:</p>
                <div className="flex gap-2">
                  {survey.require_respondent_name && (
                    <div className="d-badge d-badge-info d-badge-sm">Name</div>
                  )}
                  {survey.require_respondent_email && (
                    <div className="d-badge d-badge-info d-badge-sm">Email</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              className="d-btn d-btn-outline"
              onClick={handleEditSurvey}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Survey
            </button>
            <button
              className={`d-btn ${survey.is_published ? 'd-btn-outline' : 'd-btn-primary'}`}
              onClick={togglePublish}
            >
              {survey.is_published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Questions Section */}
          <div className="lg:col-span-2">
            <div className="d-card bg-base-100 shadow-xl">
              <div className="d-card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="d-card-title">Questions ({survey.questions.length})</h2>
                  <Link href={`/surveys/${survey.id}/questions/create`}>
                    <button className="d-btn d-btn-primary d-btn-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </button>
                  </Link>
                </div>

                {survey.questions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-base-content/70 mb-4">No questions yet</p>
                    <Link href={`/surveys/${survey.id}/questions/create`}>
                      <button className="d-btn d-btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Question
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {survey.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="d-card bg-base-200 shadow-sm"
                      >
                        <div className="d-card-body">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-base-content/70">
                                  {index + 1}.
                                </span>
                                <span className="font-medium">{question.question_text}</span>
                                {question.is_required && (
                                  <div className="d-badge d-badge-error d-badge-xs">Required</div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <span className="capitalize">{question.question_type}</span>
                                {question.options && question.options.length > 0 && (
                                  <span>• {question.options.length} options</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/surveys/${survey.id}/questions/${question.id}/edit`}>
                                <button className="d-btn d-btn-outline d-btn-sm">
                                  <Edit className="w-4 h-4" />
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Section */}
            {survey.is_published && (
              <div className="d-card bg-base-100 shadow-xl">
                <div className="d-card-body">
                  <h2 className="d-card-title">Share Survey</h2>
                  <div className="space-y-4">
                    {survey.share_token ? (
                      <>
                        <div className="bg-base-200 rounded-lg p-3">
                          <p className="text-sm font-medium mb-1">Share Link</p>
                          <p className="text-xs text-base-content/70 break-all">
                            {`${window.location.origin}/survey/${survey.share_token}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={copyShareLink} className="d-btn d-btn-primary flex-1">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </button>
                          <button className="d-btn d-btn-outline" onClick={regenerateToken}>
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <button onClick={regenerateToken} className="d-btn d-btn-primary w-full">
                        Generate Share Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Responses Section */}
            <div className="d-card bg-base-100 shadow-xl">
              <div className="d-card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="d-card-title">Responses ({survey.responses.length})</h2>
                  {survey.responses.length > 0 && (
                    <Link href={`/surveys/${survey.id}/responses`}>
                      <button className="d-btn d-btn-outline d-btn-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View All
                      </button>
                    </Link>
                  )}
                </div>

                {survey.responses.length === 0 ? (
                  <p className="text-base-content/70 text-center py-4">
                    No responses yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {survey.responses.slice(0, 5).map((response) => (
                      <div key={response.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
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
                    ))}
                    {survey.responses.length > 5 && (
                      <p className="text-sm text-base-content/70 text-center">
                        +{survey.responses.length - 5} more responses
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="d-card bg-base-100 shadow-xl">
              <div className="d-card-body">
                <h2 className="d-card-title">Actions</h2>
                <button
                  className="d-btn d-btn-outline d-btn-error w-full"
                  onClick={deleteSurvey}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Survey
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Survey Modal */}
        <SurveyFormModal
          survey={survey}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          mode="edit"
        />
      </div>
    </AppLayout>
  );
}
