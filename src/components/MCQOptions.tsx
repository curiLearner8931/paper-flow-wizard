
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MCQOptionsProps {
  questionId: string;
  options: string[];
  correctAnswer?: number;
  onOptionsChange: (options: string[]) => void;
  onCorrectAnswerChange: (index: number) => void;
}

const MCQOptions: React.FC<MCQOptionsProps> = ({
  questionId,
  options,
  correctAnswer,
  onOptionsChange,
  onCorrectAnswerChange
}) => {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };

  return (
    <div className="space-y-3">
      <Label>Answer Options</Label>
      {options.map((option, optIndex) => (
        <div key={optIndex} className="flex items-center space-x-2">
          <Input
            value={option}
            onChange={(e) => handleOptionChange(optIndex, e.target.value)}
            placeholder={`Option ${optIndex + 1}`}
            className="bg-white border-gray-300 shadow-sm"
          />
          <input
            type="radio"
            name={`correct-${questionId}`}
            checked={correctAnswer === optIndex}
            onChange={() => onCorrectAnswerChange(optIndex)}
            className="text-green-500"
          />
          <Label className="text-sm text-gray-600">Correct</Label>
        </div>
      ))}
    </div>
  );
};

export default MCQOptions;
