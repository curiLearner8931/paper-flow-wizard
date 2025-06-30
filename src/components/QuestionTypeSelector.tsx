
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionType } from '../types/exam';

interface QuestionTypeSelectorProps {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  value,
  onChange
}) => {
  const questionTypes: QuestionType[] = [
    'MCQ', 'Fill in the Blanks', 'True/False', 'Match the Following',
    'Short Answer', 'Definitions', 'Full Form', 'Unscramble',
    'Diagram-based', 'Odd One Out'
  ];

  return (
    <div className="space-y-2">
      <Label>Question Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white border-gray-300 shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
          {questionTypes.map((type) => (
            <SelectItem key={type} value={type} className="hover:bg-gray-100">
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuestionTypeSelector;
