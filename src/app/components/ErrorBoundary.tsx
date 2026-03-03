import React from 'react';
import { useRouteError, useNavigate } from 'react-router';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '../components/UI';

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-rose-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Oops! Something went wrong
        </h1>
        
        <p className="text-slate-600 mb-6">
          {error?.message || 'An unexpected error occurred'}
        </p>

        <div className="flex gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </Button>
          <Button 
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="mt-6 text-left">
            <summary className="text-xs font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-700">
              Error Details
            </summary>
            <pre className="mt-2 p-4 bg-slate-50 rounded-lg text-xs text-slate-600 overflow-auto max-h-48">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
