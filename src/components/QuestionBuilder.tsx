
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { StepProps, QuestionSection, Question } from '../types/exam';
import { useToast } from '@/hooks/use-toast';
import MarksValidationDialog from './MarksValidationDialog';
import SectionCard from './SectionCard';

const QuestionBuilder: React.FC<StepProps> = ({ 
  examData, 
  setExamData, 
  nextStep, 
  prevStep 
}) => {
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [showMarksDialog, setShowMarksDialog] = useState(false);
  const questionIdCounter = useRef(0);

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
      console.log('Adding question to section:', sectionId);
      
      const section = examData.sections.find(s => s.id === sectionId);
      if (!section) {
        console.error('Section not found:', sectionId);
        toast({
          title: "Error",
          description: "Section not found. Please try again.",
          variant: "destructive"
        });
        return;
      }

      questionIdCounter.current += 1;
      const newQuestion: Question = {
        id: `question-${sectionId}-${questionIdCounter.current}`,
        text: '',
        marks: 1,
        type: section.type,
        options: section.type === 'MCQ' ? ['', '', '', ''] : undefined,
        correctAnswer: section.type === 'MCQ' ? 0 : undefined
      };

      console.log('Creating new question:', newQuestion);

      const updatedSections = examData.sections.map(s => 
        s.id === sectionId 
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      );

      console.log('Updated sections:', updatedSections);

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
          <SectionCard
            key={section.id}
            section={section}
            isOpen={openSections.includes(section.id)}
            canRemove={examData.sections.length > 1}
            onToggle={() => toggleSection(section.id)}
            onUpdate={(field, value) => updateSection(section.id, field, value)}
            onRemove={() => removeSection(section.id)}
            onAddQuestion={() => addQuestion(section.id)}
            onUpdateQuestion={(questionId, field, value) => updateQuestion(section.id, questionId, field, value)}
            onDeleteQuestion={(questionId) => deleteQuestion(section.id, questionId)}
          />
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
