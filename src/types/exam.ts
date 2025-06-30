export interface Question {
  id: string;
  text: string;
  marks: number;
  type: QuestionType;
  options?: string[];
  correctAnswer?: number;
  image?: File;
}

export interface QuestionSection {
  id: string;
  title: string;
  type: QuestionType;
  questions: Question[];
}

export interface ExamData {
  grade: string;
  subject: string;
  examYear: string;
  examDate: string;
  totalMarks: number;
  duration: string;
  numberOfSections: number;
  sections: QuestionSection[];
}

export type QuestionType = 
  | 'MCQ'
  | 'Fill in the Blanks'
  | 'True/False'
  | 'Match the Following'
  | 'Short Answer'
  | 'Definitions'
  | 'Full Form'
  | 'Unscramble'
  | 'Diagram-based'
  | 'Odd One Out';

export interface StepProps {
  templateFile: File | null;
  setTemplateFile: (file: File | null) => void;
  examData: ExamData;
  setExamData: (data: ExamData) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}
