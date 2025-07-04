import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';

interface Props {
  surveyId: string;
  surveyTitle: string;
}

export default function QuestionCreate({ surveyId, surveyTitle }: Props) {
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
    setData('options', questionType === 'multiple_choice' || questionType === 'checkbox' ? options.filter(opt => opt.trim()) : []);
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
    <>
      <Head title="Add Question" />
      
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Question</h1>
          <p className="text-base-content/70 mt-2">
            Add a new question to "{surveyTitle}"
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Question Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Question Text *</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.question_text ? 'input-error' : ''}`}
                  value={data.question_text}
                  onChange={(e) => setData('question_text', e.target.value)}
                  placeholder="Enter your question"
                />
                {errors.question_text && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.question_text}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Question Type *</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                >
                  <option value="text">Text Input</option>
                  <option value="textarea">Long Text</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                </select>
              </div>

              {(questionType === 'multiple_choice' || questionType === 'checkbox') && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Options *</span>
                  </label>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        {options.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-outline btn-square btn-sm"
                            onClick={() => removeOption(index)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={addOption}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Required Question</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={data.is_required}
                    onChange={(e) => setData('is_required', e.target.checked)}
                  />
                </label>
              </div>

              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Adding Question...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
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