import React from 'react';
import { Link } from 'react-router';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-primary" style={{ color: 'var(--primary-color)' }}>404</h1>
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Link 
            to="/"
            className="px-4 py-2 text-white rounded hover:bg-opacity-90 transition-colors"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
