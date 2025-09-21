import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { ESGAssessmentForm } from '@/components/ESGAssessmentForm';
import { NSRFDocumentUpload } from '@/components/NSRFDocumentUpload';
import { CompanyService } from '@/services/companyService';
import { Company, AVAILABLE_FRAMEWORKS } from '@/types/database';
import type { Assessment } from '@/types/database';
import { ESGResponse } from '@/types/esg';
import { NewLambdaService } from '@/services/newLambdaService';
import { demoAuth, DemoUser, mockCompany } from '@/services/demoAuthService';
import { supabase } from '@/integrations/supabase/client';
// Force reload - removed mockProfile reference
import { toast } from 'sonner';
import { mockESGFrameworks } from '@/data/mockESGFrameworks';

interface AssessmentPageProps {
  onComplete: (data: { company: Company; assessment: Assessment; responses: ESGResponse[]; results?: any }) => void;
  onBack: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<'company-selection' | 'framework-selection' | 'esg' | 'nsrf-upload'>('company-selection');
  const [companies, setCompanies] = useState<Company[]>([mockCompany as Company]); // Start with mock company
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['esg-i']);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [nsrfResults, setNsrfResults] = useState<any>(null);

  useEffect(() => {
    // Ensure Supabase auth is initialized
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Sign in anonymously for demo purposes
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error('Auth error:', error);
        } else {
          console.log('Anonymous auth successful:', data.user?.id);
        }
      } else {
        console.log('User already authenticated:', user.id);
      }
    };
    
    const unsubscribe = demoAuth.onAuthStateChange((user) => {
      setCurrentUser(user);
      if (user) {
        initAuth().then(() => loadCompanies());
      } else {
        onBack();
      }
    });

    return unsubscribe;
  }, []);

  const loadCompanies = async () => {
    console.log('Loading companies...', { currentUser });
    
    // Always ensure we have at least the mock company available
    setCompanies([mockCompany as Company]);
    console.log('Set mock company as fallback');
    
    if (currentUser) {
      try {
        // Get current Supabase user
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Supabase user in loadCompanies:', user?.id);
        
        if (user) {
          // Try to get companies from database using Supabase user ID
          const companies = await CompanyService.getCompaniesByUser(user.id);
          console.log('Found companies from DB:', companies.length);
          
          if (companies.length > 0) {
            setCompanies(companies);
            console.log('Using database companies');
          } else {
            console.log('No companies found in DB, keeping mock company');
            // Keep the mock company that was already set
          }
        } else {
          console.log('No Supabase user, keeping mock company');
        }
      } catch (error) {
        console.error('Error loading companies:', error);
        console.log('Error occurred, keeping mock company');
      }
    } else {
      console.log('No current user, using mock company');
    }
  };

  const handleCompanySelect = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
    }
  };

  const handleFrameworkToggle = (frameworkId: string) => {
    setSelectedFrameworks(prev => {
      if (prev.includes(frameworkId)) {
        return prev.filter(id => id !== frameworkId);
      } else {
        return [...prev, frameworkId];
      }
    });
  };

  const handleStartAssessment = () => {
    if (selectedFrameworks.length === 0) {
      toast.error('Please select at least one framework');
      return;
    }
    
    // If NSRF is selected, go to document upload first
    if (selectedFrameworks.includes('nsrf')) {
      setStep('nsrf-upload');
    } else {
      setStep('esg');
    }
  };

  const handleESGComplete = async (responses: ESGResponse[]) => {
    if (!selectedCompany) return;

    try {
      console.log('Starting ESG completion with company:', selectedCompany);
      console.log('Selected frameworks:', selectedFrameworks);
      
      // Create a mock assessment object for Lambda submission
      const mockAssessment = {
        id: `assessment-${Date.now()}`,
        company_id: selectedCompany.id,
        frameworks: selectedFrameworks,
        responses: responses,
        status: 'completed' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Submit directly to Lambda and get results
      const lambdaResults = await NewLambdaService.submitESGAssessment(
        selectedCompany,
        mockAssessment,
        responses,
        selectedFrameworks
      );

      toast.success('Assessment completed successfully');
      onComplete({
        company: selectedCompany,
        assessment: mockAssessment,
        responses,
        results: { 
          ...lambdaResults, 
          nsrfAnalysis: nsrfResults?.nsrfAnalysis // Include NSRF results if available
        }
      });
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast.error('Failed to complete assessment: ' + (error as any)?.message);
    }
  };

  const handleNSRFAnalysisComplete = (results: any) => {
    setNsrfResults(results);
    // After NSRF analysis, continue to ESG assessment if other frameworks are selected
    if (selectedFrameworks.some(f => f !== 'nsrf')) {
      setStep('esg');
    } else {
      // If only NSRF was selected, complete the assessment
      handleESGComplete([]);
    }
  };

  const handleBack = () => {
    if (step === 'framework-selection') {
      setStep('company-selection');
    } else if (step === 'nsrf-upload') {
      setStep('framework-selection');
    } else if (step === 'esg') {
      // Go back to NSRF upload if it was selected, otherwise framework selection
      if (selectedFrameworks.includes('nsrf')) {
        setStep('nsrf-upload');
      } else {
        setStep('framework-selection');
      }
    } else {
      onBack();
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p>Please log in to start an assessment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'company-selection') {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Start ESG Assessment</h1>
          <p className="text-muted-foreground">Select a company to assess</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Company</CardTitle>
            <CardDescription>
              Choose which company you want to assess for ESG compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {companies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Loading companies...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company-select">Company</Label>
                  <Select value={selectedCompany?.id || ''} onValueChange={handleCompanySelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name} ({company.industry})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCompany && (
                  <div className="pt-4">
                    <Button onClick={() => setStep('framework-selection')}>
                      Continue to Framework Selection
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'framework-selection') {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="mb-6 space-y-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Company Selection
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Select ESG Frameworks</h1>
            <p className="text-muted-foreground">Choose which frameworks to evaluate</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available ESG Frameworks</CardTitle>
            <CardDescription>
              Select one or more frameworks for your ESG assessment. Each framework will generate separate reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCompany && (
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold">Assessment Details</h4>
                <p className="text-sm text-muted-foreground">
                  Company: {selectedCompany.name}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {AVAILABLE_FRAMEWORKS.map((framework) => (
                <div key={framework.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                   <Checkbox
                    id={framework.id}
                    checked={selectedFrameworks.includes(framework.id)}
                    onCheckedChange={() => handleFrameworkToggle(framework.id)}
                    disabled={framework.id !== 'esg-i' && framework.id !== 'nsrf'} // ESG-i and NSRF are implemented
                  />
                  <div className="flex-1">
                    <label htmlFor={framework.id} className={`cursor-pointer ${framework.id !== 'esg-i' && framework.id !== 'nsrf' ? 'opacity-60' : ''}`}>
                      <h4 className="font-semibold">{framework.name}</h4>
                      <p className="text-sm text-muted-foreground">{framework.description}</p>
                      {framework.id !== 'esg-i' && framework.id !== 'nsrf' && (
                        <p className="text-xs text-orange-600 mt-1">Coming soon</p>
                      )}
                      {framework.id === 'nsrf' && (
                        <p className="text-xs text-green-600 mt-1">Document analysis available</p>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {selectedFrameworks.length > 0 && (
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Selected {selectedFrameworks.length} framework(s). Each framework will be processed separately.
                </p>
                <Button onClick={handleStartAssessment}>
                  Start Assessment ({selectedFrameworks.length} framework{selectedFrameworks.length > 1 ? 's' : ''})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'nsrf-upload') {
    return (
      <NSRFDocumentUpload
        onAnalysisComplete={handleNSRFAnalysisComplete}
        onBack={handleBack}
      />
    );
  }

  // ESG Assessment step
  if (selectedCompany) {
    // Convert company to Business format for compatibility
    const business = {
      id: selectedCompany.id,
      name: selectedCompany.name,
      industry: selectedCompany.industry,
      size: selectedCompany.size,
      location: selectedCompany.location,
      employees: selectedCompany.employees,
      revenue: selectedCompany.revenue,
      establishedYear: selectedCompany.established_year,
      registrationNumber: selectedCompany.registration_number
    };

    return (
      <ESGAssessmentForm
        framework={mockESGFrameworks[0]} // Using main ESG framework
        business={business}
        onComplete={handleESGComplete}
        onBack={handleBack}
      />
    );
  }

  return null;
};