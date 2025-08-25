export type LangCode = "en" | "bg";

export interface LetterCard {
  id: string;
  upper: string;
  lower: string;
  name: string;
  romanization: string;
  ipa: string;
  tips?: string[];
}

export interface VocabItem {
  id: string;
  bg: string;
  en: string;
  translit?: string;
  imageSrc?: string;
  tags?: string[];
}

export type ExerciseKind =
  | "multiple_choice"
  | "select_letters"
  | "match_pairs"
  | "type"
  | "order_words"
  | "true_false"
  | "flashcard";

export interface Exercise {
  id: string;
  kind: ExerciseKind;
  prompt: string;
  promptLang: LangCode;
  data: any;
  correct: string | string[];
  tips?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  unitId: string;
  prerequisites?: string[];
  exercises: Exercise[];
  vocab?: string[];
}

export interface Unit {
  id: string;
  title: string;
  order: number;
  lessons: string[];
}

export interface CourseMeta {
  id: string;
  title: string;
  version: string;
  units: string[];
}

export interface ProgressState {
  version: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveISO: string;
  completedLessons: Record<string, { timestamp: string; score: number }>;
  srs: Record<string, { bucket: 0 | 1 | 2 | 3 | 4; dueISO: string }>;
  badges: string[];
  settings: { 
    haptics: boolean; 
    theme: "system" | "light" | "dark";
    soundEnabled: boolean;
  };
}

export type Theme = "system" | "light" | "dark";

export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  timeSpent: number;
  attempts: number;
}

export interface LessonResult {
  lessonId: string;
  score: number;
  totalExercises: number;
  correctAnswers: number;
  xpEarned: number;
  completedAt: string;
  exerciseResults: ExerciseResult[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}