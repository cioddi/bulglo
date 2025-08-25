import React from 'react';
import type { Exercise } from '../../types';
import { cn } from '../../utils/cn';

interface TrueFalseProps {
  exercise: Exercise;
  answer: string | string[] | null;
  onAnswerChange: (answer: string | string[] | null) => void;
  isCorrect: boolean | null;
  disabled: boolean;
}

export const TrueFalse: React.FC<TrueFalseProps> = ({
  exercise,
  answer,
  onAnswerChange,
  isCorrect,
  disabled,
}) => {
  const { statement } = exercise.data;

  const handleAnswerClick = (value: 'true' | 'false') => {
    if (disabled) return;
    onAnswerChange(value);
  };

  const getButtonStyle = (value: 'true' | 'false') => {
    if (!disabled) {
      return answer === value
        ? value === 'true'
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-red-500 bg-red-50 dark:bg-red-900/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500';
    }

    // After answer is submitted
    if (isCorrect && answer === value) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }
    
    if (!isCorrect && answer === value) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }

    // Show correct answer if user was wrong
    if (!isCorrect && exercise.correct === value) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }

    return 'border-gray-300 dark:border-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Statement */}
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-lg text-center text-gray-900 dark:text-gray-100 cyrillic font-medium">
          {statement}
        </p>
      </div>

      {/* True/False buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAnswerClick('true')}
          disabled={disabled}
          className={cn(
            'p-6 text-center border-2 rounded-lg transition-all duration-200',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'disabled:cursor-not-allowed',
            'flex flex-col items-center space-y-2',
            getButtonStyle('true')
          )}
        >
          <div className="text-3xl">✓</div>
          <span className="text-lg font-semibold text-green-600 dark:text-green-400">
            True
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Вярно
          </span>
        </button>

        <button
          onClick={() => handleAnswerClick('false')}
          disabled={disabled}
          className={cn(
            'p-6 text-center border-2 rounded-lg transition-all duration-200',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'disabled:cursor-not-allowed',
            'flex flex-col items-center space-y-2',
            getButtonStyle('false')
          )}
        >
          <div className="text-3xl">✗</div>
          <span className="text-lg font-semibold text-red-600 dark:text-red-400">
            False
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Невярно
          </span>
        </button>
      </div>
    </div>
  );
};