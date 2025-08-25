import { create } from 'zustand';
import type { CourseMeta, Unit, Lesson, VocabItem, LetterCard } from '../types';

interface ContentStore {
  course: CourseMeta | null;
  units: Record<string, Unit>;
  lessons: Record<string, Lesson>;
  vocab: Record<string, VocabItem>;
  letters: Record<string, LetterCard>;
  loaded: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  loadContent: () => Promise<void>;
  getUnit: (unitId: string) => Unit | null;
  getLesson: (lessonId: string) => Lesson | null;
  getVocabItem: (vocabId: string) => VocabItem | null;
  getLetter: (letterId: string) => LetterCard | null;
  getUnlockedLessons: (completedLessons: Record<string, any>) => string[];
}

export const useContentStore = create<ContentStore>((set, get) => ({
  course: null,
  units: {},
  lessons: {},
  vocab: {},
  letters: {},
  loaded: false,
  loading: false,
  error: null,

  loadContent: async () => {
    set({ loading: true, error: null });

    try {
      // Load all content files with correct base path
      const basePath = import.meta.env.BASE_URL || '/';
      const [courseRes, unitsRes, lessonsRes, vocabRes, lettersRes] = await Promise.all([
        fetch(`${basePath}content/course.json`),
        fetch(`${basePath}content/units.json`),
        fetch(`${basePath}content/lessons.json`),
        fetch(`${basePath}content/vocab.json`),
        fetch(`${basePath}content/letters.json`),
      ]);

      if (!courseRes.ok || !unitsRes.ok || !lessonsRes.ok || !vocabRes.ok || !lettersRes.ok) {
        const failedFiles = [
          !courseRes.ok && `course.json (${courseRes.status})`,
          !unitsRes.ok && `units.json (${unitsRes.status})`,
          !lessonsRes.ok && `lessons.json (${lessonsRes.status})`,
          !vocabRes.ok && `vocab.json (${vocabRes.status})`,
          !lettersRes.ok && `letters.json (${lettersRes.status})`,
        ].filter(Boolean);
        throw new Error(`Failed to load content files: ${failedFiles.join(', ')}`);
      }

      const [course, unitsArray, lessonsArray, vocabArray, lettersArray] = await Promise.all([
        courseRes.json() as Promise<CourseMeta>,
        unitsRes.json() as Promise<Unit[]>,
        lessonsRes.json() as Promise<Lesson[]>,
        vocabRes.json() as Promise<VocabItem[]>,
        lettersRes.json() as Promise<LetterCard[]>,
      ]);

      // Convert arrays to lookup objects
      const units = unitsArray.reduce((acc, unit) => {
        acc[unit.id] = unit;
        return acc;
      }, {} as Record<string, Unit>);

      const lessons = lessonsArray.reduce((acc, lesson) => {
        acc[lesson.id] = lesson;
        return acc;
      }, {} as Record<string, Lesson>);

      const vocab = vocabArray.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, VocabItem>);

      const letters = lettersArray.reduce((acc, letter) => {
        acc[letter.id] = letter;
        return acc;
      }, {} as Record<string, LetterCard>);

      set({
        course,
        units,
        lessons,
        vocab,
        letters,
        loaded: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to load content:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  },

  getUnit: (unitId: string) => {
    return get().units[unitId] || null;
  },

  getLesson: (lessonId: string) => {
    return get().lessons[lessonId] || null;
  },

  getVocabItem: (vocabId: string) => {
    return get().vocab[vocabId] || null;
  },

  getLetter: (letterId: string) => {
    return get().letters[letterId] || null;
  },

  getUnlockedLessons: (completedLessons: Record<string, any>) => {
    const { units, lessons } = get();
    const unlockedLessons: string[] = [];

    // Get all units sorted by order
    const sortedUnits = Object.values(units).sort((a, b) => a.order - b.order);

    for (const unit of sortedUnits) {
      for (const lessonId of unit.lessons) {
        const lesson = lessons[lessonId];
        if (!lesson) continue;

        // Check prerequisites
        const prerequisitesMet = !lesson.prerequisites || 
          lesson.prerequisites.every(prereq => completedLessons[prereq]);

        if (prerequisitesMet) {
          unlockedLessons.push(lessonId);
        } else {
          // If prerequisites aren't met, stop unlocking lessons in this unit
          break;
        }
      }
    }

    return unlockedLessons;
  },
}));