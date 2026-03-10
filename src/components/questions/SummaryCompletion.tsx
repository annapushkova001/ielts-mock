import type { QuestionGroup } from '../../types';

interface Props {
  questionGroup: QuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

export default function SummaryCompletion({ questionGroup, answers, onAnswer }: Props) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">{questionGroup.title}</h3>
        <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: questionGroup.instruction }} />
        {questionGroup.wordLimit && (
          <p className="text-sm font-semibold text-red-600 mt-1">{questionGroup.wordLimit}</p>
        )}
      </div>
      <div className="leading-relaxed">
        {questionGroup.questions.map(question => (
          <span key={question.id} className="inline">
            <span>{question.text.split('_____')[0]}</span>
            <input
              type="text"
              placeholder={`Q${question.number}`}
              value={(answers[question.id] as string) || ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="mx-1 px-2 py-0.5 border-b-2 border-gray-400 focus:border-blue-500 outline-none w-28 text-center bg-transparent inline"
            />
            <span>{question.text.split('_____')[1] || ''} </span>
          </span>
        ))}
      </div>
    </div>
  );
}
