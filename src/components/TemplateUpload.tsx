
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { StepProps } from '../types/exam';
import { useToast } from '@/hooks/use-toast';

const TemplateUpload: React.FC<StepProps> = ({ 
  templateFile, 
  setTemplateFile, 
  nextStep 
}) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.name.endsWith('.docx')) {
        setTemplateFile(file);
        toast({
          title: "Template uploaded successfully!",
          description: `File: ${file.name}`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .docx file only.",
          variant: "destructive",
        });
      }
    }
  }, [setTemplateFile, toast]);

  const removeFile = () => {
    setTemplateFile(null);
    toast({
      title: "Template removed",
      description: "You can upload a new template.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Upload Your Exam Template
        </h2>
        <p className="text-gray-600">
          Upload a Word document (.docx) that will serve as your exam template
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-300">
        {!templateFile ? (
          <>
            <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <label
              htmlFor="template-upload"
              className="cursor-pointer block"
            >
              <span className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Click to upload your template
              </span>
              <p className="text-gray-500 mt-2">
                Only .docx files are accepted
              </p>
            </label>
            <input
              id="template-upload"
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </>
        ) : (
          <div className="flex items-center justify-center space-x-4 p-4 bg-green-50 rounded-lg">
            <FileText className="h-12 w-12 text-green-600" />
            <div className="flex-1 text-left">
              <p className="font-medium text-green-800">{templateFile.name}</p>
              <p className="text-sm text-green-600">
                {(templateFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button
          onClick={nextStep}
          disabled={!templateFile}
          className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default TemplateUpload;
