import type { QuestionGroup } from '../../types';

interface Props {
  questionGroup: QuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

export default function MultipleChoiceSingle({ questionGroup, answers, onAnswer }: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">{questionGroup.title}</h3>
        <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: questionGroup.instruction }} />
      </div>
      {questionGroup.questions.map(question => (
        <div key={question.id} className="space-y-3">
          <div className="flex gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-gray-800 rounded font-bold text-sm shrink-0">
              {question.number}
            </span>
            <p className="pt-1 font-medium">{question.text}</p>
          </div>
          <div className="space-y-2 ml-10">
            {question.options?.map(option => (
              <label key={option.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => onAnswer(question.id, option.id)}
                  className="mt-1 accent-[var(--accent-color)]"
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
