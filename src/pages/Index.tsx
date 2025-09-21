import React, { useState } from 'react';
import { Dashboard } from '@/pages/Dashboard';
import { AssessmentPage } from '@/pages/Assessment';
import { AssessmentComplete } from '@/components/AssessmentComplete';
import { Results } from '@/pages/Results';
import { Business, ESGResponse } from '@/types/esg';
import { Profile, Company, Assessment as DBAssessment } from '@/types/database';

export const Index = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'assessment' | 'complete' | 'results'>('dashboard');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [assessment, setAssessment] = useState<DBAssessment | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<ESGResponse[]>([]);

  const handleStartAssessment = () => {
    setCurrentPage('assessment');
  };

  const handleAssessmentComplete = (data: { profile: Profile; company: Company; assessment: DBAssessment; responses: ESGResponse[] }) => {
    setProfile(data.profile);
    setCompany(data.company);
    setAssessment(data.assessment);
    setAssessmentResults(data.responses);
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
            registrationNumber: company.registration_number
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
      return profile && company && assessment ? (
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
            registrationNumber: company.registration_number
          }}
          responses={assessmentResults}
          onViewResults={handleViewResults}
          onBackToDashboard={handleBackToDashboard}
        />
      ) : null;
    case 'results':
      return profile && company && assessment ? (
        <Results
          profile={profile}
          company={company}
          assessment={assessment}
          responses={assessmentResults}
          onBack={handleBackToDashboard}
          onRetake={handleRetakeAssessment}
        />
      ) : null;
    default:
      return null;
  }
};

export default Index;