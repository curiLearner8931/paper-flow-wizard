
import ExamGenerator from '../components/ExamGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <ExamGenerator />
    </div>
  );
};

const nextStep = () => {
  if (!examDetails || !templateFile) {
    toast.error("Please fill in exam details and upload a template.");
    return;
  }
  setStep((prevStep) => prevStep + 1);
};

export default Index;
