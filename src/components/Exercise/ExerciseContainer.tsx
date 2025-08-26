import React, { useState, useEffect } from 'react';
import type { Exercise, ExerciseResult } from '../../types';
import { Button } from '../UI/Button';
import { SRSFeedback } from './SRSFeedback';
import { MultipleChoice } from './MultipleChoice';
import { SelectLetters } from './SelectLetters';
import { MatchPairs } from './MatchPairs';
import { TypeAnswer } from './TypeAnswer';
import { OrderWords } from './OrderWords';
import { TrueFalse } from './TrueFalse';
import { Flashcard } from './Flashcard';

interface ExerciseContainerProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
  onSkip?: () => void;
}

export const ExerciseContainer: React.FC<ExerciseContainerProps> = ({
  exercise,
  onComplete,
  onSkip,
}) => {
  const [answer, setAnswer] = useState<string | string[] | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [showTip, setShowTip] = useState(false);
  const [showSRSFeedback, setShowSRSFeedback] = useState(false);
  const [caseError, setCaseError] = useState<boolean>(false);
  const [wasSkipped, setWasSkipped] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when exercise changes
    setAnswer(null);
    setIsCorrect(null);
    setAttempts(0);
    setShowTip(false);
    setShowSRSFeedback(false);
    setCaseError(false);
    setWasSkipped(false);
  }, [exercise.id]);

  const checkAnswer = (submittedAnswer?: string | string[]) => {
    const answerToCheck = submittedAnswer || answer;
    if (!answerToCheck) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let correct = false;
    let hasCaseError = false;
    
    // Special handling for flashcard exercises - any confidence answer is correct
    if (exercise.kind === 'flashcard') {
      correct = ['hard', 'good', 'easy'].includes(String(answerToCheck));
    } else if (Array.isArray(exercise.correct)) {
      if (Array.isArray(answerToCheck)) {
        // Case-insensitive comparison for arrays (select_letters)
        correct = answerToCheck.length === exercise.correct.length &&
          answerToCheck.every((ans, index) => 
            String(ans).toLowerCase() === String(exercise.correct[index]).toLowerCase()
          );
        
        // Check if there's a case error but content is correct
        if (!correct) {
          const caseInsensitiveMatch = answerToCheck.length === exercise.correct.length &&
            answerToCheck.every((ans, index) => 
              String(ans).toLowerCase() === String(exercise.correct[index]).toLowerCase()
            );
          if (caseInsensitiveMatch) {
            correct = true;
            hasCaseError = true;
          }
        }
      } else {
        correct = exercise.correct.some(correctAns => 
          String(correctAns).toLowerCase() === String(answerToCheck).toLowerCase()
        );
      }
    } else {
      const answerStr = String(answerToCheck).toLowerCase().trim();
      const correctStr = String(exercise.correct).toLowerCase().trim();
      correct = answerStr === correctStr;
      
      // Check for case error in single answers
      if (!correct && answerStr === correctStr) {
        correct = true;
        hasCaseError = String(answerToCheck).trim() !== String(exercise.correct).trim();
      }
    }

    setCaseError(hasCaseError);

    setIsCorrect(correct);
    if (submittedAnswer) {
      setAnswer(submittedAnswer);
    }

    if (correct) {
      setTimeout(() => {
        onComplete({
          exerciseId: exercise.id,
          correct: true,
          timeSpent: Date.now() - startTime,
          attempts: newAttempts,
        });
      }, 1500);
    } else if (newAttempts >= 3 && exercise.kind !== 'flashcard') {
      // Show SRS feedback after 3 failed attempts (but not for flashcards)
      setTimeout(() => {
        setShowSRSFeedback(true);
      }, 2000);
    } else {
      // Reset answer for retry
      setTimeout(() => {
        setAnswer(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  // Auto-submit for certain exercise types
  const shouldAutoSubmit = ['multiple_choice', 'true_false', 'flashcard'].includes(exercise.kind);
  const isFinished = (isCorrect === true) || (isCorrect === false && attempts >= 3);
  
  const handleAnswerChange = (newAnswer: string | string[] | null) => {
    // For non-auto-submit exercises, only block changes if we've reached max attempts
    // For auto-submit exercises, block changes when finished
    const shouldBlock = shouldAutoSubmit ? isFinished : (isCorrect === true || attempts >= 3);
    if (shouldBlock) return;
    
    setAnswer(newAnswer);
    
    // Auto-submit for certain exercise types
    if (shouldAutoSubmit && newAnswer) {
      setTimeout(() => checkAnswer(newAnswer), 500); // Small delay for visual feedback
    }
  };

  const handleSRSFeedback = (confidence: number) => {
    // Complete the exercise with the confidence rating
    onComplete({
      exerciseId: exercise.id,
      correct: false,
      timeSpent: Date.now() - startTime,
      attempts,
      srsConfidence: confidence,
    });
  };

  const handleSkipWithAnswer = () => {
    setWasSkipped(true);
    setIsCorrect(false);
    setTimeout(() => {
      if (onSkip) {
        onSkip();
      }
    }, 2000); // Show answer for 2 seconds before skipping
  };

  const renderExercise = () => {
    // Use same logic as handleAnswerChange for disabled state
    const isDisabled = shouldAutoSubmit ? isFinished : (isCorrect === true || attempts >= 3);
    
    const commonProps = {
      exercise,
      answer,
      onAnswerChange: handleAnswerChange,
      isCorrect,
      disabled: isDisabled,
    };

    switch (exercise.kind) {
      case 'multiple_choice':
        return <MultipleChoice {...commonProps} />;
      case 'select_letters':
        return <SelectLetters {...commonProps} />;
      case 'match_pairs':
        return <MatchPairs {...commonProps} />;
      case 'type':
        return <TypeAnswer {...commonProps} />;
      case 'order_words':
        return <OrderWords {...commonProps} />;
      case 'true_false':
        return <TrueFalse {...commonProps} />;
      case 'flashcard':
        return <Flashcard {...commonProps} />;
      default:
        return <div>Unknown exercise type: {exercise.kind}</div>;
    }
  };

  // Show SRS feedback if needed
  if (showSRSFeedback) {
    return <SRSFeedback exercise={exercise} onFeedback={handleSRSFeedback} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question
          </span>
          {onSkip && (
            <button
              onClick={handleSkipWithAnswer}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Skip
            </button>
          )}
        </div>
      </div>

      {/* Exercise prompt */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {exercise.prompt}
        </h2>
      </div>

      {/* Exercise content */}
      <div className="mb-8">
        {renderExercise()}
      </div>

      {/* Feedback */}
      {isCorrect !== null && (
        <div className={`p-4 rounded-lg mb-6 ${
          isCorrect 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center">
            {isCorrect ? (
              <>
                <span className="text-green-600 dark:text-green-400 text-2xl mr-3">✓</span>
                <span className="text-green-800 dark:text-green-200 font-medium">
                  Correct!
                </span>
              </>
            ) : (
              <>
                <span className="text-red-600 dark:text-red-400 text-2xl mr-3">✗</span>
                <div>
                  <span className="text-red-800 dark:text-red-200 font-medium">
                    {wasSkipped ? 'The correct answer was:' 
                      : caseError ? 'Correct! (Check your capitalization)' 
                      : attempts >= 3 ? 'The correct answer was:' 
                      : 'Try again!'
                    }
                  </span>
                  {(attempts >= 3 || caseError || wasSkipped) && (
                    <div className="mt-1 text-red-700 dark:text-red-300 cyrillic">
                      {Array.isArray(exercise.correct) 
                        ? exercise.correct.join('')
                        : exercise.correct
                      }
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      {exercise.tips && exercise.tips.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowTip(!showTip)}
            className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
          >
            {showTip ? 'Hide tip' : 'Show tip'}
          </button>
          {showTip && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {exercise.tips[0]}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-center">
        {!isFinished && !shouldAutoSubmit && (
          <Button 
            onClick={() => checkAnswer()}
            disabled={!answer || (Array.isArray(answer) && answer.length === 0)}
            size="lg"
            className="min-w-[120px]"
          >
            Check
          </Button>
        )}
      </div>
    </div>
  );
};