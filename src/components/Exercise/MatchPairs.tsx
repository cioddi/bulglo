import React, { useState } from 'react';
import type { Exercise } from '../../types';
import { cn } from '../../utils/cn';

interface MatchPairsProps {
  exercise: Exercise;
  answer: string | string[] | null;
  onAnswerChange: (answer: string | string[] | null) => void;
  isCorrect: boolean | null;
  disabled: boolean;
}

export const MatchPairs: React.FC<MatchPairsProps> = ({
  exercise,
  answer,
  onAnswerChange,
  isCorrect: _isCorrect,
  disabled,
}) => {
  const { leftItems, rightItems } = exercise.data;
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const matches = Array.isArray(answer) ? answer : [];

  const handleLeftClick = (item: string) => {
    if (disabled) return;
    
    if (selectedLeft === item) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(item);
      if (selectedRight) {
        createMatch(item, selectedRight);
      }
    }
  };

  const handleRightClick = (item: string) => {
    if (disabled) return;
    
    if (selectedRight === item) {
      setSelectedRight(null);
    } else {
      setSelectedRight(item);
      if (selectedLeft) {
        createMatch(selectedLeft, item);
      }
    }
  };

  const createMatch = (left: string, right: string) => {
    const newMatch = `${left}:${right}`;
    const newMatches = [...matches, newMatch];
    onAnswerChange(newMatches);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const isItemMatched = (item: string, side: 'left' | 'right') => {
    return matches.some(match => {
      const [left, right] = match.split(':');
      return side === 'left' ? left === item : right === item;
    });
  };

  const getItemStyle = (item: string, side: 'left' | 'right', isSelected: boolean) => {
    if (disabled) {
      if (isItemMatched(item, side)) {
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      }
      return 'border-gray-300 dark:border-gray-600';
    }

    if (isSelected) {
      return 'border-primary-500 bg-primary-50 dark:bg-primary-900/20';
    }

    if (isItemMatched(item, side)) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }

    return 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Click items to match them together
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-3">
          {leftItems.map((item: string, index: number) => (
            <button
              key={index}
              onClick={() => handleLeftClick(item)}
              disabled={disabled || isItemMatched(item, 'left')}
              className={cn(
                'w-full p-4 text-center border-2 rounded-lg transition-all duration-200',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'disabled:cursor-not-allowed',
                getItemStyle(item, 'left', selectedLeft === item)
              )}
            >
              <span className="text-base font-medium cyrillic">{item}</span>
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {rightItems.map((item: string, index: number) => (
            <button
              key={index}
              onClick={() => handleRightClick(item)}
              disabled={disabled || isItemMatched(item, 'right')}
              className={cn(
                'w-full p-4 text-center border-2 rounded-lg transition-all duration-200',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'disabled:cursor-not-allowed',
                getItemStyle(item, 'right', selectedRight === item)
              )}
            >
              <span className="text-base font-medium">{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Matches display */}
      {matches.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Matches:</p>
          <div className="space-y-2">
            {matches.map((match, index) => {
              const [left, right] = match.split(':');
              return (
                <div
                  key={index}
                  className="flex items-center justify-center p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded"
                >
                  <span className="cyrillic font-medium">{left}</span>
                  <span className="mx-3 text-gray-500">↔</span>
                  <span className="font-medium">{right}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};