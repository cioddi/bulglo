import React from 'react';
import type { Exercise } from '../../types';
import { cn } from '../../utils/cn';

interface MultipleChoiceProps {
  exercise: Exercise;
  answer: string | string[] | null;
  onAnswerChange: (answer: string | string[] | null) => void;
  isCorrect: boolean | null;
  disabled: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  exercise,
  answer,
  onAnswerChange,
  isCorrect,
  disabled,
}) => {
  const options = exercise.data.options as string[];

  const handleOptionClick = (option: string) => {
    if (disabled) return;
    onAnswerChange(option);
  };

  const getOptionStyle = (option: string) => {
    if (!disabled) {
      return answer === option
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500';
    }

    // After answer is submitted
    if (isCorrect && answer === option) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }
    
    if (!isCorrect && answer === option) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }

    // Show correct answer if user was wrong
    if (!isCorrect && (
      exercise.correct === option || 
      (Array.isArray(exercise.correct) && exercise.correct.includes(option))
    )) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }

    return 'border-gray-300 dark:border-gray-600';
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option)}
          disabled={disabled}
          className={cn(
            'w-full p-4 text-left border-2 rounded-lg transition-all duration-200',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'disabled:cursor-not-allowed',
            getOptionStyle(option)
          )}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 w-6 h-6 mr-3">
              <div
                className={cn(
                  'w-full h-full rounded-full border-2 flex items-center justify-center',
                  answer === option
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
              >
                {answer === option && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
            <span className="text-base font-medium cyrillic">{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
};