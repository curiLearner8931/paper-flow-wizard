
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { StepProps, QuestionSection, Question, QuestionType } from '../types/exam';
import { useToast } from '@/hooks/use-toast';

const QuestionBuilder: React.FC<StepProps> = ({ 
  examData, 
  setExamData, 
  nextStep, 
  prevStep 
}) => {
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const questionTypes: QuestionType[] = [
    'MCQ', 'Fill in the Blanks', 'True/False', 'Match the Following',
    'Short Answer', 'Definitions', 'Full Form', 'Unscramble',
    'Diagram-based', 'Odd One Out'
  ];

  useEffect(() => {
    // Initialize sections based on numberOfSections or existing sections
    if (examData.sections.length === 0 && examData.numberOfSections > 0) {
      const initialSections: QuestionSection[] = Array.from(
        { length: examData.numberOfSections },
        (_, index) => ({
          id: `section-${index + 1}`,
          title: `Section ${index + 1}`,
          type: 'MCQ',
          questions: []
        })
      );
      setExamData({ ...examData, sections: initialSections });
      setOpenSections([initialSections[0]?.id]);
    } else if (examData.sections.length > 0 && openSections.length === 0) {
      setOpenSections([examData.sections[0].id]);
    }
  }, [examData.numberOfSections]);

  const addQuestion = (sectionId: string) => {
    const section = examData.sections.find(s => s.id === sectionId);
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: '',
      marks: 1,
      type: section?.type || 'MCQ',
      options: section?.type === 'MCQ' ? ['', '', '', ''] : undefined,
      correctAnswer: section?.type === 'MCQ' ? 0 : undefined
    };

    const updatedSections = examData.sections.map(section => 
      section.id === sectionId 
        ? { ...section, questions: [...section.questions, newQuestion] }
        : section
    );

    setExamData({ ...examData, sections: updatedSections });
    toast({
      title: "Question added",
      description: "New question has been added to the section.",
    });
  };

  const updateQuestion = (sectionId: string, questionId: string, field: string, value: any) => {
    const updatedSections = examData.sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: section.questions.map(question =>
              question.id === questionId
                ? { ...question, [field]: value }
                : question
            )
          }
        : section
    );

    setExamData({ ...examData, sections: updatedSections });
  };

  const updateSection = (sectionId: string, field: string, value: any) => {
    const updatedSections = examData.sections.map(section => 
      section.id === sectionId 
        ? { ...section, [field]: value }
        : section
    );

    setExamData({ ...examData, sections: updatedSections });
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    const updatedSections = examData.sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: section.questions.filter(q => q.id !== questionId)
          }
        : section
    );

    setExamData({ ...examData, sections: updatedSections });
    toast({
      title: "Question deleted",
      description: "Question has been removed from the section.",
    });
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const canProceed = () => {
    return examData.sections.every(section => section.questions.length > 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Build Your Questions
        </h2>
        <p className="text-gray-600">
          Add questions for each section of your exam
        </p>
      </div>

      <div className="space-y-4">
        {examData.sections.map((section) => (
          <Card key={section.id} className="border-2 hover:border-blue-200 transition-colors duration-200">
            <Collapsible
              open={openSections.includes(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                  <CardTitle className="flex items-center justify-between">
                    <span>{section.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                      </span>
                      {openSections.includes(section.id) ? 
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
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select 
                        value={section.type} 
                        onValueChange={(value) => updateSection(section.id, 'type', value)}
                      >
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
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                        placeholder="e.g., Multiple Choice Questions"
                        className="bg-white border-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {section.questions.map((question, qIndex) => (
                      <Card key={question.id} className="bg-gray-50 border-gray-200">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-700">
                              Question {qIndex + 1}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteQuestion(section.id, question.id)}
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
                                onChange={(e) => updateQuestion(section.id, question.id, 'text', e.target.value)}
                                placeholder="Enter your question here..."
                                className="min-h-[80px] bg-white border-gray-300 shadow-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Marks</Label>
                              <Input
                                type="number"
                                value={question.marks}
                                onChange={(e) => updateQuestion(section.id, question.id, 'marks', parseInt(e.target.value) || 1)}
                                min="1"
                                className="bg-white border-gray-300 shadow-sm"
                              />
                            </div>
                          </div>

                          {section.type === 'MCQ' && (
                            <div className="space-y-3">
                              <Label>Answer Options</Label>
                              {question.options?.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center space-x-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || [])];
                                      newOptions[optIndex] = e.target.value;
                                      updateQuestion(section.id, question.id, 'options', newOptions);
                                    }}
                                    placeholder={`Option ${optIndex + 1}`}
                                    className="bg-white border-gray-300 shadow-sm"
                                  />
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === optIndex}
                                    onChange={() => updateQuestion(section.id, question.id, 'correctAnswer', optIndex)}
                                    className="text-green-500"
                                  />
                                  <Label className="text-sm text-gray-600">Correct</Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => addQuestion(section.id)}
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
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          className="px-8 py-2"
        >
          Previous
        </Button>
        <Button
          onClick={nextStep}
          disabled={!canProceed()}
          className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Exam
        </Button>
      </div>
    </div>
  );
};

export default QuestionBuilder;
