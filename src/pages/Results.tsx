import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ESGScoreDisplay } from '@/components/ESGScoreDisplay';
import { ESGRecommendations } from '@/components/ESGRecommendations';
import { ProfileService } from '@/services/profileService';
import { Business, ESGResponse, ESGRecommendation } from '@/types/esg';
import { Profile, Company, Assessment, AssessmentResult } from '@/types/database';
import { Calendar, Filter, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ResultsProps {
  profile: Profile;
  company: Company;
  assessment: Assessment;
  responses: ESGResponse[];
  onBack: () => void;
  onRetake: () => void;
}

export const Results: React.FC<ResultsProps> = ({ profile, company, assessment, responses, onBack, onRetake }) => {
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null);
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: '',
    end: format(new Date(), 'yyyy-MM-dd')
  });
  
  // Convert company to business format for compatibility
  const business: Business = {
    id: company.id,
    name: company.name,
    industry: company.industry,
    size: company.size,
    location: company.location,
    employees: company.employees,
    revenue: company.revenue,
    establishedYear: company.established_year,
    registrationNumber: company.registration_number
  };

  useEffect(() => {
    loadAssessmentResults();
  }, []);

  const loadAssessmentResults = async () => {
    try {
      const results = await ProfileService.getAssessmentResults(assessment.id);
      setAssessmentResults(results);
      
      // Set the latest result as selected by default
      if (results.length > 0) {
        setSelectedResult(results[0]);
      }
    } catch (error) {
      console.error('Error loading assessment results:', error);
      toast.error('Failed to load assessment results');
    }
  };

  const loadResultsByDateRange = async () => {
    try {
      const results = await ProfileService.getResultsByProfile(
        profile.id,
        dateFilter.start || undefined,
        dateFilter.end || undefined
      );
      setAssessmentResults(results);
    } catch (error) {
      console.error('Error loading filtered results:', error);
      toast.error('Failed to filter results');
    }
  };

  // Use the selected result's response if available
  const apiResponse = selectedResult?.lambda_response;

  // Calculate scores using existing logic
  const calculateScores = () => {
    if (apiResponse?.ok) {
      // Use iESG response structure
      return {
        overall: 75, // Mock overall score
        environmental: 80,
        social: 70,
        governance: 75
      };
    }

    // Fallback calculation
    const environmentalScore = responses.slice(0, 4).reduce((sum, r) => sum + r.score, 0) / 4;
    const socialScore = responses.slice(4, 7).reduce((sum, r) => sum + r.score, 0) / 3;
    const governanceScore = responses.slice(7, 10).reduce((sum, r) => sum + r.score, 0) / 3;
    
    return {
      overall: (environmentalScore + socialScore + governanceScore) / 3,
      environmental: environmentalScore,
      social: socialScore,
      governance: governanceScore
    };
  };

  const scores = calculateScores();

  const categoryScores = [
    { category: 'Environmental', score: scores.environmental, weight: 0.4 },
    { category: 'Social', score: scores.social, weight: 0.35 },
    { category: 'Governance', score: scores.governance, weight: 0.25 }
  ];

  // Generate recommendations
  const generateRecommendations = (): ESGRecommendation[] => {
    const recommendations: ESGRecommendation[] = [];
    
    // Environmental recommendations
    if (scores.environmental < 70) {
      recommendations.push({
        id: 'env-energy',
        type: 'improvement',
        title: 'Implement Energy Management System',
        description: 'Establish a comprehensive energy monitoring and reduction program',
        priority: 'high',
        estimatedImpact: 'Potential 15-25% reduction in energy costs',
        timeframe: '3-6 months',
        requiredActions: ['Conduct energy audit', 'Install monitoring systems'],
        relatedCriteria: ['energy-efficiency'],
        resources: []
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const mockFrameworkScores = [
    { framework: 'NSRF', score: scores.overall, compliance: 'Partial', lastAssessed: new Date() },
    { framework: 'iESG', score: scores.overall + 5, compliance: 'Good', lastAssessed: new Date() }
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">ESG Assessment Results</h1>
          <p className="text-muted-foreground">
            Results for {company.name} ({profile.organization_name})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRetake}>
            <RefreshCw className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Results Timeline and Filtering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Assessment Timeline
          </CardTitle>
          <CardDescription>
            View and filter assessment results by date range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadResultsByDateRange} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filter Results
              </Button>
            </div>
          </div>

          {assessmentResults.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="result-select">Select Assessment Result</Label>
              <Select 
                value={selectedResult?.id || ''} 
                onValueChange={(value) => {
                  const result = assessmentResults.find(r => r.id === value);
                  setSelectedResult(result || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a result to view" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {assessmentResults.map((result) => (
                    <SelectItem key={result.id} value={result.id}>
                      {result.framework} - {format(new Date(result.created_at), 'MMM dd, yyyy HH:mm')}
                      {result.success ? 
                        <Badge variant="secondary" className="ml-2">Success</Badge> : 
                        <Badge variant="destructive" className="ml-2">Failed</Badge>
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {assessmentResults.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No assessment results found for the selected date range.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Show detailed results only if a result is selected */}
      {selectedResult ? (
        <>
          {/* ESG Score Overview */}
          <ESGScoreDisplay 
            overallScore={scores.overall}
            categoryScores={categoryScores}
            frameworkName="ESG Assessment Framework"
          />

          {/* API Response Details */}
          {selectedResult.success && selectedResult.lambda_response?.ok && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedResult.framework === 'esg-i' ? 'i-ESG Framework Results' : 'Framework Results'}
                  <Badge variant="secondary">
                    {format(new Date(selectedResult.created_at), 'MMM dd, yyyy HH:mm')}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Assessment results from {selectedResult.framework} framework
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Executive Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedResult.lambda_response?.report?.executive_summary}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Readiness Stage</h4>
                    <Badge variant="secondary">
                      {selectedResult.lambda_response?.report?.header?.readiness_stage}
                    </Badge>
                  </div>
                </div>
                
                {selectedResult.lambda_response?.report?.baseline_checklist && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Baseline Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedResult.lambda_response.report.baseline_checklist).map(([category, items]) => (
                        <Card key={category}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{category}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {Array.isArray(items) && items.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{item.label}</span>
                                <Badge variant={item.status === 'Yes' ? 'secondary' : 'outline'}>
                                  {item.status}
                                </Badge>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedResult.lambda_response?.report?.gaps_and_risks && selectedResult.lambda_response.report.gaps_and_risks.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Identified Gaps and Risks</h4>
                    <div className="space-y-3">
                      {selectedResult.lambda_response.report.gaps_and_risks.map((gap: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{gap.gap}</h5>
                              <Badge variant={gap.urgency === 'High' ? 'destructive' : 'secondary'}>
                                {gap.urgency} Priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{gap.why_it_matters}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {!selectedResult.success && (
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Assessment Processing Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Error: {selectedResult.error_message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Timestamp: {format(new Date(selectedResult.created_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <ESGRecommendations 
            recommendations={recommendations}
            grantOpportunities={[]}
          />

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="flex-1 max-w-xs">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="flex-1 max-w-xs">
                  Share Results
                </Button>
                <Button variant="outline" className="flex-1 max-w-xs">
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Select an assessment result above to view detailed analysis.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};