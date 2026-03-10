import type { QuestionGroup } from '../../types';

interface Props {
  questionGroup: QuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

export default function MultipleChoiceMulti({ questionGroup, answers, onAnswer }: Props) {
  const chooseCount = questionGroup.chooseCount || 2;
  const firstQ = questionGroup.questions[0];
  const lastQ = questionGroup.questions[questionGroup.questions.length - 1];
  const groupLabel = firstQ.number === lastQ.number
    ? `Question ${firstQ.number}`
    : `Questions ${firstQ.number}–${lastQ.number}`;

  // All questions in the group share a single set of options
  // The answer is stored as an array of selected option IDs on the first question
  const selectedAnswers = (answers[firstQ.id] as string[] | undefined) || [];

  const handleToggle = (optionId: string) => {
    let newSelected: string[];
    if (selectedAnswers.includes(optionId)) {
      newSelected = selectedAnswers.filter(id => id !== optionId);
    } else {
      if (selectedAnswers.length >= chooseCount) return;
      newSelected = [...selectedAnswers, optionId];
    }
    // Store on all questions in the group
    questionGroup.questions.forEach(q => {
      onAnswer(q.id, newSelected);
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">{questionGroup.title}</h3>
        <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: questionGroup.instruction }} />
      </div>
      <div>
        <p className="font-medium mb-1">{groupLabel}</p>
        <p className="text-sm text-gray-500 mb-3">Choose {chooseCount} answers.</p>
        <div className="space-y-2 ml-2">
          {firstQ.options?.map(option => (
            <label
              key={option.id}
              className={`flex items-start gap-2 cursor-pointer ${
                !selectedAnswers.includes(option.id) && selectedAnswers.length >= chooseCount
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <input
                type="checkbox"
                value={option.id}
                checked={selectedAnswers.includes(option.id)}
                onChange={() => handleToggle(option.id)}
                disabled={!selectedAnswers.includes(option.id) && selectedAnswers.length >= chooseCount}
                className="mt-1 accent-[var(--accent-color)]"
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
