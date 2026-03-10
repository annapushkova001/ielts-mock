import type { QuestionGroup } from '../../types';
import TrueFalseNotGiven from './TrueFalseNotGiven';
import YesNoNotGiven from './YesNoNotGiven';
import MultipleChoiceSingle from './MultipleChoiceSingle';
import MultipleChoiceMulti from './MultipleChoiceMulti';
import MatchingHeadings from './MatchingHeadings';
import NoteCompletion from './NoteCompletion';
import SummaryCompletion from './SummaryCompletion';
import MatchingInformation from './MatchingInformation';
import MatchingFeatures from './MatchingFeatures';
import MatchingSentenceEndings from './MatchingSentenceEndings';

interface Props {
  questionGroup: QuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

const componentMap: Record<string, React.ComponentType<Props>> = {
  'true-false-not-given': TrueFalseNotGiven,
  'yes-no-not-given': YesNoNotGiven,
  'multiple-choice-single': MultipleChoiceSingle,
  'multiple-choice-multi': MultipleChoiceMulti,
  'matching-headings': MatchingHeadings,
  'note-completion': NoteCompletion,
  'summary-completion': SummaryCompletion,
  'matching-information': MatchingInformation,
  'matching-features': MatchingFeatures,
  'matching-sentence-endings': MatchingSentenceEndings,
};

export default function QuestionRenderer({ questionGroup, answers, onAnswer }: Props) {
  const Component = componentMap[questionGroup.type];

  if (!Component) {
    return (
      <div className="p-4 text-red-500">
        Unknown question type: {questionGroup.type}
      </div>
    );
  }

  return <Component questionGroup={questionGroup} answers={answers} onAnswer={onAnswer} />;
}
