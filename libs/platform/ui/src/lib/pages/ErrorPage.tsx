import React from 'react';
import { useRouteError } from 'react-router';

export const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-red-500">Oops!</h1>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {error?.statusText || error?.message || "An unexpected error occurred."}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};
