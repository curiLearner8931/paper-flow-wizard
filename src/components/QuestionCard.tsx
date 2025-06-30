
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Question, QuestionType } from '../types/exam';
import ImageUploader from './ImageUploader';
import MCQOptions from './MCQOptions';

interface QuestionCardProps {
  question: Question;
  sectionType: QuestionType;
  questionIndex: number;
  onUpdate: (field: string, value: any) => void;
  onDelete: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  sectionType,
  questionIndex,
  onUpdate,
  onDelete
}) => {
  const handleImageUpload = (file: File) => {
    onUpdate('image', file);
  };

  const handleImageRemove = () => {
    onUpdate('image', undefined);
  };

  const handleOptionsChange = (options: string[]) => {
    onUpdate('options', options);
  };

  const handleCorrectAnswerChange = (index: number) => {
    onUpdate('correctAnswer', index);
  };

  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-700">
            Question {questionIndex + 1}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 space-y-2">
            <Label>Question Text</Label>
            <Textarea
              value={question.text}
              onChange={(e) => onUpdate('text', e.target.value)}
              placeholder="Enter your question here..."
              className="min-h-[80px] bg-white border-gray-300 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Label>Marks</Label>
            <Input
              type="number"
              value={question.marks}
              onChange={(e) => onUpdate('marks', parseInt(e.target.value) || 1)}
              min="1"
              className="bg-white border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {(sectionType === 'Diagram-based' || sectionType === 'MCQ') && (
          <ImageUploader
            questionId={question.id}
            image={question.image}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            isDiagramRequired={sectionType === 'Diagram-based'}
          />
        )}

        {sectionType === 'MCQ' && question.options && (
          <MCQOptions
            questionId={question.id}
            options={question.options}
            correctAnswer={question.correctAnswer}
            onOptionsChange={handleOptionsChange}
            onCorrectAnswerChange={handleCorrectAnswerChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
