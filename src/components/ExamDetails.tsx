
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
import { StepProps } from '../types/exam';

const ExamDetails: React.FC<StepProps> = ({ 
  examData, 
  setExamData, 
  nextStep, 
  prevStep 
}) => {
  const [date, setDate] = React.useState<Date>();

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
      <SelectTrigger>
        <SelectValue placeholder="Select grade" />
      </SelectTrigger>
      <SelectContent>
        {[...Array(12)].map((_, i) => {
          const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][i];
          return (
            <SelectItem key={roman} value={`Grade ${roman}`}>
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
          />
        </div>

        <div className="space-y-2">
  <Label htmlFor="examYear">Academic Year</Label>
  <Select onValueChange={(value) => handleInputChange('examYear', value)}>
    <SelectTrigger>
      <SelectValue placeholder="Select academic year" />
    </SelectTrigger>
    <SelectContent>
      {["2025-26", "2026-27"].map((year) => (
        <SelectItem key={year} value={year}>
          {year}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

        <div className="space-y-2">
          <Label>Exam Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick exam date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g., 2 Hours"
            value={examData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="numberOfSections">Number of Sections</Label>
          <Select onValueChange={(value) => handleInputChange('numberOfSections', parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select number of sections" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Section{num > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
