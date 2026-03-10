export function checkAnswer(
  userAnswer: string | string[] | null | undefined,
  correctAnswer: string | string[],
  acceptableAnswers?: string[]
): boolean {
  if (userAnswer === null || userAnswer === undefined) return false;

  // Multi-select: unordered set comparison
  if (Array.isArray(correctAnswer)) {
    if (!Array.isArray(userAnswer)) return false;
    if (userAnswer.length !== correctAnswer.length) return false;
    const sortedUser = [...userAnswer].sort();
    const sortedCorrect = [...correctAnswer].sort();
    return sortedUser.every((val, i) => val.toLowerCase().trim() === sortedCorrect[i].toLowerCase().trim());
  }

  // Single answer: string comparison
  if (Array.isArray(userAnswer)) return false;
  const normalizedUser = userAnswer.toLowerCase().trim();
  const normalizedCorrect = correctAnswer.toLowerCase().trim();

  if (normalizedUser === normalizedCorrect) return true;

  // Check acceptable alternatives
  if (acceptableAnswers) {
    return acceptableAnswers.some(
      alt => normalizedUser === alt.toLowerCase().trim()
    );
  }

  return false;
}
