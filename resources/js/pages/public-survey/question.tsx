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
        <div className="card bg-base-100 shadow-2xl max-w-2xl w-full">
          <div className="card-body">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Question {questionIndex + 1} of {survey.questions_count}</span>
                <span className="text-sm text-base-content/70">{Math.round(progress)}%</span>
              </div>
                             <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{question.question_text}</h2>
              {question.is_required && (
                <div className="badge badge-error mb-4">Required</div>
              )}
            </div>

            {/* Answer Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {question.question_type === 'text' && (
                <div className="form-control">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                  />
                </div>
              )}

              {question.question_type === 'textarea' && (
                <div className="form-control">
                  <textarea
                    className="textarea textarea-bordered h-32"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                  />
                </div>
              )}

              {question.question_type === 'email' && (
                <div className="form-control">
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              )}

              {question.question_type === 'number' && (
                <div className="form-control">
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={answer as string}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter a number"
                  />
                </div>
              )}

              {question.question_type === 'multiple_choice' && question.options && (
                <div className="form-control">
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label key={index} className="label cursor-pointer justify-start gap-3">
                        <input
                          type="radio"
                          name="answer"
                          className="radio radio-primary"
                          value={option}
                          checked={answer === option}
                          onChange={(e) => setAnswer(e.target.value)}
                        />
                        <span className="label-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {question.question_type === 'checkbox' && question.options && (
                <div className="form-control">
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label key={index} className="label cursor-pointer justify-start gap-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          value={option}
                          checked={(answer as string[]).includes(option)}
                          onChange={() => handleCheckboxChange(option)}
                        />
                        <span className="label-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                {questionIndex > 0 ? (
                  <button
                    type="button"
                    className="btn btn-outline"
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

                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
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