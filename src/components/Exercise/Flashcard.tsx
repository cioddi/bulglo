import React, { useState } from 'react';
import type { Exercise } from '../../types';
import { cn } from '../../utils/cn';

interface FlashcardProps {
  exercise: Exercise;
  answer: string | string[] | null;
  onAnswerChange: (answer: string | string[] | null) => void;
  isCorrect: boolean | null;
  disabled: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  exercise,
  answer,
  onAnswerChange,
  isCorrect: _isCorrect,
  disabled,
}) => {
  const { front, back } = exercise.data;
  const [showBack, setShowBack] = useState(false);

  const handleCardClick = () => {
    if (!showBack) {
      setShowBack(true);
    }
  };

  const handleConfidenceClick = (confidence: 'easy' | 'good' | 'hard') => {
    if (disabled) return;
    onAnswerChange(confidence);
  };

  return (
    <div className="space-y-6">
      {/* Flashcard */}
      <div 
        className={cn(
          'relative w-full aspect-[3/2] max-w-md mx-auto cursor-pointer',
          'bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700',
          'transition-all duration-300 transform hover:scale-[1.02]',
          showBack && 'cursor-default'
        )}
        onClick={handleCardClick}
      >
        <div className="absolute inset-0 p-8 flex items-center justify-center">
          {!showBack ? (
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 cyrillic mb-4">
                {front}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click to reveal answer
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2 cyrillic">
                {front}
              </p>
              <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-600 mb-4"></div>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {back}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confidence buttons */}
      {showBack && !disabled && (
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            How well did you know this?
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleConfidenceClick('hard')}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20',
                'flex flex-col items-center space-y-2'
              )}
            >
              <span className="text-2xl">😰</span>
              <span className="font-medium text-red-600 dark:text-red-400">Hard</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Review soon</span>
            </button>

            <button
              onClick={() => handleConfidenceClick('good')}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
                'flex flex-col items-center space-y-2'
              )}
            >
              <span className="text-2xl">🤔</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">Good</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Normal interval</span>
            </button>

            <button
              onClick={() => handleConfidenceClick('easy')}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20',
                'flex flex-col items-center space-y-2'
              )}
            >
              <span className="text-2xl">😊</span>
              <span className="font-medium text-green-600 dark:text-green-400">Easy</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Review later</span>
            </button>
          </div>
        </div>
      )}

      {/* Selected confidence display */}
      {answer && (
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Marked as: <span className="font-medium capitalize">{answer}</span>
          </p>
        </div>
      )}
    </div>
  );
};