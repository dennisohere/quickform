import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Eye } from 'lucide-react';

interface QuestionResponse {
  id: string;
  question_id: string;
  answer: string;
  question: {
    question_text: string;
    question_type: string;
  };
}

interface Response {
  id: string;
  respondent_name?: string;
  respondent_email?: string;
  is_completed: boolean;
  created_at: string;
  completed_at?: string;
  question_responses: QuestionResponse[];
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  responses: Response[];
}

interface Props {
  survey: Survey;
}

export default function SurveyResponses({ survey }: Props) {
  const exportResponses = () => {
    // This would implement CSV export functionality
    console.log('Export responses');
  };

  return (
    <>
      <Head title={`Responses - ${survey.title}`} />
      
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link href={route('surveys.show', survey.id)}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Survey
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold">{survey.title} - Responses</h1>
            {survey.description && (
              <p className="text-muted-foreground mt-2">{survey.description}</p>
            )}
          </div>
          <Button onClick={exportResponses}>
            <Download className="w-4 h-4 mr-2" />
            Export Responses
          </Button>
        </div>

        <div className="grid gap-6">
          {survey.responses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No responses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Once people start responding to your survey, you'll see their responses here.
                </p>
                <Link href={route('surveys.show', survey.id)}>
                  <Button>
                    <Eye className="w-4 h-4 mr-2" />
                    View Survey
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            survey.responses.map((response, index) => (
              <Card key={response.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Response #{index + 1}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          <strong>Respondent:</strong> {response.respondent_name || 'Anonymous'}
                        </span>
                        {response.respondent_email && (
                          <span>
                            <strong>Email:</strong> {response.respondent_email}
                          </span>
                        )}
                        <span>
                          <strong>Started:</strong> {new Date(response.created_at).toLocaleString()}
                        </span>
                        {response.completed_at && (
                          <span>
                            <strong>Completed:</strong> {new Date(response.completed_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={response.is_completed ? 'default' : 'secondary'}>
                      {response.is_completed ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {response.question_responses.map((qr) => (
                      <div key={qr.id} className="border-l-4 border-gray-200 pl-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {qr.question.question_text}
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">
                            {qr.answer || <span className="text-gray-500 italic">No answer provided</span>}
                          </p>
                        </div>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {qr.question.question_type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {survey.responses.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {survey.responses.length} response{survey.responses.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </>
  );
} 