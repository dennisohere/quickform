import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface QuestionResponse {
  id: string;
  question_id: string;
  answer: string;
  question: {
    question_text: string;
    question_type: string;
  };
}

interface Response {
  id: string;
  respondent_name?: string;
  respondent_email?: string;
  is_completed: boolean;
  created_at: string;
  completed_at?: string;
  question_responses: QuestionResponse[];
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  responses: Response[];
}

interface Props {
  survey: Survey;
}

export default function SurveyResponses({ survey }: Props) {
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
    {
      title: 'Responses',
      href: `/surveys/${survey.id}/responses`,
    },
  ];

  const exportResponses = () => {
    // This would implement CSV export functionality
    console.log('Export responses');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Responses - ${survey.title}`} />
      
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{survey.title} - Responses</h1>
            {survey.description && (
              <p className="text-base-content/70 mt-2">{survey.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={route('admin.surveys.show', survey.id)}>
              <button className="d-btn d-btn-outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Survey
              </button>
            </Link>
            <button className="d-btn d-btn-primary" onClick={exportResponses}>
              <Download className="w-4 h-4 mr-2" />
              Export Responses
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {survey.responses.length === 0 ? (
            <div className="d-card bg-base-100 shadow-xl">
              <div className="d-card-body text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No responses yet</h3>
                <p className="text-base-content/70 mb-4">
                  Once people start responding to your survey, you'll see their responses here.
                </p>
                <Link href={route('admin.surveys.show', survey.id)}>
                  <button className="d-btn d-btn-primary">
                    <Eye className="w-4 h-4 mr-2" />
                    View Survey
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            survey.responses.map((response, index) => (
              <div key={response.id} className="d-card bg-base-100 shadow-xl">
                <div className="d-card-body">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Response #{index + 1}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-base-content/70">
                        <span>
                          <strong>Respondent:</strong> {response.respondent_name || 'Anonymous'}
                        </span>
                        {response.respondent_email && (
                          <span>
                            <strong>Email:</strong> {response.respondent_email}
                          </span>
                        )}
                        <span>
                          <strong>Started:</strong> {new Date(response.created_at).toLocaleString()}
                        </span>
                        {response.completed_at && (
                          <span>
                            <strong>Completed:</strong> {new Date(response.completed_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`d-badge ${response.is_completed ? 'd-badge-success' : 'd-badge-neutral'}`}>
                      {response.is_completed ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {response.question_responses.map((qr) => (
                      <div key={qr.id} className="border-l-4 border-base-300 pl-4">
                        <h4 className="font-medium text-base-content mb-2">
                          {qr.question.question_text}
                        </h4>
                        <div className="bg-base-200 rounded-lg p-3">
                          <p className="text-sm text-base-content">
                            {qr.answer || <span className="text-base-content/50 italic">No answer provided</span>}
                          </p>
                        </div>
                        <div className="mt-1">
                          <div className="d-badge d-badge-outline d-badge-xs">
                            {qr.question.question_type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {survey.responses.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-base-content/70">
              Showing {survey.responses.length} response{survey.responses.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 