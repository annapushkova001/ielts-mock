import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { QuestionGroup } from '../../types';

interface Props {
  questionGroup: QuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

function DraggableHeading({ id, text, isUsed }: { id: string; text: string; isUsed: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

  if (isUsed) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-2 border-2 border-gray-400 rounded bg-white cursor-grab text-sm ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      {text}
    </div>
  );
}

function DropZone({ id, questionNumber, assignedText }: { id: string; questionNumber: number; assignedText?: string }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-3 border-2 rounded min-h-[48px] flex items-center gap-2 ${
        assignedText
          ? 'border-green-400 bg-green-50'
          : isOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-dashed border-blue-300 bg-gray-50'
      }`}
    >
      <span className="inline-flex items-center justify-center w-7 h-7 border-2 border-gray-800 rounded font-bold text-xs shrink-0">
        {questionNumber}
      </span>
      {assignedText ? (
        <span className="text-sm">{assignedText}</span>
      ) : (
        <span className="text-sm text-gray-400 italic">Drop heading here</span>
      )}
    </div>
  );
}

export default function MatchingHeadings({ questionGroup, answers, onAnswer }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const options = questionGroup.options || [];
  const usedOptionIds = new Set(
    questionGroup.questions
      .map(q => answers[q.id] as string | undefined)
      .filter(Boolean)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const questionId = over.id as string;
    const optionId = active.id as string;
    onAnswer(questionId, optionId);
  };

  const activeOption = options.find(o => o.id === activeId);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">{questionGroup.title}</h3>
        <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: questionGroup.instruction }} />
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="mt-2 text-xs text-blue-600 underline cursor-pointer"
        >
          {showHelp ? 'Hide help' : 'How to answer?'}
        </button>
        {showHelp && (
          <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-blue-800">
            Drag a heading from the list below and drop it onto the matching question number.
            You can also click a heading, then click the drop zone to assign it.
          </div>
        )}
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Drop zones */}
        <div className="space-y-2 mb-6">
          {questionGroup.questions.map(question => {
            const assignedOptionId = answers[question.id] as string | undefined;
            const assignedOption = options.find(o => o.id === assignedOptionId);
            return (
              <div key={question.id} id={`question-${question.id}`}>
                <DropZone
                  id={question.id}
                  questionNumber={question.number}
                  assignedText={assignedOption?.text}
                />
              </div>
            );
          })}
        </div>

        {/* Draggable headings */}
        <div className="border-t pt-4">
          <p className="text-sm font-semibold mb-2 text-gray-600">List of Headings</p>
          <div className="space-y-2">
            {options.map(option => (
              <DraggableHeading
                key={option.id}
                id={option.id}
                text={option.text}
                isUsed={usedOptionIds.has(option.id)}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeOption ? (
            <div className="p-2 border-2 border-blue-500 rounded bg-white shadow-lg text-sm">
              {activeOption.text}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
