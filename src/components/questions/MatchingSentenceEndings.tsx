import type { QuestionGroup } from '../../types';

interface Props {
  questionGroup: QuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

export default function MatchingSentenceEndings({ questionGroup, answers, onAnswer }: Props) {
  const options = questionGroup.options || [];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">{questionGroup.title}</h3>
        <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: questionGroup.instruction }} />
      </div>
      {questionGroup.questions.map(question => (
        <div key={question.id} className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-gray-800 rounded font-bold text-sm shrink-0">
            {question.number}
          </span>
          <div className="flex-1">
            <p className="text-sm mb-1">{question.text}</p>
            <select
              value={(answers[question.id] as string) || ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-full max-w-xs"
            >
              <option value="">— Select —</option>
              {options.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.text}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
