import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';

interface Survey {
  id?: string;
  title: string;
  description: string | null;
  require_respondent_name?: boolean;
  require_respondent_email?: boolean;
}

interface Props {
  survey?: Survey;
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export default function SurveyFormModal({ survey, isOpen, onClose, mode }: Props) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    title: survey?.title || '',
    description: survey?.description || '',
    require_respondent_name: survey?.require_respondent_name || false,
    require_respondent_email: survey?.require_respondent_email || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      post(route('admin.surveys.store'), {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      put(route('admin.surveys.update', survey?.id), {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      {/* Modal backdrop */}
      {isOpen && (
        <div className="d-modal d-modal-open">
          <div className="d-modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="d-modal-title text-xl">
                {mode === 'create' ? 'Create New Survey' : 'Edit Survey'}
              </h3>
              <button
                className="d-btn d-btn-square d-btn-ghost d-btn-sm"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset className="d-fieldset">
                <legend className="d-fieldset-legend">Survey Title</legend>
                <input
                  type="text"
                  className={`d-input d-input-bordered w-full ${errors.title ? 'd-input-error' : ''}`}
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Enter survey title"
                />
                {errors.title && (
                  <p className="d-label text-error">{errors.title}</p>
                )}
              </fieldset>

              <fieldset className="d-fieldset">
                <legend className="d-fieldset-legend">Description</legend>
                <textarea
                  className={`d-textarea w-full d-textarea-bordered h-24 ${errors.description ? 'd-textarea-error' : ''}`}
                  value={data.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                  placeholder="Enter survey description (optional)"
                />
                {errors.description && (
                  <p className="d-label text-error">{errors.description}</p>
                )}
              </fieldset>

              <fieldset className="d-fieldset">
                <legend className="d-fieldset-legend">Respondent Information</legend>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="require_respondent_name"
                      className="d-checkbox d-checkbox-primary"
                      checked={data.require_respondent_name}
                      onChange={(e) => setData('require_respondent_name', e.target.checked)}
                    />
                    <label htmlFor="require_respondent_name" className="d-label cursor-pointer">
                      <span className="d-label-text">Require respondent name</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="require_respondent_email"
                      className="d-checkbox d-checkbox-primary"
                      checked={data.require_respondent_email}
                      onChange={(e) => setData('require_respondent_email', e.target.checked)}
                    />
                    <label htmlFor="require_respondent_email" className="d-label cursor-pointer">
                      <span className="d-label-text">Require respondent email</span>
                    </label>
                  </div>
                </div>
              </fieldset>

              <div className="d-modal-action">
                <button
                  type="button"
                  className="d-btn d-btn-outline"
                  onClick={handleClose}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button type="submit" className="d-btn d-btn-primary" disabled={processing}>
                  {processing ? (
                    <>
                      <span className="d-loading d-loading-spinner d-loading-sm"></span>
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {mode === 'create' ? 'Create Survey' : 'Update Survey'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
