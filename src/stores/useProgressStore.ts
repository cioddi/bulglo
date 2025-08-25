import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import localforage from 'localforage';
import type { ProgressState, LessonResult, Theme } from '../types';

interface ProgressStore extends ProgressState {
  // Actions
  addXp: (amount: number) => void;
  completeLesson: (result: LessonResult) => void;
  updateStreak: () => void;
  updateSrsItem: (itemId: string, correct: boolean) => void;
  unlockBadge: (badgeId: string) => void;
  updateTheme: (theme: Theme) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  resetProgress: () => void;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
}

const initialState: ProgressState = {
  version: '1.0.0',
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveISO: new Date().toISOString(),
  completedLessons: {},
  srs: {},
  badges: [],
  settings: {
    haptics: true,
    theme: 'system',
    soundEnabled: true,
  },
};

const calculateLevel = (xp: number): number => Math.floor(xp / 100) + 1;

const calculateSrsBucket = (currentBucket: number, correct: boolean): number => {
  if (correct) {
    return Math.min(4, currentBucket + 1);
  } else {
    return Math.max(0, currentBucket - 1);
  }
};

const calculateSrsDueDate = (bucket: number): string => {
  const daysToAdd = [0, 1, 2, 4, 7][bucket];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysToAdd);
  return dueDate.toISOString();
};

// const calculateStreak = (lastActive: string): number => {
//   const lastDate = new Date(lastActive);
//   const today = new Date();
//   const diffTime = Math.abs(today.getTime() - lastDate.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
//   return diffDays <= 1 ? diffDays : 0;
// };

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXp: (amount: number) => {
        set((state) => {
          const newXp = state.xp + amount;
          const newLevel = calculateLevel(newXp);
          return {
            ...state,
            xp: newXp,
            level: newLevel,
          };
        });
      },

      completeLesson: (result: LessonResult) => {
        set((state) => {
          const newCompletedLessons = {
            ...state.completedLessons,
            [result.lessonId]: {
              timestamp: result.completedAt,
              score: result.score,
            },
          };

          const newXp = state.xp + result.xpEarned;
          const newLevel = calculateLevel(newXp);

          return {
            ...state,
            completedLessons: newCompletedLessons,
            xp: newXp,
            level: newLevel,
            lastActiveISO: new Date().toISOString(),
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastActive = state.lastActiveISO.split('T')[0];
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newStreak = state.streakDays;

          if (lastActive === today) {
            // Already active today, no change
          } else if (lastActive === yesterdayStr) {
            // Continuing streak
            newStreak += 1;
          } else {
            // Streak broken, start new
            newStreak = 1;
          }

          return {
            ...state,
            streakDays: newStreak,
            lastActiveISO: new Date().toISOString(),
          };
        });
      },

      updateSrsItem: (itemId: string, correct: boolean) => {
        set((state) => {
          const currentItem = state.srs[itemId] || { bucket: 0, dueISO: new Date().toISOString() };
          const newBucket = calculateSrsBucket(currentItem.bucket, correct);
          const newDueDate = calculateSrsDueDate(newBucket);

          return {
            ...state,
            srs: {
              ...state.srs,
              [itemId]: {
                bucket: newBucket as 0 | 1 | 2 | 3 | 4,
                dueISO: newDueDate,
              },
            },
          };
        });
      },

      unlockBadge: (badgeId: string) => {
        set((state) => {
          if (!state.badges.includes(badgeId)) {
            return {
              ...state,
              badges: [...state.badges, badgeId],
            };
          }
          return state;
        });
      },

      updateTheme: (theme: Theme) => {
        set((state) => ({
          ...state,
          settings: {
            ...state.settings,
            theme,
          },
        }));
      },

      toggleSound: () => {
        set((state) => ({
          ...state,
          settings: {
            ...state.settings,
            soundEnabled: !state.settings.soundEnabled,
          },
        }));
      },

      toggleHaptics: () => {
        set((state) => ({
          ...state,
          settings: {
            ...state.settings,
            haptics: !state.settings.haptics,
          },
        }));
      },

      resetProgress: () => {
        set(initialState);
      },

      exportData: async (): Promise<string> => {
        const state = get();
        const exportData = {
          ...state,
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(exportData, null, 2);
      },

      importData: async (data: string): Promise<void> => {
        try {
          const importedData = JSON.parse(data);
          // Validate the data structure
          if (importedData.version && importedData.xp !== undefined) {
            set({
              ...importedData,
              // Ensure we don't override the current version
              version: initialState.version,
            });
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error('Failed to import data:', error);
          throw new Error('Failed to import data. Please check the file format.');
        }
      },
    }),
    {
      name: 'bulglo-progress',
      storage: {
        getItem: async (name: string) => {
          const value = await localforage.getItem(name);
          return value ? JSON.parse(value as string) : null;
        },
        setItem: async (name: string, value: any) => {
          await localforage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await localforage.removeItem(name);
        },
      },
    }
  )
);