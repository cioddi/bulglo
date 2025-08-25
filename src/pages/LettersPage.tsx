import React, { useState } from 'react';
import { useContentStore } from '../stores/useContentStore';
import type { LetterCard } from '../types';

export const LettersPage: React.FC = () => {
  const { letters } = useContentStore();
  const [selectedLetter, setSelectedLetter] = useState<LetterCard | null>(null);

  const lettersArray = Object.values(letters).sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Cyrillic Alphabet
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Learn the Bulgarian Cyrillic letters and their sounds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Letters grid */}
          <div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
              {lettersArray.map((letter) => (
                <button
                  key={letter.id}
                  onClick={() => setSelectedLetter(letter)}
                  className={`aspect-square p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedLetter?.id === letter.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-300'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-2xl font-bold cyrillic mb-1">
                      {letter.upper}
                    </span>
                    <span className="text-lg cyrillic">
                      {letter.lower}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Letter details */}
          <div className="lg:sticky lg:top-6">
            {selectedLetter ? (
              <div className="card">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold cyrillic mb-2">
                    {selectedLetter.upper}{selectedLetter.lower}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedLetter.name}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Sound
                    </h4>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <span className="text-lg font-mono">
                        /{selectedLetter.ipa}/
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Romanization
                    </h4>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <span className="text-lg font-medium">
                        {selectedLetter.romanization}
                      </span>
                    </div>
                  </div>

                  {selectedLetter.tips && selectedLetter.tips.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Tips
                      </h4>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          {selectedLetter.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center">
                <div className="text-4xl mb-4">🔤</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Select a Letter
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click on any letter to see detailed information about its sound and usage.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick reference */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Quick Reference
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
            {lettersArray.slice(0, 12).map((letter) => (
              <div
                key={letter.id}
                className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-700 rounded"
              >
                <span className="font-bold cyrillic text-lg">
                  {letter.upper}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  → {letter.romanization}
                </span>
              </div>
            ))}
          </div>
          {lettersArray.length > 12 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Showing first 12 letters. Select letters above to see all details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};