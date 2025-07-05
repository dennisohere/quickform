import React, { useState, useEffect } from 'react';
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
  navigation: {
    previousQuestionId?: string;
    nextQuestionId?: string;
    isLastQuestion: boolean;
  };
}

export default function PublicSurveyQuestion({
  survey,
  question,
  questionIndex,
  responseId,
  token,
  previousAnswer,
  navigation
}: Props) {
  const { data, setData, post, processing } = useForm({
    answer: previousAnswer || (question.question_type === 'checkbox' ? [] : ''),
  });

  // Set form data when question changes to show previous answer or default value
  useEffect(() => {
    if (previousAnswer) {
      // If there's a previous answer, use it
      if (question.question_type === 'checkbox') {
        // For checkboxes, split the comma-separated string back into an array
        const answerArray = typeof previousAnswer === 'string' 
          ? previousAnswer.split(', ').filter(item => item.trim() !== '')
          : previousAnswer;
        setData('answer', answerArray);
      } else {
        setData('answer', previousAnswer);
      }
    } else {
      // If no previous answer, set default value
      setData('answer', question.question_type === 'checkbox' ? [] : '');
    }
  }, [question.id, previousAnswer, question.question_type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (question.is_required) {
      if (question.question_type === 'checkbox') {
        if ((data.answer as string[]).length === 0) {
          alert('This question is required. Please select at least one option.');
          return;
        }
      } else {
        if (!data.answer || (data.answer as string).trim() === '') {
          alert('This question is required. Please provide an answer.');
          return;
        }
      }
    }

    setData('answer', Array.isArray(data.answer) ? data.answer.join(', ') : data.answer);
    post(`/survey/${token}/response/${responseId}/question/${question.id}/answer`);
  };

  const handleCheckboxChange = (option: string) => {
    const currentAnswers = data.answer as string[];
    if (currentAnswers.includes(option)) {
      setData('answer', currentAnswers.filter(a => a !== option));
    } else {
      setData('answer', [...currentAnswers, option]);
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
                    value={data.answer as string}
                    onChange={(e) => setData('answer', e.target.value)}
                    placeholder="Enter your answer"
                  />
                </fieldset>
              )}

              {question.question_type === 'textarea' && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Your Answer</legend>
                  <textarea
                    className="d-textarea w-full d-textarea-bordered h-32"
                    value={data.answer as string}
                    onChange={(e) => setData('answer', e.target.value)}
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
                    value={data.answer as string}
                    onChange={(e) => setData('answer', e.target.value)}
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
                    value={data.answer as string}
                    onChange={(e) => setData('answer', e.target.value)}
                    placeholder="Enter a number"
                  />
                </fieldset>
              )}

              {question.question_type === 'radio' && Array.isArray(question.options) && question.options.length > 0 && (
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
                          checked={data.answer === option}
                          onChange={(e) => setData('answer', e.target.value)}
                        />
                        <span className="d-label-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {question.question_type === 'select' && Array.isArray(question.options) && question.options.length > 0 && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Select an Option</legend>
                  <select
                    className="d-select d-select-bordered w-full"
                    value={data.answer as string}
                    onChange={(e) => setData('answer', e.target.value)}
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

              {question.question_type === 'checkbox' && Array.isArray(question.options) && question.options.length > 0 && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Select All That Apply</legend>
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label key={index} className="d-label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          className="d-checkbox d-checkbox-primary"
                          value={option}
                          checked={(data.answer as string[]).includes(option)}
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
                    value={data.answer as string}
                    onChange={(e) => setData('answer', e.target.value)}
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
                {navigation.previousQuestionId ? (
                  <button
                    type="button"
                    className="d-btn d-btn-outline"
                    onClick={() => {
                      // Navigate to previous question without saving current answer
                      window.location.href = `/survey/${token}/response/${responseId}/question/${navigation.previousQuestionId}`;
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
                  ) : navigation.isLastQuestion ? (
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
