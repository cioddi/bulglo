import React from 'react';

export const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          Bulglo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Loading your Bulgarian lessons...
        </p>
      </div>
    </div>
  );
};