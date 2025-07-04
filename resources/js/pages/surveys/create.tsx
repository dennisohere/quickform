import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function SurveyCreate() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/surveys');
  };

  return (
    <>
      <Head title="Create Survey" />
      
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Survey</h1>
          <p className="text-base-content/70 mt-2">
            Set up the basic information for your survey.
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Survey Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Survey Title *</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Enter survey title"
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.title}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
                  value={data.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                  placeholder="Enter survey description (optional)"
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.description}</span>
                  </label>
                )}
              </div>

              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Survey
                    </>
                  )}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => window.history.back()}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 