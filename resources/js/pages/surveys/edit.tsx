import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Survey {
  id: string;
  title: string;
  description: string | null;
}

interface Props {
  survey: Survey;
}

export default function SurveyEdit({ survey }: Props) {
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
      title: 'Edit Survey',
      href: `/surveys/${survey.id}/edit`,
    },
  ];

  const { data, setData, put, processing, errors } = useForm({
    title: survey.title,
    description: survey.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/surveys/${survey.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${survey.title}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Survey</h1>
          <p className="text-base-content/70 mt-2">
            Update the details of your survey.
          </p>
        </div>

        <div className="d-card bg-base-100 shadow-xl max-w-2xl">
          <div className="d-card-body">
            <h2 className="d-card-title">Survey Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="d-form-control">
                <label className="d-label">
                  <span className="d-label-text">Survey Title *</span>
                </label>
                <input
                  type="text"
                  className={`d-input d-input-bordered w-full ${errors.title ? 'd-input-error' : ''}`}
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Enter survey title"
                />
                {errors.title && (
                  <label className="d-label">
                    <span className="d-label-text-alt text-error">{errors.title}</span>
                  </label>
                )}
              </div>

              <div className="d-form-control">
                <label className="d-label">
                  <span className="d-label-text">Description</span>
                </label>
                <textarea
                  className={`d-textarea d-textarea-bordered h-24 ${errors.description ? 'd-textarea-error' : ''}`}
                  value={data.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                  placeholder="Enter survey description (optional)"
                />
                {errors.description && (
                  <label className="d-label">
                    <span className="d-label-text-alt text-error">{errors.description}</span>
                  </label>
                )}
              </div>

              <div className="d-card-actions justify-end">
                <button type="submit" className="d-btn d-btn-primary" disabled={processing}>
                  {processing ? (
                    <>
                      <span className="d-loading d-loading-spinner d-loading-sm"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Survey
                    </>
                  )}
                </button>
                <button type="button" className="d-btn d-btn-outline" onClick={() => window.history.back()}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
