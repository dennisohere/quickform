import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Play } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string | null;
  questions_count: number;
}

interface Props {
  survey: Survey;
  token: string;
}

export default function PublicSurveyShow({ survey, token }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    respondent_name: '',
    respondent_email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/survey/${token}/start`);
  };

  return (
    <>
      <Head title={survey.title} />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-2xl max-w-md w-full">
          <div className="card-body text-center">
            <h1 className="card-title text-2xl justify-center mb-4">{survey.title}</h1>
            
            {survey.description && (
              <p className="text-base-content/70 mb-6">{survey.description}</p>
            )}
            
            <div className="stats stats-horizontal shadow mb-6">
              <div className="stat">
                <div className="stat-title">Questions</div>
                <div className="stat-value text-primary">{survey.questions_count}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your Name (Optional)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={data.respondent_name}
                  onChange={(e) => setData('respondent_name', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your Email (Optional)</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={data.respondent_email}
                  onChange={(e) => setData('respondent_email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={processing}>
                {processing ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Starting Survey...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Survey
                  </>
                )}
              </button>
            </form>

            <div className="divider">OR</div>
            
            <button 
              className="btn btn-outline w-full"
              onClick={() => {
                setData('respondent_name', '');
                setData('respondent_email', '');
                post(`/survey/${token}/start`);
              }}
              disabled={processing}
            >
              Start Anonymously
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 