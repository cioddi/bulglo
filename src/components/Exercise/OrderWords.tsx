import React from 'react';
import type { Exercise } from '../../types';
import { cn } from '../../utils/cn';

interface OrderWordsProps {
  exercise: Exercise;
  answer: string | string[] | null;
  onAnswerChange: (answer: string | string[] | null) => void;
  isCorrect: boolean | null;
  disabled: boolean;
}

export const OrderWords: React.FC<OrderWordsProps> = ({
  exercise,
  answer,
  onAnswerChange,
  isCorrect: _isCorrect,
  disabled,
}) => {
  const { words } = exercise.data;
  const orderedWords = Array.isArray(answer) ? answer : [];

  const handleWordClick = (word: string) => {
    if (disabled) return;
    
    const newOrder = [...orderedWords, word];
    onAnswerChange(newOrder);
  };

  const handleRemoveWord = (index: number) => {
    if (disabled) return;
    
    const newOrder = orderedWords.filter((_, i) => i !== index);
    onAnswerChange(newOrder.length > 0 ? newOrder : null);
  };

  const clearAll = () => {
    if (disabled) return;
    onAnswerChange(null);
  };

  const isWordUsed = (word: string) => {
    return orderedWords.includes(word);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Click words in the correct order to form a sentence
      </div>

      {/* Ordered words display */}
      <div className="min-h-[80px] p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
        {orderedWords.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {orderedWords.map((word, index) => (
                <button
                  key={`${word}-${index}`}
                  onClick={() => handleRemoveWord(index)}
                  disabled={disabled}
                  className={cn(
                    'px-4 py-2 rounded-lg border-2 transition-all',
                    'bg-primary-100 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300',
                    'hover:bg-primary-200 dark:hover:bg-primary-800',
                    'disabled:cursor-not-allowed',
                    'flex items-center gap-2'
                  )}
                >
                  <span className="text-sm font-medium">{index + 1}</span>
                  <span className="cyrillic">{word}</span>
                </button>
              ))}
            </div>
            
            {!disabled && orderedWords.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Clear all
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-12 text-gray-500 dark:text-gray-400">
            Click words below to build the sentence
          </div>
        )}
      </div>

      {/* Available words */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Available words:
        </p>
        <div className="flex flex-wrap gap-3">
          {words.map((word: string, index: number) => (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              disabled={disabled || isWordUsed(word)}
              className={cn(
                'px-4 py-3 rounded-lg border-2 transition-all',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isWordUsed(word)
                  ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700'
                  : 'border-gray-300 dark:border-gray-600'
              )}
            >
              <span className="font-medium cyrillic">{word}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview sentence */}
      {orderedWords.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Preview:</p>
          <p className="text-lg font-medium text-blue-900 dark:text-blue-100 cyrillic">
            {orderedWords.join(' ')}
          </p>
        </div>
      )}
    </div>
  );
};