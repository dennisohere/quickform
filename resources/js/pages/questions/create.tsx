import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Props {
  surveyId: string;
  surveyTitle: string;
}

export default function QuestionCreate({ surveyId, surveyTitle }: Props) {
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
      title: surveyTitle,
      href: `/surveys/${surveyId}`,
    },
    {
      title: 'Add Question',
      href: `/surveys/${surveyId}/questions/create`,
    },
  ];

  const [questionType, setQuestionType] = useState('text');
  const [options, setOptions] = useState(['']);

  const { data, setData, post, processing, errors } = useForm({
    question_text: '',
    question_type: 'text',
    is_required: false as boolean,
    options: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData('question_type', questionType);
    setData('options', questionType === 'radio' || questionType === 'select' || questionType === 'checkbox' ? options.filter(opt => opt.trim()) : []);
    post(`/surveys/${surveyId}/questions`);
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
      <Head title="Add Question" />
      
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Question</h1>
          <p className="text-base-content/70 mt-2">
            Add a new question to "{surveyTitle}"
          </p>
        </div>

        <div className="d-card bg-base-100 shadow-xl max-w-2xl">
          <div className="d-card-body">
            <h2 className="d-card-title">Question Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset className="d-fieldset">
                <legend className="d-fieldset-legend">Question Text</legend>
                <input
                  type="text"
                  className={`d-input d-input-bordered w-full ${errors.question_text ? 'd-input-error' : ''}`}
                  value={data.question_text}
                  onChange={(e) => setData('question_text', e.target.value)}
                  placeholder="Enter your question"
                />
                {errors.question_text && (
                  <p className="d-label text-error">{errors.question_text}</p>
                )}
              </fieldset>

              <fieldset className="d-fieldset">
                <legend className="d-fieldset-legend">Question Type</legend>
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
              </fieldset>

              {(questionType === 'radio' || questionType === 'select' || questionType === 'checkbox') && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Options</legend>
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
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </button>
                  </div>
                </fieldset>
              )}

              <fieldset className="d-fieldset">
                <legend className="d-fieldset-legend">Required Question</legend>
                <label className="d-label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="d-toggle d-toggle-primary"
                    checked={data.is_required}
                    onChange={(e) => setData('is_required', e.target.checked)}
                  />
                  <span className="d-label-text">Make this question required</span>
                </label>
              </fieldset>

              <div className="d-card-actions justify-end">
                <button type="submit" className="d-btn d-btn-primary" disabled={processing}>
                  {processing ? (
                    <>
                      <span className="d-loading d-loading-spinner d-loading-sm"></span>
                      Adding Question...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
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