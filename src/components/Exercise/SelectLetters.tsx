import React from 'react';
import type { Exercise } from '../../types';
import { cn } from '../../utils/cn';

interface SelectLettersProps {
  exercise: Exercise;
  answer: string | string[] | null;
  onAnswerChange: (answer: string | string[] | null) => void;
  isCorrect: boolean | null;
  disabled: boolean;
}

export const SelectLetters: React.FC<SelectLettersProps> = ({
  exercise,
  answer,
  onAnswerChange,
  isCorrect: _isCorrect,
  disabled,
}) => {
  const { letters, targetWord } = exercise.data;
  const selectedLetters = Array.isArray(answer) ? answer : [];

  // Extract English translation from prompt (everything in parentheses)
  const getEnglishTranslation = () => {
    const match = exercise.prompt.match(/\((.*?)\)/);
    return match ? match[1] : targetWord;
  };

  const handleLetterClick = (letter: string) => {
    if (disabled) return;

    const newSelection = [...selectedLetters, letter];
    onAnswerChange(newSelection);
  };

  const handleRemoveLetter = (index: number) => {
    if (disabled) return;

    const newSelection = selectedLetters.filter((_, i) => i !== index);
    onAnswerChange(newSelection.length > 0 ? newSelection : null);
  };

  const clearSelection = () => {
    if (disabled) return;
    onAnswerChange(null);
  };

  return (
    <div className="space-y-6">
      {/* Target word display */}
      <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <p className="text-sm text-primary-700 dark:text-primary-300 mb-2">
          Build this word in Bulgarian:
        </p>
        <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
          {getEnglishTranslation()}
        </p>
      </div>

      {/* Selected letters display */}
      <div className="min-h-[60px] p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
        {selectedLetters.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedLetters.map((letter, index) => (
              <button
                key={index}
                onClick={() => handleRemoveLetter(index)}
                disabled={disabled}
                className={cn(
                  'px-4 py-2 rounded-lg border-2 transition-all',
                  'bg-primary-100 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300',
                  'hover:bg-primary-200 dark:hover:bg-primary-800',
                  'disabled:cursor-not-allowed'
                )}
              >
                <span className="text-xl cyrillic">{letter}</span>
              </button>
            ))}
            {!disabled && (
              <button
                onClick={clearSelection}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-12 text-gray-500 dark:text-gray-400">
            Select letters to build the word
          </div>
        )}
      </div>

      {/* Available letters */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Available letters:
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {letters.map((letter: string, index: number) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter)}
              disabled={disabled}
              className={cn(
                'aspect-square p-2 rounded-lg border-2 transition-all',
                'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
                'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'flex items-center justify-center'
              )}
            >
              <span className="text-xl font-medium cyrillic">{letter}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};