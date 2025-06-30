
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { QuestionSection, Question, QuestionType } from '../types/exam';
import QuestionTypeSelector from './QuestionTypeSelector';
import QuestionCard from './QuestionCard';

interface SectionCardProps {
  section: QuestionSection;
  isOpen: boolean;
  canRemove: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (questionId: string, field: string, value: any) => void;
  onDeleteQuestion: (questionId: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  section,
  isOpen,
  canRemove,
  onToggle,
  onUpdate,
  onRemove,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion
}) => {
  return (
    <Card className="border-2 hover:border-blue-200 transition-colors duration-200">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors duration-200">
            <CardTitle className="flex items-center justify-between">
              <span>{section.title}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                </span>
                {canRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
                {isOpen ? 
                  <ChevronDown className="h-5 w-5" /> : 
                  <ChevronRight className="h-5 w-5" />
                }
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuestionTypeSelector
                value={section.type}
                onChange={(value) => onUpdate('type', value)}
              />
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={section.title}
                  onChange={(e) => onUpdate('title', e.target.value)}
                  placeholder="e.g., Multiple Choice Questions"
                  className="bg-white border-gray-300 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              {section.questions.map((question, qIndex) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  sectionType={section.type}
                  questionIndex={qIndex}
                  onUpdate={(field, value) => onUpdateQuestion(question.id, field, value)}
                  onDelete={() => onDeleteQuestion(question.id)}
                />
              ))}

              <Button
                variant="outline"
                onClick={onAddQuestion}
                className="w-full border-dashed border-2 hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Sub-question
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SectionCard;
