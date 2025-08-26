import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContentStore } from '../stores/useContentStore';
import { useProgressStore } from '../stores/useProgressStore';
import { ExerciseContainer } from '../components/Exercise/ExerciseContainer';
import type { ExerciseResult, LessonResult } from '../types';
import { Button } from '../components/UI/Button';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { getLesson } = useContentStore();
  const { completeLesson, addXp, unlockBadge, updateSrsItem } = useProgressStore();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const lesson = lessonId ? getLesson(lessonId) : null;

  useEffect(() => {
    if (!lesson) {
      navigate('/');
    }
  }, [lesson, navigate]);

  if (!lesson) {
    return null;
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === lesson.exercises.length - 1;

  const handleExerciseComplete = (result: ExerciseResult) => {
    const newResults = [...exerciseResults, result];
    setExerciseResults(newResults);

    // Handle SRS for flashcard exercises or explicit SRS confidence
    if (currentExercise.kind === 'flashcard' && result.correct) {
      const itemId = `${lesson.id}-${currentExercise.id}`;
      // Map flashcard confidence to SRS adjustment - we need to get the actual answer from the store
      // For now, treat flashcard completion as correct for SRS
      updateSrsItem(itemId, true);
    } else if (result.srsConfidence !== undefined) {
      const itemId = `${lesson.id}-${currentExercise.id}`;
      // Map confidence (0-4) to SRS bucket adjustment
      // 0: Reset to bucket 0, 1: Stay at 0, 2: Stay current, 3: Advance, 4: Advance more
      const confidenceToCorrect = result.srsConfidence >= 2;
      updateSrsItem(itemId, confidenceToCorrect);
    }

    if (isLastExercise) {
      // Calculate lesson results
      const correctAnswers = newResults.filter(r => r.correct).length;
      const score = Math.round((correctAnswers / newResults.length) * 100);
      // const totalTime = newResults.reduce((sum, r) => sum + r.timeSpent, 0);
      
      // Calculate XP based on performance
      let xpEarned = 10; // Base XP
      if (score >= 80) xpEarned += 5; // Bonus for good performance
      if (score === 100) xpEarned += 5; // Bonus for perfect score

      const lessonResult: LessonResult = {
        lessonId: lesson.id,
        score,
        totalExercises: lesson.exercises.length,
        correctAnswers,
        xpEarned,
        completedAt: new Date().toISOString(),
        exerciseResults: newResults,
      };

      // Update progress
      completeLesson(lessonResult);
      addXp(xpEarned);

      // Check for badges
      if (score === 100) {
        unlockBadge('perfect_lesson');
      }
      if (correctAnswers === 1 && newResults.length === 1) {
        unlockBadge('first_lesson');
      }

      setShowResults(true);
    } else {
      // Move to next exercise
      setTimeout(() => {
        setCurrentExerciseIndex(prev => prev + 1);
      }, 1500);
    }
  };

  const handleSkipExercise = () => {
    if (isLastExercise) {
      navigate('/');
    } else {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const renderResults = () => {
    const correctAnswers = exerciseResults.filter(r => r.correct).length;
    const score = Math.round((correctAnswers / exerciseResults.length) * 100);

    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <span className="text-4xl text-green-600 dark:text-green-400">🎉</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Lesson Complete!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400">
            Great job finishing "{lesson.title}"
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {score}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Score
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {correctAnswers}/{exerciseResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Correct
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              +{score >= 80 ? (score === 100 ? 20 : 15) : 10}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              XP Earned
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
          >
            Back to Home
          </Button>
          
          <Button
            onClick={() => navigate('/practice')}
            variant="primary"
          >
            Practice More
          </Button>
        </div>
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        {renderResults()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Progress header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex-1 mx-4">
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{
                    width: `${((currentExerciseIndex + 1) / lesson.exercises.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentExerciseIndex + 1} / {lesson.exercises.length}
            </span>
          </div>
        </div>
      </div>

      {/* Exercise content */}
      <div className="py-8">
        <ExerciseContainer
          exercise={currentExercise}
          onComplete={handleExerciseComplete}
          onSkip={handleSkipExercise}
        />
      </div>
    </div>
  );
};