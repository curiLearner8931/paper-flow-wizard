
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
}

interface ProgressTrackerProps {
  currentStep: number;
  steps: Step[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step.id < currentStep
                  ? 'bg-green-500 text-white'
                  : step.id === currentStep
                  ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.id < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                step.id <= currentStep ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-4 rounded transition-colors duration-300 ${
                step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
              style={{ minWidth: '60px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
