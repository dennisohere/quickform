import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';

interface Survey {
  id?: string;
  title: string;
  description: string | null;
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      post('/surveys', {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      put(`/surveys/${survey?.id}`, {
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