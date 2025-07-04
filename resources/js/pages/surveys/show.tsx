import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Share2, Copy, Eye, Trash2, ArrowUpDown } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  is_required: boolean;
  order: number;
  options?: string[];
}

interface Response {
  id: string;
  respondent_name?: string;
  respondent_email?: string;
  is_completed: boolean;
  created_at: string;
  completed_at?: string;
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  share_token: string | null;
  created_at: string;
  questions: Question[];
  responses: Response[];
}

interface Props {
  survey: Survey;
}

export default function SurveyShow({ survey }: Props) {
  const copyShareLink = () => {
    if (survey.share_token) {
      const url = `${window.location.origin}/survey/${survey.share_token}`;
      navigator.clipboard.writeText(url);
      // You could add a toast notification here
    }
  };

  const togglePublish = () => {
    router.patch(route('surveys.toggle-publish', survey.id));
  };

  const regenerateToken = () => {
    router.patch(route('surveys.regenerate-token', survey.id));
  };

  const deleteSurvey = () => {
    if (confirm('Are you sure you want to delete this survey?')) {
      router.delete(route('surveys.destroy', survey.id));
    }
  };

  return (
    <>
      <Head title={survey.title} />
      
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">{survey.title}</h1>
            {survey.description && (
              <p className="text-muted-foreground mt-2">{survey.description}</p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <Badge variant={survey.is_published ? 'default' : 'secondary'}>
                {survey.is_published ? 'Published' : 'Draft'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created {new Date(survey.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={route('surveys.edit', survey.id)}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Survey
              </Button>
            </Link>
            <Button
              variant={survey.is_published ? 'outline' : 'default'}
              onClick={togglePublish}
            >
              {survey.is_published ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Questions Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Questions ({survey.questions.length})</CardTitle>
                  <Link href={route('surveys.questions.create', survey.id)}>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {survey.questions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No questions yet</p>
                    <Link href={route('surveys.questions.create', survey.id)}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Question
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {survey.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {index + 1}.
                            </span>
                            <span className="font-medium">{question.question_text}</span>
                            {question.is_required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="capitalize">{question.question_type}</span>
                            {question.options && question.options.length > 0 && (
                              <span>• {question.options.length} options</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={route('surveys.questions.edit', [survey.id, question.id])}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Section */}
            {survey.is_published && (
              <Card>
                <CardHeader>
                  <CardTitle>Share Survey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {survey.share_token ? (
                    <>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Share Link</p>
                        <p className="text-xs text-muted-foreground break-all">
                          {`${window.location.origin}/survey/${survey.share_token}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={copyShareLink} className="flex-1">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                        <Button variant="outline" onClick={regenerateToken}>
                          <ArrowUpDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button onClick={regenerateToken} className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Generate Share Link
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Responses Section */}
            <Card>
              <CardHeader>
                <CardTitle>Responses ({survey.responses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {survey.responses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No responses yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {survey.responses.slice(0, 5).map((response) => (
                      <div key={response.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {response.respondent_name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(response.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={response.is_completed ? 'default' : 'secondary'}>
                          {response.is_completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                    ))}
                    {survey.responses.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{survey.responses.length - 5} more responses
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={deleteSurvey}
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Survey
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 