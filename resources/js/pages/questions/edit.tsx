import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  is_required: boolean;
  order: number;
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
}

interface Props {
  survey: Survey;
  question: Question;
}

export default function QuestionEdit({ survey, question }: Props) {
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
      title: 'Edit Question',
      href: `/surveys/${survey.id}/questions/${question.id}/edit`,
    },
  ];

  const [questionType, setQuestionType] = useState(question.question_type);
  const [options, setOptions] = useState(question.options || ['']);

  const { data, setData, put, processing, errors } = useForm({
    question_text: question.question_text,
    question_type: question.question_type,
    is_required: question.is_required,
    options: question.options || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData('question_type', questionType);
    setData('options', questionType === 'radio' || questionType === 'select' || questionType === 'checkbox' ? options.filter(opt => opt.trim()) : []);
    put(`/surveys/${survey.id}/questions/${question.id}`);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Question" />
      
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Question</h1>
          <p className="text-base-content/70 mt-2">
            Update the question in "{survey.title}"
          </p>
        </div>

        <div className="d-card bg-base-100 shadow-xl max-w-2xl">
          <div className="d-card-body">
            <h2 className="d-card-title">Question Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="d-form-control">
                <label className="d-label">
                  <span className="d-label-text">Question Text *</span>
                </label>
                <input
                  type="text"
                  className={`d-input d-input-bordered w-full ${errors.question_text ? 'd-input-error' : ''}`}
                  value={data.question_text}
                  onChange={(e) => setData('question_text', e.target.value)}
                  placeholder="Enter your question"
                />
                {errors.question_text && (
                  <label className="d-label">
                    <span className="d-label-text-alt text-error">{errors.question_text}</span>
                  </label>
                )}
              </div>

              <div className="d-form-control">
                <label className="d-label">
                  <span className="d-label-text">Question Type *</span>
                </label>
                <select
                  className="d-select d-select-bordered w-full"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                >
                  <option value="text">Text Input</option>
                  <option value="textarea">Long Text</option>
                  <option value="radio">Radio Buttons</option>
                  <option value="select">Dropdown Select</option>
                  <option value="checkbox">Checkboxes</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
              </div>

              {(questionType === 'radio' || questionType === 'select' || questionType === 'checkbox') && (
                <div className="d-form-control">
                  <label className="d-label">
                    <span className="d-label-text">Options *</span>
                  </label>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          className="d-input d-input-bordered flex-1"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        {options.length > 1 && (
                          <button
                            type="button"
                            className="d-btn d-btn-outline d-btn-square d-btn-sm"
                            onClick={() => removeOption(index)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="d-btn d-btn-outline d-btn-sm"
                      onClick={addOption}
                    >
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              <div className="d-form-control">
                <label className="d-label cursor-pointer">
                  <span className="d-label-text">Required Question</span>
                  <input
                    type="checkbox"
                    className="d-toggle d-toggle-primary"
                    checked={data.is_required}
                    onChange={(e) => setData('is_required', e.target.checked)}
                  />
                </label>
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
                      Update Question
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