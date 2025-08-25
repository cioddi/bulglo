import React from 'react';
import { Link } from 'react-router-dom';
import { useContentStore } from '../stores/useContentStore';
import { useProgressStore } from '../stores/useProgressStore';
import { ProgressRing } from '../components/UI/ProgressRing';

export const HomePage: React.FC = () => {
  const { units, course } = useContentStore();
  const { completedLessons, xp, level } = useProgressStore();

  const sortedUnits = Object.values(units).sort((a, b) => a.order - b.order);

  const getUnitProgress = (unitId: string) => {
    const unit = units[unitId];
    if (!unit) return 0;

    const completedCount = unit.lessons.filter(lessonId => 
      completedLessons[lessonId]
    ).length;

    return unit.lessons.length > 0 ? (completedCount / unit.lessons.length) * 100 : 0;
  };

  const getFirstIncompleteLesson = (unitId: string) => {
    const unit = units[unitId];
    if (!unit) return null;

    return unit.lessons.find(lessonId => !completedLessons[lessonId]) || null;
  };

  return (
    <div className="pb-20">
      {/* Welcome section */}
      <div className="bg-primary-600 dark:bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back!
              </h1>
              <p className="text-primary-100">
                Continue learning Bulgarian Cyrillic
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <ProgressRing progress={(xp % 100)} size="lg">
                  <div className="text-white font-bold">{level}</div>
                </ProgressRing>
                <p className="text-xs text-primary-100 mt-1">Level</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {course?.title || 'Bulgarian Course'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Learn the Cyrillic alphabet and basic vocabulary
          </p>
        </div>

        {/* Units */}
        <div className="space-y-6">
          {sortedUnits.map((unit) => {
            const progress = getUnitProgress(unit.id);
            const nextLesson = getFirstIncompleteLesson(unit.id);
            const isCompleted = progress === 100;
            const isStarted = progress > 0;

            return (
              <div
                key={unit.id}
                className="card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {unit.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {unit.lessons.length} lessons
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <ProgressRing progress={progress} size="md">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                        {Math.round(progress)}%
                      </span>
                    </ProgressRing>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Action button */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isCompleted ? 'Completed' : isStarted ? 'In progress' : 'Not started'}
                  </span>
                  
                  {nextLesson ? (
                    <Link
                      to={`/lesson/${nextLesson}`}
                      className="btn-primary"
                    >
                      {isStarted ? 'Continue' : 'Start'}
                    </Link>
                  ) : isCompleted ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <span className="text-lg mr-1">✓</span>
                      <span className="text-sm font-medium">Complete</span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            to="/practice"
            className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">💡</span>
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Practice
                </h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Review learned words
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/letters"
            className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3 cyrillic">Аа</span>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  Alphabet
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Study Cyrillic letters
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};