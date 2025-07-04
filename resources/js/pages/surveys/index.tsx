import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Share2, Copy } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Survey {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  share_token: string | null;
  created_at: string;
  questions_count: number;
  responses_count: number;
}

interface Props {
  surveys: Survey[];
}

export default function SurveysIndex({ surveys }: Props) {
  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/survey/${token}`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const deleteSurvey = (id: string) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      router.delete(route('surveys.destroy', id));
    }
  };

  return (
    <>
      <Head title="Surveys" />
      
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Surveys</h1>
          <Link href={route('surveys.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Survey
            </Button>
          </Link>
        </div>

        {surveys.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first survey to start collecting responses.
              </p>
              <Link href={route('surveys.create')}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Survey
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{survey.title}</CardTitle>
                    <Badge variant={survey.is_published ? 'default' : 'secondary'}>
                      {survey.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  {survey.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {survey.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                      {survey.questions_count} questions
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {survey.responses_count} responses
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={route('surveys.show', survey.id)}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={route('surveys.edit', survey.id)}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    {survey.is_published && survey.share_token && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyShareLink(survey.share_token!)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Link
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSurvey(survey.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 