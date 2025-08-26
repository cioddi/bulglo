import React from 'react';
import type { Exercise } from '../../types';

interface SRSFeedbackProps {
  exercise: Exercise;
  onFeedback: (confidence: number) => void;
}

const confidenceOptions = [
  { value: 0, label: "Not at all", description: "I don't know this at all", color: "red" },
  { value: 1, label: "Barely", description: "I barely remember this", color: "orange" },
  { value: 2, label: "Somewhat", description: "I know this somewhat", color: "yellow" },
  { value: 3, label: "Well", description: "I know this well", color: "green" },
  { value: 4, label: "Perfectly", description: "I know this perfectly", color: "blue" },
];

export const SRSFeedback: React.FC<SRSFeedbackProps> = ({
  exercise,
  onFeedback,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          How well do you know this?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your answer will help us show you this content at the right time
        </p>
      </div>

      {/* Show the content being reviewed */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {exercise.prompt}
          </div>
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {Array.isArray(exercise.correct) 
              ? exercise.correct.join(', ')
              : exercise.correct
            }
          </div>
        </div>
      </div>

      {/* Confidence options */}
      <div className="space-y-3">
        {confidenceOptions.map((option) => {
          const colorClasses = {
            red: 'border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500',
            orange: 'border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:ring-orange-500',
            yellow: 'border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 focus:ring-yellow-500',
            green: 'border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500',
            blue: 'border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
          };

          return (
            <button
              key={option.value}
              onClick={() => onFeedback(option.value)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 
                bg-white dark:bg-gray-800 
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${colorClasses[option.color as keyof typeof colorClasses]}`}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {option.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {option.description}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        All answers help improve your learning - there's no wrong choice!
      </div>
    </div>
  );
};