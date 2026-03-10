import { useMemo } from 'react';
import { rawToBand } from '../utils/scoring';
import { checkAnswer } from '../utils/validation';
import type { TestConfig, Session, Result, PassageResult, QuestionResult } from '../types';

export function useScoring(config: TestConfig, session: Session): Result {
  return useMemo(() => {
    const questionResults: QuestionResult[] = [];
    const passageBreakdowns: PassageResult[] = [];

    for (const passage of config.passages) {
      let passageCorrect = 0;
      let passageTotal = 0;

      for (const group of passage.questionGroups) {
        for (const question of group.questions) {
          passageTotal++;
          const userAnswer = session.answers[question.id] ?? null;
          const isCorrect = checkAnswer(userAnswer, question.correctAnswer, question.acceptableAnswers);

          if (isCorrect) passageCorrect++;

          questionResults.push({
            questionId: question.id,
            questionNumber: question.number,
            userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect,
            explanation: question.explanation,
            passageHighlight: question.passageHighlight ?? null,
          });
        }
      }

      passageBreakdowns.push({
        passageId: passage.id,
        passageTitle: passage.title,
        correct: passageCorrect,
        total: passageTotal,
      });
    }

    const totalCorrect = questionResults.filter(r => r.isCorrect).length;
    const totalQuestions = questionResults.length;
    const bandScore = rawToBand(totalCorrect, totalQuestions);

    return {
      totalCorrect,
      totalQuestions,
      bandScore,
      passageBreakdown: passageBreakdowns,
      questionResults,
    };
  }, [config, session.answers]);
}
