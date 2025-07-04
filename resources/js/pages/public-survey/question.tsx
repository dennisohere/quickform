import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

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
  description: string | null;
  share_token: string;
  questions: Question[];
}

interface Response {
  id: string;
  respondent_name?: string;
  respondent_email?: string;
}

interface Props {
  survey: Survey;
  response: Response;
  currentQuestion: Question;
  questionIndex: number;
  totalQuestions: number;
}

export default function PublicSurveyQuestion({ 
  survey, 
  response, 
  currentQuestion, 
  questionIndex, 
  totalQuestions 
}: Props) {
  const [answer, setAnswer] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    answer: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalAnswer = '';
    
    if (currentQuestion.question_type === 'checkbox') {
      finalAnswer = selectedOptions.join(', ');
    } else {
      finalAnswer = answer;
    }

    if (currentQuestion.is_required && !finalAnswer.trim()) {
      return;
    }

    setData('answer', finalAnswer);
    post(route('public.survey.answer', [
      survey.share_token,
      response.id,
      questionIndex
    ]));
  };

  const handleOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    }
  };

  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  const renderQuestionInput = () => {
    switch (currentQuestion.question_type) {
      case 'textarea':
        return (
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={currentQuestion.is_required}
          />
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="answer"
                  value={option}
                  checked={answer === option}
                  onChange={(e) => setAnswer(e.target.value)}
                  required={currentQuestion.is_required}
                  className="mr-3"
                />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`option-${index}`}
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={(e) => handleOptionChange(option, e.target.checked)}
                  required={currentQuestion.is_required && selectedOptions.length === 0}
                  className="mr-3"
                />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required={currentQuestion.is_required}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            {currentQuestion.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter a number"
            required={currentQuestion.is_required}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your email"
            required={currentQuestion.is_required}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required={currentQuestion.is_required}
          />
        );

      default: // text
        return (
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            required={currentQuestion.is_required}
          />
        );
    }
  };

  return (
    <>
      <Head title={`Question ${questionIndex + 1} - ${survey.title}`} />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">
                Question {questionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestion.question_text}
                {currentQuestion.is_required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  {renderQuestionInput()}
                  {errors.answer && (
                    <p className="text-sm text-destructive mt-1">{errors.answer}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={questionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : questionIndex === totalQuestions - 1 ? 'Complete Survey' : 'Next'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Survey Info */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">{survey.title}</h2>
            {survey.description && (
              <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 