import type { QuestionGroup } from '../../types';

interface Props {
  questionGroup: QuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

export default function YesNoNotGiven({ questionGroup, answers, onAnswer }: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">{questionGroup.title}</h3>
        <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: questionGroup.instruction }} />
      </div>
      {questionGroup.questions.map(question => (
        <div key={question.id} className="space-y-2">
          <div className="flex gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-gray-800 rounded font-bold text-sm shrink-0">
              {question.number}
            </span>
            <p className="pt-1">{question.text}</p>
          </div>
          <div className="flex gap-4 ml-10">
            {['YES', 'NO', 'NOT GIVEN'].map(opt => {
              const optId = opt.toLowerCase().replace(' ', '-');
              return (
                <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={optId}
                    checked={answers[question.id] === optId}
                    onChange={() => onAnswer(question.id, optId)}
                    className="accent-[var(--accent-color)]"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
