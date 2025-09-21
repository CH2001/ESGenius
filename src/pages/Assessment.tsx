import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { ESGAssessmentForm } from '@/components/ESGAssessmentForm';
import { ProfileService } from '@/services/profileService';
import { Profile, Company, AVAILABLE_FRAMEWORKS } from '@/types/database';
import type { Assessment } from '@/types/database';
import { ESGResponse } from '@/types/esg';
import { NewLambdaService } from '@/services/newLambdaService';
import { demoAuth, DemoUser, mockProfile, mockCompany } from '@/services/demoAuthService';
import { toast } from 'sonner';
import { mockESGFrameworks } from '@/data/mockESGFrameworks';

interface NewAssessmentProps {
  onComplete: (data: { profile: Profile; company: Company; assessment: Assessment; responses: ESGResponse[] }) => void;
  onBack: () => void;
}

export const AssessmentPage: React.FC<NewAssessmentProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<'profile-selection' | 'framework-selection' | 'esg'>('profile-selection');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['esg-i']);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const unsubscribe = demoAuth.onAuthStateChange((user) => {
      setCurrentUser(user);
      if (user) {
        loadProfiles(user.id);
      }
    });

    return unsubscribe;
  }, []);

  const loadProfiles = async (userId: string) => {
    // Use demo data instead of trying to fetch from database
    setProfiles([mockProfile as Profile]);
    
    // Load companies for the profile
    const companiesData: Company[] = [mockCompany as Company];
    setCompanies(companiesData);
  };

  const loadCompanies = async (profileId: string) => {
    try {
      const companiesData = await ProfileService.getCompaniesByProfile(profileId);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    }
  };

  const handleProfileSelect = async (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
      await loadCompanies(profileId);
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
    setStep('esg');
  };

  const handleESGComplete = async (responses: ESGResponse[]) => {
    if (!selectedProfile || !selectedCompany) return;

    try {
      // Create assessment record
      const assessment = await ProfileService.createAssessment({
        profile_id: selectedProfile.id,
        company_id: selectedCompany.id,
        frameworks: selectedFrameworks,
        responses: responses,
        status: 'in_progress'
      });

      if (assessment) {
        // Submit for processing
        await NewLambdaService.submitESGAssessment(
          selectedProfile,
          selectedCompany,
          assessment,
          responses,
          selectedFrameworks
        );

        toast.success('Assessment completed successfully');
        onComplete({
          profile: selectedProfile,
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
      setStep('profile-selection');
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

  if (step === 'profile-selection') {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Start ESG Assessment</h1>
            <p className="text-muted-foreground">Select a business profile to assess</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Business Profile</CardTitle>
            <CardDescription>
              Choose which business profile you want to assess for ESG compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profiles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No profiles found. Please create a profile first.</p>
                <Button onClick={() => window.location.href = '/profile'}>
                  Go to Profile Management
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="profile-select">Organization Profile</Label>
                  <Select value={selectedProfile?.id || ''} onValueChange={handleProfileSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an organization profile" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {profiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.organization_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProfile && (
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
                )}

                {selectedProfile && selectedCompany && (
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
            Back to Profile Selection
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
            {selectedProfile && selectedCompany && (
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold">Assessment Details</h4>
                <p className="text-sm text-muted-foreground">
                  Organization: {selectedProfile.organization_name} <br />
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
  if (selectedProfile && selectedCompany) {
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