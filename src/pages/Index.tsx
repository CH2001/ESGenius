import React, { useState } from 'react';
import { Dashboard } from '@/pages/Dashboard';
import { AssessmentPage } from '@/pages/Assessment';
import { AssessmentComplete } from '@/components/AssessmentComplete';
import { Results } from '@/pages/Results';
import { Business, ESGResponse } from '@/types/esg';
import { Company, Assessment } from '@/types/database';

export const Index = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'assessment' | 'complete' | 'results'>('dashboard');
  const [company, setCompany] = useState<Company | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<ESGResponse[]>([]);
  const [lambdaResults, setLambdaResults] = useState<any>(null);

  const handleStartAssessment = () => {
    setCurrentPage('assessment');
  };

  const handleAssessmentComplete = (data: { company: Company; assessment: Assessment; responses: ESGResponse[]; results?: any }) => {
    setCompany(data.company);
    setAssessment(data.assessment);
    setAssessmentResults(data.responses);
    setLambdaResults(data.results);
    setCurrentPage('complete');
  };

  const handleViewResults = () => {
    setCurrentPage('results');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleRetakeAssessment = () => {
    setCurrentPage('assessment');
  };

  switch (currentPage) {
    case 'dashboard':
      return (
        <Dashboard 
          onStartAssessment={handleStartAssessment}
          onViewResults={handleViewResults}
          business={company ? {
            id: company.id,
            name: company.name,
            industry: company.industry,
            size: company.size,
            location: company.location,
            employees: company.employees,
            revenue: company.revenue,
            establishedYear: company.established_year,
            registrationNumber: company.registration_number || ''
          } : null}
          hasCompletedAssessment={!!company}
        />
      );
    case 'assessment':
      return (
        <AssessmentPage 
          onComplete={handleAssessmentComplete}
          onBack={handleBackToDashboard}
        />
      );
    case 'complete':
      return company && assessment ? (
        <AssessmentComplete
          business={{
            id: company.id,
            name: company.name,
            industry: company.industry,
            size: company.size,
            location: company.location,
            employees: company.employees,
            revenue: company.revenue,
            establishedYear: company.established_year,
            registrationNumber: company.registration_number || ''
          }}
          responses={assessmentResults}
          onViewResults={handleViewResults}
          onBackToDashboard={handleBackToDashboard}
        />
      ) : null;
    case 'results':
      return company && assessment ? (
        <Results
          company={company}
          assessment={assessment}
          responses={assessmentResults}
          results={lambdaResults}
          onBack={handleBackToDashboard}
          onRetake={handleRetakeAssessment}
        />
      ) : null;
    default:
      return null;
  }
};

export default Index;