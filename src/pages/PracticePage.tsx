import React from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../stores/useProgressStore';

export const PracticePage: React.FC = () => {
  const { srs, completedLessons } = useProgressStore();

  const getItemsDueForReview = () => {
    const now = new Date().toISOString();
    return Object.entries(srs).filter(([, data]) => data.dueISO <= now);
  };

  const dueItems = getItemsDueForReview();
  const totalLessonsCompleted = Object.keys(completedLessons).length;

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review what you've learned to strengthen your memory
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {dueItems.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Items due for review
            </div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {totalLessonsCompleted}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Lessons completed
            </div>
          </div>
        </div>

        {/* Practice options */}
        <div className="space-y-4">
          {dueItems.length > 0 ? (
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Review Session
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dueItems.length} items ready for review
                  </p>
                </div>
                
                <Link
                  to="/practice/review"
                  className="btn-primary"
                >
                  Start Review
                </Link>
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No items are due for review right now. Complete more lessons to add items to your review queue.
              </p>
              <Link
                to="/"
                className="btn-primary"
              >
                Continue Learning
              </Link>
            </div>
          )}

          {totalLessonsCompleted > 0 && (
            <>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Alphabet Review
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Practice all Cyrillic letters you've learned
                    </p>
                  </div>
                  
                  <Link
                    to="/letters"
                    className="btn-secondary"
                  >
                    Study Letters
                  </Link>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Mixed Practice
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Random questions from completed lessons
                    </p>
                  </div>
                  
                  <button
                    disabled
                    className="btn-secondary opacity-50 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            💡 Practice Tips
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Regular practice helps strengthen your memory</li>
            <li>• Items you find difficult will appear more frequently</li>
            <li>• Try to practice a little bit each day to maintain your streak</li>
          </ul>
        </div>
      </div>
    </div>
  );
};