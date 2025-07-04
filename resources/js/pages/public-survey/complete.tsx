import React from 'react';
import { Head } from '@inertiajs/react';
import { CheckCircle, Home } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string | null;
}

interface Props {
  survey: Survey;
}

export default function PublicSurveyComplete({ survey }: Props) {
  return (
    <>
      <Head title="Survey Complete" />
      
      <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary/10 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-2xl max-w-md w-full">
          <div className="card-body text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success-content" />
              </div>
            </div>
            
            <h1 className="card-title text-2xl justify-center mb-4">Survey Complete!</h1>
            
            <p className="text-base-content/70 mb-6">
              Thank you for completing "{survey.title}". Your responses have been recorded successfully.
            </p>
            
            {survey.description && (
              <div className="alert alert-info mb-6">
                <div className="text-sm">{survey.description}</div>
              </div>
            )}
            
            <div className="card bg-base-200 shadow-sm mb-6">
              <div className="card-body">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="text-sm text-base-content/70 space-y-1 text-left">
                  <li>• Your responses are securely stored</li>
                  <li>• The survey administrator will review your answers</li>
                  <li>• You may close this window</li>
                </ul>
              </div>
            </div>
            
            <button 
              className="btn btn-primary w-full"
              onClick={() => window.close()}
            >
              <Home className="w-4 h-4 mr-2" />
              Close Window
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 