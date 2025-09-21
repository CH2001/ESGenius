import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { ESGAssessmentForm } from '@/components/ESGAssessmentForm';
import { CompanyService } from '@/services/companyService';
import { Company, AVAILABLE_FRAMEWORKS } from '@/types/database';
import type { Assessment } from '@/types/database';
import { ESGResponse } from '@/types/esg';
import { NewLambdaService } from '@/services/newLambdaService';
import { demoAuth, DemoUser, mockCompany } from '@/services/demoAuthService';
import { toast } from 'sonner';
import { mockESGFrameworks } from '@/data/mockESGFrameworks';

interface AssessmentPageProps {
  onComplete: (data: { company: Company; assessment: Assessment; responses: ESGResponse[] }) => void;
  onBack: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<'company-selection' | 'framework-selection' | 'esg'>('company-selection');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['esg-i']);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const unsubscribe = demoAuth.onAuthStateChange((user) => {
      setCurrentUser(user);
      if (user) {
        loadCompanies();
      } else {
        onBack();
      }
    });

    return unsubscribe;
  }, []);

  const loadCompanies = () => {
    // Use demo data instead of trying to fetch from database
    setCompanies([mockCompany as Company]);
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
    setStep('esg');
  };

  const handleESGComplete = async (responses: ESGResponse[]) => {
    if (!selectedCompany) return;

    try {
      // Create assessment record
      const assessment = await CompanyService.createAssessment({
        company_id: selectedCompany.id,
        frameworks: selectedFrameworks,
        responses: responses,
        status: 'in_progress'
      });

      if (assessment) {
        await NewLambdaService.submitESGAssessment(
          selectedCompany,
          assessment,
          responses,
          selectedFrameworks
        );

        toast.success('Assessment completed successfully');
        onComplete({
          company: selectedCompany,
          assessment,
          responses
        });
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast.error('Failed to complete assessment');
    }
  };

  const handleBack = () => {
    if (step === 'framework-selection') {
      setStep('company-selection');
    } else if (step === 'esg') {
      setStep('framework-selection');
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
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Start ESG Assessment</h1>
            <p className="text-muted-foreground">Select a company to assess</p>
          </div>
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
                <p className="text-muted-foreground mb-4">No companies found. Please create a company first.</p>
                <Button onClick={() => window.location.href = '/profile'}>
                  Go to Company Profile
                </Button>
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
        <div className="flex items-center gap-4 mb-6">
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
                    disabled={framework.id !== 'esg-i'} // Only ESG-i is implemented
                  />
                  <div className="flex-1">
                    <label htmlFor={framework.id} className={`cursor-pointer ${framework.id !== 'esg-i' ? 'opacity-60' : ''}`}>
                      <h4 className="font-semibold">{framework.name}</h4>
                      <p className="text-sm text-muted-foreground">{framework.description}</p>
                      {framework.id !== 'esg-i' && (
                        <p className="text-xs text-orange-600 mt-1">Coming soon</p>
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