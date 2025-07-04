import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string | null;
}

interface Response {
  id: string;
  respondent_name?: string;
  respondent_email?: string;
  completed_at: string;
}

interface Props {
  survey: Survey;
  response: Response;
}

export default function PublicSurveyComplete({ survey, response }: Props) {
  return (
    <>
      <Head title="Survey Complete" />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
            <p className="mt-2 text-gray-600">
              Your response has been submitted successfully.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Survey Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">{survey.title}</h2>
                {survey.description && (
                  <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  <p><strong>Completed:</strong> {new Date(response.completed_at).toLocaleString()}</p>
                  {response.respondent_name && (
                    <p><strong>Name:</strong> {response.respondent_name}</p>
                  )}
                  {response.respondent_email && (
                    <p><strong>Email:</strong> {response.respondent_email}</p>
                  )}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Thank you for taking the time to complete this survey. Your feedback is valuable to us.
                </p>
                <Button
                  onClick={() => window.close()}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Your responses have been recorded and will be kept confidential.
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 