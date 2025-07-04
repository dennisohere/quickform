import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Play } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string | null;
  questions_count: number;
  require_respondent_name: boolean;
  require_respondent_email: boolean;
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

  const hasRequiredFields = survey.require_respondent_name || survey.require_respondent_email;

  return (
    <>
      <Head title={survey.title} />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <div className="d-card bg-base-100 shadow-2xl max-w-md w-full">
          <div className="d-card-body text-center">
            <h1 className="d-card-title text-2xl justify-center mb-4">{survey.title}</h1>
            
            {survey.description && (
              <p className="text-base-content/70 mb-6">{survey.description}</p>
            )}
            
            <div className="d-stats d-stats-horizontal shadow mb-6">
              <div className="d-stat">
                <div className="d-stat-title">Questions</div>
                <div className="d-stat-value text-primary">{survey.questions_count}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {survey.require_respondent_name && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Your Name *</legend>
                  <input
                    type="text"
                    className={`d-input d-input-bordered w-full ${errors.respondent_name ? 'd-input-error' : ''}`}
                    value={data.respondent_name}
                    onChange={(e) => setData('respondent_name', e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                  {errors.respondent_name && (
                    <p className="d-label text-error">{errors.respondent_name}</p>
                  )}
                </fieldset>
              )}

              {survey.require_respondent_email && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Your Email *</legend>
                  <input
                    type="email"
                    className={`d-input d-input-bordered w-full ${errors.respondent_email ? 'd-input-error' : ''}`}
                    value={data.respondent_email}
                    onChange={(e) => setData('respondent_email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.respondent_email && (
                    <p className="d-label text-error">{errors.respondent_email}</p>
                  )}
                </fieldset>
              )}

              {!survey.require_respondent_name && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Your Name (Optional)</legend>
                  <input
                    type="text"
                    className="d-input d-input-bordered w-full"
                    value={data.respondent_name}
                    onChange={(e) => setData('respondent_name', e.target.value)}
                    placeholder="Enter your name"
                  />
                </fieldset>
              )}

              {!survey.require_respondent_email && (
                <fieldset className="d-fieldset">
                  <legend className="d-fieldset-legend">Your Email (Optional)</legend>
                  <input
                    type="email"
                    className="d-input d-input-bordered w-full"
                    value={data.respondent_email}
                    onChange={(e) => setData('respondent_email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </fieldset>
              )}

              <button type="submit" className="d-btn d-btn-primary w-full" disabled={processing}>
                {processing ? (
                  <>
                    <span className="d-loading d-loading-spinner d-loading-sm"></span>
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

            {!hasRequiredFields && (
              <>
                <div className="d-divider">OR</div>
                
                <button 
                  className="d-btn d-btn-outline w-full"
                  onClick={() => {
                    setData('respondent_name', '');
                    setData('respondent_email', '');
                    post(`/survey/${token}/start`);
                  }}
                  disabled={processing}
                >
                  Start Anonymously
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 