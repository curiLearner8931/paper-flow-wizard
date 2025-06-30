
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface MarksValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expectedMarks: number;
  actualMarks: number;
}

const MarksValidationDialog: React.FC<MarksValidationDialogProps> = ({
  isOpen,
  onClose,
  expectedMarks,
  actualMarks
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            <span>Marks Mismatch Detected</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 space-y-2">
            <p>
              The total marks for all questions doesn't match the total marks entered in exam details.
            </p>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p><strong>Expected Total Marks:</strong> {expectedMarks}</p>
              <p><strong>Current Questions Total:</strong> {actualMarks}</p>
              <p><strong>Difference:</strong> {Math.abs(expectedMarks - actualMarks)}</p>
            </div>
            <p className="text-sm">
              Please review and adjust the marks for your questions to match the total marks specified in exam details.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onClose}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            I'll Review the Marks
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MarksValidationDialog;
