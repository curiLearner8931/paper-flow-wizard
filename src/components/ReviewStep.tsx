
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, FileText, Calendar, Clock, Award } from 'lucide-react';
import { StepProps } from '../types/exam';

const ReviewStep: React.FC<StepProps> = ({ 
  examData, 
  nextStep, 
  prevStep 
}) => {
  const totalQuestions = examData.sections.reduce((total, section) => total + section.questions.length, 0);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Review Your Exam Paper
        </h2>
        <p className="text-gray-600">
          Please review all details before generating the final exam paper
        </p>
      </div>

      {/* Exam Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Exam Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Grade</span>
              </div>
              <p className="font-semibold">{examData.grade}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Subject</span>
              </div>
              <p className="font-semibold">{examData.subject}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Date</span>
              </div>
              <p className="font-semibold">{examData.examDate}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Duration</span>
              </div>
              <p className="font-semibold">{examData.duration}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Questions:</span>
              <Badge variant="secondary">{totalQuestions}</Badge>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Total Marks:</span>
              <Badge className="bg-green-100 text-green-800">{examData.totalMarks}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Preview */}
      <div className="space-y-4">
        {examData.sections.map((section, sectionIndex) => (
          <Card key={section.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {section.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{section.type}</Badge>
                  <Badge variant="secondary">{section.questions.length} questions</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.questions.map((question, questionIndex) => (
                  <div key={question.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">
                        Q{questionIndex + 1}. {question.text || 'No question text provided'}
                      </h4>
                      <Badge variant="outline" className="ml-2">
                        {question.marks} mark{question.marks !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    {section.type === 'MCQ' && question.options && (
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2 text-sm">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              question.correctAnswer === optIndex 
                                ? 'bg-green-100 text-green-800 font-semibold' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className={question.correctAnswer === optIndex ? 'font-medium' : ''}>
                              {option || `Option ${optIndex + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          className="px-8 py-2 flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Questions</span>
        </Button>
        <Button
          onClick={nextStep}
          className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Generate Exam Paper
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
