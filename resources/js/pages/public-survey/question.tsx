import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

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
  questions_count: number;
}

interface Props {
  survey: Survey;
  question: Question;
  questionIndex: number;
  responseId: string;
  token: string;
  previousAnswer?: string | string[];
}

export default function PublicSurveyQuestion({ 
  survey, 
  question, 
  questionIndex, 
  responseId, 
  token,
  previousAnswer 
}: Props) {
  const [answer, setAnswer] = useState<string | string[]>(
    previousAnswer || (question.question_type === 'checkbox' ? [] : '')
  );

  const { data, setData, post, processing } = useForm({
    answer: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (question.is_required) {
      if (question.question_type === 'checkbox') {
        if ((answer as string[]).length === 0) {
          alert('This question is required. Please select at least one option.');
          return;
        }
      } else {
        if (!answer || (answer as string).trim() === '') {
          alert('This question is required. Please provide an answer.');
          return;
        }
      }
    }

    setData('answer', Array.isArray(answer) ? answer.join(', ') : answer);
    post(`/survey/${token}/response/${responseId}/question/${questionIndex}/answer`);
  };

  const handleCheckboxChange = (option: string) => {
    const currentAnswers = answer as string[];
    if (currentAnswers.includes(option)) {
      setAnswer(currentAnswers.filter(a => a !== option));
    } else {
      setAnswer([...currentAnswers, option]);
    }
  };

  const progress = ((questionIndex + 1) / survey.questions_count) * 100;

  return (
    <>
      <Head title={`Question ${questionIndex + 1} - ${survey.title}`} />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <div className="d-card bg-base-100 shadow-2xl max-w-2xl w-full">
          <div className="d-card-body">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Question {questionIndex + 1} of {survey.questions_count}</span>
                <span className="text-sm text-base-content/70">{Math.round(progress)}%</span>
              </div>
              <progress className="d-progress d-progress-primary w-full" value={progress} max="100"></progress>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{question.question_text}</h2>
              {question.is_required && (
                <div className="d-badge d-badge-error mb-4">Required</div>
              )}
            </div>

            {/* Answer Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {question.question_type === 'text' && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Your Answer</legend>
                  <input
                    type="text"
                    className="d-input d-input-bordered w-full"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                  />
                </fieldset>
              )}

              {question.question_type === 'textarea' && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Your Answer</legend>
                  <textarea
                    className="d-textarea d-textarea-bordered h-32"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                  />
                </fieldset>
              )}

              {question.question_type === 'email' && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Your Email</legend>
                  <input
                    type="email"
                    className="d-input d-input-bordered w-full"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your email"
                  />
                </fieldset>
              )}

              {question.question_type === 'number' && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Your Answer</legend>
                  <input
                    type="number"
                    className="d-input d-input-bordered w-full"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter a number"
                  />
                </fieldset>
              )}

              {question.question_type === 'radio' && question.options && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Select One Option</legend>
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label key={index} className="d-label cursor-pointer justify-start gap-3">
                        <input
                          type="radio"
                          name="answer"
                          className="d-radio d-radio-primary"
                          value={option}
                          checked={answer === option}
                          onChange={(e) => setAnswer(e.target.value)}
                        />
                        <span className="d-label-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {question.question_type === 'select' && question.options && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Select an Option</legend>
                  <select
                    className="d-select d-select-bordered w-full"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {question.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </fieldset>
              )}

              {question.question_type === 'checkbox' && question.options && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Select All That Apply</legend>
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label key={index} className="d-label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          className="d-checkbox d-checkbox-primary"
                          value={option}
                          checked={(answer as string[]).includes(option)}
                          onChange={() => handleCheckboxChange(option)}
                        />
                        <span className="d-label-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {question.question_type === 'date' && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Select Date</legend>
                  <input
                    type="date"
                    className="d-input d-input-bordered w-full"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </fieldset>
              )}

              {/* Fallback for unknown question types */}
              {!['text', 'textarea', 'email', 'number', 'radio', 'select', 'checkbox', 'date'].includes(question.question_type) && (
                <div className="d-alert d-alert-warning">
                  <div>
                    <h3 className="font-bold">Unsupported Question Type</h3>
                    <div className="text-xs">Question type "{question.question_type}" is not supported.</div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                {questionIndex > 0 ? (
                  <button
                    type="button"
                    className="d-btn d-btn-outline"
                    onClick={() => {
                      setData('answer', Array.isArray(answer) ? answer.join(', ') : answer);
                      post(`/survey/${token}/response/${responseId}/question/${questionIndex - 1}/answer`, {
                        preserveScroll: true,
                      });
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                <button type="submit" className="d-btn d-btn-primary" disabled={processing}>
                  {processing ? (
                    <>
                      <span className="d-loading d-loading-spinner d-loading-sm"></span>
                      Saving...
                    </>
                  ) : questionIndex === survey.questions_count - 1 ? (
                    <>
                      Complete Survey
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 