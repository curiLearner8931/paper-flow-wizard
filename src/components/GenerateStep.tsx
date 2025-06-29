
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, File, CheckCircle, AlertCircle } from 'lucide-react';
import { StepProps } from '../types/exam';
import { useToast } from '@/hooks/use-toast';

const GenerateStep: React.FC<StepProps> = ({ 
  templateFile, 
  examData, 
  prevStep 
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState<{
    docx?: string;
    pdf?: string;
  }>({});

  const generateExamPaper = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressSteps = [
        { step: 20, message: "Processing template..." },
        { step: 40, message: "Formatting questions..." },
        { step: 60, message: "Generating Word document..." },
        { step: 80, message: "Creating PDF version..." },
        { step: 100, message: "Finalizing documents..." }
      ];

      for (const { step, message } of progressSteps) {
        setProgress(step);
        toast({
          title: "Generating...",
          description: message,
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Prepare data for API call
      const formData = new FormData();
      if (templateFile) {
        formData.append('template', templateFile);
      }
      formData.append('examData', JSON.stringify(examData));

      // In a real implementation, this would call your backend API
      // For now, we'll simulate successful generation
      console.log('Exam data to be sent to backend:', examData);
      console.log('Template file:', templateFile?.name);

      // Simulate file generation (in real app, these would be actual file URLs from backend)
      setDownloadLinks({
        docx: '#', // Backend would return actual file URLs
        pdf: '#'
      });

      setGenerationComplete(true);
      toast({
        title: "Success!",
        description: "Your exam papers have been generated successfully.",
      });

    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your exam papers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = (type: 'docx' | 'pdf') => {
    // In a real implementation, this would trigger actual file download
    toast({
      title: `${type.toUpperCase()} Downloaded`,
      description: `Your exam paper ${type.toUpperCase()} file has been downloaded.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Generate Your Exam Paper
        </h2>
        <p className="text-gray-600">
          Create professional Word and PDF versions of your exam
        </p>
      </div>

      {!generationComplete ? (
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            {!isGenerating ? (
              <>
                <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                  <p className="text-gray-600 mb-6">
                    Your exam paper will be generated using your template and questions.
                    This process may take a few moments.
                  </p>
                  <Button
                    onClick={generateExamPaper}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    Generate Exam Papers
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Generating Your Exam Papers</h3>
                  <Progress value={progress} className="w-full max-w-md mx-auto" />
                  <p className="text-gray-600">
                    Please wait while we process your exam paper...
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-6 w-6" />
              <span>Exam Papers Generated Successfully!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-700">
              Your exam papers have been generated and are ready for download.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors duration-200">
                <CardContent className="p-6 text-center">
                  <File className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                  <h4 className="font-semibold mb-2">Word Document</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Editable .docx format for further customization
                  </p>
                  <Button
                    onClick={() => downloadFile('docx')}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download DOCX
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-dashed border-red-300 hover:border-red-500 transition-colors duration-200">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 mx-auto text-red-600 mb-4" />
                  <h4 className="font-semibold mb-2">PDF Document</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Print-ready format for distribution
                  </p>
                  <Button
                    onClick={() => downloadFile('pdf')}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> In a production environment, these buttons would download actual generated files from your backend server.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isGenerating}
          className="px-8 py-2"
        >
          Back to Review
        </Button>
        {generationComplete && (
          <Button
            onClick={() => window.location.reload()}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create New Exam
          </Button>
        )}
      </div>
    </div>
  );
};

export default GenerateStep;
