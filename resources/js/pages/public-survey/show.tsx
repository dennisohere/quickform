import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface Props {
  survey: Survey;
}

export default function PublicSurveyShow({ survey }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    respondent_name: '',
    respondent_email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('public.survey.start', survey.share_token || ''));
  };

  return (
    <>
      <Head title={survey.title} />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
            {survey.description && (
              <p className="mt-2 text-gray-600">{survey.description}</p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Start Survey</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="respondent_name">Your Name (Optional)</Label>
                  <Input
                    id="respondent_name"
                    type="text"
                    value={data.respondent_name}
                    onChange={(e) => setData('respondent_name', e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                  {errors.respondent_name && (
                    <p className="text-sm text-destructive mt-1">{errors.respondent_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="respondent_email">Your Email (Optional)</Label>
                  <Input
                    id="respondent_email"
                    type="email"
                    value={data.respondent_email}
                    onChange={(e) => setData('respondent_email', e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                  {errors.respondent_email && (
                    <p className="text-sm text-destructive mt-1">{errors.respondent_email}</p>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    This survey has {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}.
                  </p>
                  <Button type="submit" disabled={processing} className="w-full">
                    {processing ? 'Starting...' : 'Start Survey'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Your responses will be kept confidential and used only for the purposes stated in this survey.
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 