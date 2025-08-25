import React, { useState } from 'react';
import type { Exercise } from '../../types';
import { cn } from '../../utils/cn';

interface TypeAnswerProps {
  exercise: Exercise;
  answer: string | string[] | null;
  onAnswerChange: (answer: string | string[] | null) => void;
  isCorrect: boolean | null;
  disabled: boolean;
}

export const TypeAnswer: React.FC<TypeAnswerProps> = ({
  exercise: _exercise,
  answer,
  onAnswerChange,
  isCorrect,
  disabled,
}) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputValue = typeof answer === 'string' ? answer : '';

  const cyrillicKeyboard = [
    ['я', 'в', 'е', 'р', 'т', 'ъ', 'у', 'и', 'о', 'п', 'ч'],
    ['а', 'с', 'д', 'ф', 'г', 'х', 'й', 'к', 'л', 'ш', 'щ'],
    ['з', 'ь', 'ц', 'ж', 'б', 'н', 'м', 'ю'],
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.target.value;
    onAnswerChange(value || null);
  };

  const handleKeyboardClick = (letter: string) => {
    if (disabled) return;
    const newValue = inputValue + letter;
    onAnswerChange(newValue);
  };

  const handleBackspace = () => {
    if (disabled) return;
    const newValue = inputValue.slice(0, -1);
    onAnswerChange(newValue || null);
  };

  const getInputStyle = () => {
    if (isCorrect === null) {
      return 'border-gray-300 dark:border-gray-600 focus:border-primary-500';
    }
    return isCorrect
      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
      : 'border-red-500 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="space-y-6">
      {/* Text input */}
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="Type your answer..."
          className={cn(
            'w-full p-4 text-lg border-2 rounded-lg transition-all',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-500 dark:placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'cyrillic',
            getInputStyle()
          )}
        />
      </div>

      {/* Virtual keyboard toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowKeyboard(!showKeyboard)}
          disabled={disabled}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50"
        >
          {showKeyboard ? 'Hide' : 'Show'} Cyrillic keyboard
        </button>
      </div>

      {/* Virtual keyboard */}
      {showKeyboard && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="space-y-2">
            {cyrillicKeyboard.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleKeyboardClick(letter)}
                    disabled={disabled}
                    className={cn(
                      'min-w-[40px] h-10 px-2 rounded border border-gray-300 dark:border-gray-600',
                      'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                      'hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-500',
                      'transition-colors font-medium cyrillic',
                      'disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            ))}
            
            {/* Special keys row */}
            <div className="flex justify-center gap-1 mt-3">
              <button
                onClick={() => handleKeyboardClick(' ')}
                disabled={disabled}
                className={cn(
                  'px-8 h-10 rounded border border-gray-300 dark:border-gray-600',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                  'hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-500',
                  'transition-colors text-sm',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                Space
              </button>
              <button
                onClick={handleBackspace}
                disabled={disabled}
                className={cn(
                  'px-4 h-10 rounded border border-gray-300 dark:border-gray-600',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                  'hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-500',
                  'transition-colors text-sm',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                ⌫
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};