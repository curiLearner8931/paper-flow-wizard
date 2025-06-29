
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import ProgressTracker from './ProgressTracker';
import TemplateUpload from './TemplateUpload';
import ExamDetails from './ExamDetails';
import QuestionBuilder from './QuestionBuilder';
import ReviewStep from './ReviewStep';
import GenerateStep from './GenerateStep';
import { ExamData, QuestionSection } from '../types/exam';

const ExamGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [examData, setExamData] = useState<ExamData>({
    grade: '',
    subject: '',
    examYear: '',
    examDate: '',
    totalMarks: 0,
    duration: '',
    numberOfSections: 1,
    sections: []
  });

  const steps = [
    { id: 1, title: 'Upload Template', component: TemplateUpload },
    { id: 2, title: 'Exam Details', component: ExamDetails },
    { id: 3, title: 'Add Questions', component: QuestionBuilder },
    { id: 4, title: 'Review', component: ReviewStep },
    { id: 5, title: 'Generate', component: GenerateStep }
  ];

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentComponent = () => {
    const StepComponent = steps[currentStep - 1].component;
    return (
      <StepComponent
        templateFile={templateFile}
        setTemplateFile={setTemplateFile}
        examData={examData}
        setExamData={setExamData}
        nextStep={nextStep}
        prevStep={prevStep}
        currentStep={currentStep}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Smart Exam Paper Generator
        </h1>
        <p className="text-gray-600 text-lg">
          Create professional exam papers in minutes
        </p>
      </div>

      <ProgressTracker currentStep={currentStep} steps={steps} />
      
      <Card className="mt-8 p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <div className="animate-fade-in">
          {getCurrentComponent()}
        </div>
      </Card>
    </div>
  );
};

export default ExamGenerator;
