import React, { useState } from 'react';
import { useProgressStore } from '../stores/useProgressStore';
import { Button } from '../components/UI/Button';
import { ProgressRing } from '../components/UI/ProgressRing';

export const ProfilePage: React.FC = () => {
  const {
    xp,
    level,
    streakDays,
    completedLessons,
    badges,
    settings,
    updateTheme,
    toggleSound,
    toggleHaptics,
    resetProgress,
    exportData,
    importData,
  } = useProgressStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const totalLessonsCompleted = Object.keys(completedLessons).length;
  const totalXpToNextLevel = (level * 100) - (xp % 100);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulglo-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      await importData(text);
      alert('Progress imported successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import progress. Please check the file format.');
    } finally {
      setIsImporting(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    alert('Progress has been reset!');
  };

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your learning progress and settings
          </p>
        </div>

        {/* Progress stats */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Learning Progress
              </h2>
            </div>
            <ProgressRing progress={(xp % 100)} size="lg">
              <div className="text-center">
                <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {level}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Level
                </div>
              </div>
            </ProgressRing>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {xp}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total XP
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalLessonsCompleted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Lessons
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {streakDays}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Day Streak
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {badges.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Badges
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <p className="text-sm text-primary-800 dark:text-primary-200">
              {totalXpToNextLevel} XP until level {level + 1}
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Theme
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your preferred theme
                </p>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => updateTheme(e.target.value as any)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Sound Effects
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Play sounds for feedback
                </p>
              </div>
              <button
                onClick={toggleSound}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.soundEnabled
                    ? 'bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Haptic Feedback
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vibrate on mobile devices
                </p>
              </div>
              <button
                onClick={toggleHaptics}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.haptics
                    ? 'bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.haptics ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Data Management
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Export Progress
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download your progress as a backup file
                </p>
              </div>
              <Button
                onClick={handleExport}
                isLoading={isExporting}
                variant="outline"
                size="sm"
              >
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Import Progress
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Restore progress from a backup file
                </p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  onClick={() => document.getElementById('import-file')?.click()}
                  isLoading={isImporting}
                  variant="outline"
                  size="sm"
                >
                  Import
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400">
                  Reset Progress
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Delete all progress and start over
                </p>
              </div>
              <Button
                onClick={() => setShowResetConfirm(true)}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Reset confirmation modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Reset Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to reset all your progress? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};