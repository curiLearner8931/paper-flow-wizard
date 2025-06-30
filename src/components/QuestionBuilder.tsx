import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, ChevronRight, Image, X } from 'lucide-react';
import { StepProps, QuestionSection, Question, QuestionType } from '../types/exam';
import { useToast } from '@/hooks/use-toast';
import MarksValidationDialog from './MarksValidationDialog';

const QuestionBuilder: React.FC<StepProps> = ({ 
  examData, 
  setExamData, 
  nextStep, 
  prevStep 
}) => {
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [showMarksDialog, setShowMarksDialog] = useState(false);

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
  }, [examData.numberOfSections, examData.sections.length, setExamData]);

  const addQuestion = (sectionId: string) => {
    try {
      const section = examData.sections.find(s => s.id === sectionId);
      if (!section) {
        console.error('Section not found:', sectionId);
        return;
      }

      const newQuestion: Question = {
        id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: '',
        marks: 1,
        type: section.type,
        options: section.type === 'MCQ' ? ['', '', '', ''] : undefined,
        correctAnswer: section.type === 'MCQ' ? 0 : undefined
      };

      const updatedSections = examData.sections.map(s => 
        s.id === sectionId 
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      );

      setExamData({ ...examData, sections: updatedSections });
      
      toast({
        title: "Question added",
        description: "New question has been added to the section.",
      });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateQuestion = (sectionId: string, questionId: string, field: string, value: any) => {
    try {
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
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const updateSection = (sectionId: string, field: string, value: any) => {
    try {
      const updatedSections = examData.sections.map(section => 
        section.id === sectionId 
          ? { ...section, [field]: value }
          : section
      );

      setExamData({ ...examData, sections: updatedSections });
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    try {
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
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const addSection = () => {
    try {
      if (examData.sections.length < 15) {
        const newSection: QuestionSection = {
          id: `section-${examData.sections.length + 1}`,
          title: `Section ${examData.sections.length + 1}`,
          type: 'MCQ',
          questions: []
        };
        const updatedSections = [...examData.sections, newSection];
        setExamData({
          ...examData,
          numberOfSections: examData.numberOfSections + 1,
          sections: updatedSections
        });
        toast({
          title: "Section added",
          description: "New section has been added.",
        });
      }
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  const removeSection = (sectionId: string) => {
    try {
      if (examData.sections.length > 1) {
        const updatedSections = examData.sections.filter(s => s.id !== sectionId);
        setExamData({
          ...examData,
          numberOfSections: examData.numberOfSections - 1,
          sections: updatedSections
        });
        toast({
          title: "Section removed",
          description: "Section has been removed.",
        });
      }
    } catch (error) {
      console.error('Error removing section:', error);
    }
  };

  const handleImageUpload = (sectionId: string, questionId: string, file: File) => {
    try {
      updateQuestion(sectionId, questionId, 'image', file);
      toast({
        title: "Image uploaded",
        description: "Image has been attached to the question.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const removeImage = (sectionId: string, questionId: string) => {
    try {
      updateQuestion(sectionId, questionId, 'image', undefined);
      toast({
        title: "Image removed",
        description: "Image has been removed from the question.",
      });
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const calculateTotalMarks = () => {
    try {
      return examData.sections.reduce((total, section) => 
        total + section.questions.reduce((sectionTotal, question) => sectionTotal + (question.marks || 0), 0), 0
      );
    } catch (error) {
      console.error('Error calculating total marks:', error);
      return examData.totalMarks;
    }
  };

  const canProceed = () => {
    try {
      const hasQuestions = examData.sections.every(section => section.questions.length > 0);
      const totalMarks = calculateTotalMarks();
      
      if (hasQuestions && totalMarks !== examData.totalMarks) {
        setShowMarksDialog(true);
        return false;
      }
      
      return hasQuestions;
    } catch (error) {
      console.error('Error checking if can proceed:', error);
      return false;
    }
  };

  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Build Your Questions
        </h2>
        <p className="text-gray-600">
          Add questions for each section of your exam ({examData.numberOfSections} sections)
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total Marks: {calculateTotalMarks()} / {examData.totalMarks}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addSection}
            disabled={examData.sections.length >= 15}
            className="flex items-center space-x-1"
          >
            <Plus className="h-3 w-3" />
            <span>Add Section</span>
          </Button>
        </div>
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
                      {examData.sections.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSection(section.id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
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

                          {(section.type === 'Diagram-based' || section.type === 'MCQ') && (
                            <div className="space-y-2">
                              <Label>
                                {section.type === 'Diagram-based' ? 'Diagram Image' : 'Question Image (Optional)'}
                              </Label>
                              {!question.image ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleImageUpload(section.id, question.id, file);
                                      }
                                    }}
                                    className="hidden"
                                    id={`image-${question.id}`}
                                  />
                                  <label
                                    htmlFor={`image-${question.id}`}
                                    className="cursor-pointer flex flex-col items-center space-y-2"
                                  >
                                    <Image className="h-8 w-8 text-gray-400" />
                                    <span className="text-sm text-gray-500">Click to upload image</span>
                                  </label>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex items-center space-x-2">
                                    <Image className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">{question.image.name}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeImage(section.id, question.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

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

      <MarksValidationDialog
        isOpen={showMarksDialog}
        onClose={() => setShowMarksDialog(false)}
        expectedMarks={examData.totalMarks}
        actualMarks={calculateTotalMarks()}
      />

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
