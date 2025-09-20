import React, { useState } from 'react';
import { BusinessRegistrationForm } from '@/components/BusinessRegistrationForm';
import { ESGAssessmentForm } from '@/components/ESGAssessmentForm';
import { Business, ESGResponse } from '@/types/esg';
import { mockESGFrameworks } from '@/data/mockESGFrameworks';

interface AssessmentProps {
  onComplete: (data: { business: Business; responses: ESGResponse[]; lambdaResponse?: any }) => void;
  onBack: () => void;
}

export const Assessment: React.FC<AssessmentProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<'business' | 'esg'>('business');
  const [business, setBusiness] = useState<Business | null>(null);

  const handleBusinessSubmit = (businessData: Business) => {
    setBusiness(businessData);
    setStep('esg');
  };

  const handleESGComplete = (responses: ESGResponse[], lambdaResponse?: any) => {
    if (business) {
      onComplete({ business, responses, lambdaResponse });
    }
  };

  const handleBackToBusiness = () => {
    setStep('business');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {step === 'business' ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-primary">ESG Compliance Assessment</h1>
              <p className="text-muted-foreground">
                Step 1 of 2: Register your business to begin the assessment
              </p>
            </div>
            <BusinessRegistrationForm onComplete={handleBusinessSubmit} onBack={onBack} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-primary">ESG Framework Assessment</h1>
              <p className="text-muted-foreground">
                Step 2 of 2: Complete the comprehensive ESG evaluation
              </p>
              {business && (
                <p className="text-sm text-muted-foreground">
                  Business: <span className="font-medium">{business.name}</span> • 
                  Industry: <span className="font-medium">{business.industry}</span>
                </p>
              )}
            </div>
            <ESGAssessmentForm
              framework={mockESGFrameworks[0]} // Using NSRF framework
              business={business!}
              onComplete={handleESGComplete}
              onBack={handleBackToBusiness}
            />
          </div>
        )}
      </div>
    </div>
  );
};