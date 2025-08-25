import React from 'react';
import { useProgressStore } from '../../stores/useProgressStore';

interface HeaderProps {
  title?: string;
  showProgress?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showProgress = true }) => {
  const { xp, level, streakDays } = useProgressStore();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src="/bulglo/logo_400x150.png" 
                alt="Bulglo" 
                className="h-10 w-auto"
              />
            </div>
            {title && (
              <div className="ml-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                {title}
              </div>
            )}
          </div>

          {showProgress && (
            <div className="flex items-center space-x-4">
              {/* Streak */}
              <div className="flex items-center space-x-1">
                <span className="text-orange-500">🔥</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {streakDays}
                </span>
              </div>

              {/* Level */}
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                    {level}
                  </span>
                </div>
              </div>

              {/* XP Progress */}
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{
                      width: `${((xp % 100) / 100) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {xp % 100}/100
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};