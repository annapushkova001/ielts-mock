interface InstructionBarProps {
  partNumber: number;
  instructionText: string;
}

export default function InstructionBar({ partNumber, instructionText }: InstructionBarProps) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 mt-14">
      <span className="font-bold">Part {partNumber}</span>
      <span className="mx-2">—</span>
      <span className="text-gray-700">{instructionText}</span>
    </div>
  );
}
