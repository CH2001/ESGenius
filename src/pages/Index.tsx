import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { Assessment } from './Assessment';
import { AssessmentComplete } from '@/components/AssessmentComplete';
import { Results } from './Results';
import { Business, ESGResponse } from '@/types/esg';

const Index = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'assessment' | 'complete' | 'results'>('dashboard');
  const [business, setBusiness] = useState<Business | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<ESGResponse[]>([]);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  const handleStartAssessment = () => {
    setCurrentPage('assessment');
  };

  const handleAssessmentComplete = (businessData: Business, responses: ESGResponse[]) => {
    setBusiness(businessData);
    setAssessmentResults(responses);
    setHasCompletedAssessment(true);
    setCurrentPage('complete');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleViewResults = () => {
    if (hasCompletedAssessment) {
      setCurrentPage('results');
    }
  };

  const handleViewResultsFromComplete = () => {
    setCurrentPage('results');
  };

  const handleRetakeAssessment = () => {
    setCurrentPage('assessment');
  };

  switch (currentPage) {
    case 'assessment':
      return (
        <Assessment 
          onComplete={handleAssessmentComplete}
          onBack={handleBackToDashboard}
        />
      );
    case 'complete':
      return business && assessmentResults.length > 0 ? (
        <AssessmentComplete
          business={business}
          responses={assessmentResults}
          onViewResults={handleViewResultsFromComplete}
          onBackToDashboard={handleBackToDashboard}
        />
      ) : null;
    case 'results':
      return business && assessmentResults.length > 0 ? (
        <Results
          business={business}
          responses={assessmentResults}
          onBack={handleBackToDashboard}
          onRetakeAssessment={handleRetakeAssessment}
        />
      ) : null;
    default:
      return (
        <Dashboard
          onStartAssessment={handleStartAssessment}
          onViewResults={handleViewResults}
          hasCompletedAssessment={hasCompletedAssessment}
          business={business}
        />
      );
  }
};

export default Index;
