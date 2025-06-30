import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { StepProps, QuestionSection } from '../types/exam';

const ExamDetails: React.FC<StepProps> = ({ 
  examData, 
  setExamData, 
  nextStep, 
  prevStep 
}) => {
  const [date, setDate] = React.useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setExamData({
      ...examData,
      [field]: value
    });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      handleInputChange('examDate', format(selectedDate, 'yyyy-MM-dd'));
    }
  };

  const handleDateConfirm = () => {
    setIsCalendarOpen(false);
  };

  const handleSectionCountChange = (value: string) => {
    const newCount = parseInt(value);
    const currentSections = examData.sections;
    
    let updatedSections: QuestionSection[] = [];
    
    if (newCount > currentSections.length) {
      // Add new sections
      updatedSections = [...currentSections];
      for (let i = currentSections.length; i < newCount; i++) {
        updatedSections.push({
          id: `section-${i + 1}`,
          title: `Section ${i + 1}`,
          type: 'MCQ',
          questions: []
        });
      }
    } else {
      // Keep only the first 'newCount' sections
      updatedSections = currentSections.slice(0, newCount);
    }
    
    setExamData({
      ...examData,
      numberOfSections: newCount,
      sections: updatedSections
    });
  };

  const isFormValid = () => {
    return examData.grade && examData.subject && examData.examYear && 
           examData.examDate && examData.totalMarks > 0 && examData.duration;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Enter Exam Details
        </h2>
        <p className="text-gray-600">
          Provide basic information about your exam
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade/Class</Label>
          <Select onValueChange={(value) => handleInputChange('grade', value)}>
            <SelectTrigger className="bg-white border-gray-300 shadow-sm">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {[...Array(12)].map((_, i) => {
                const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][i];
                return (
                  <SelectItem key={roman} value={`Grade ${roman}`} className="hover:bg-gray-100">
                    Grade {roman}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="e.g., Mathematics, Science"
            value={examData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            className="bg-white border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="examYear">Academic Year</Label>
          <Select onValueChange={(value) => handleInputChange('examYear', value)}>
            <SelectTrigger className="bg-white border-gray-300 shadow-sm">
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {["2025-26", "2026-27"].map((year) => (
                <SelectItem key={year} value={year} className="hover:bg-gray-100">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Exam Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white border-gray-300 shadow-sm",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick exam date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
              <div className="p-3 border-t">
                <Button 
                  onClick={handleDateConfirm}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  OK
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalMarks">Total Marks</Label>
          <Input
            id="totalMarks"
            type="number"
            placeholder="e.g., 100"
            value={examData.totalMarks || ''}
            onChange={(e) => handleInputChange('totalMarks', parseInt(e.target.value) || 0)}
            className="bg-white border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g., 2 Hours"
            value={examData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="bg-white border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="numberOfSections">Number of Sections</Label>
          <Select 
            value={examData.numberOfSections.toString()} 
            onValueChange={handleSectionCountChange}
          >
            <SelectTrigger className="bg-white border-gray-300 shadow-sm max-w-xs">
              <SelectValue placeholder="Select number of sections" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {[...Array(15)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()} className="hover:bg-gray-100">
                  {i + 1} Section{i + 1 !== 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {examData.sections.map((section, index) => (
            <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">{section.title}</span>
            </div>
          ))}
        </div>
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
          disabled={!isFormValid()}
          className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ExamDetails;
