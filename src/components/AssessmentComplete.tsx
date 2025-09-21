import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Users, Target } from 'lucide-react';
import { Business, ESGResponse } from '@/types/esg';
import { CompetitorDetails } from './CompetitorDetails';
import { OpportunitiesSection } from './OpportunitiesSection';
import { mockOpportunities } from '@/data/mockScoringData';

interface AssessmentCompleteProps {
  business: Business;
  responses: ESGResponse[];
  lambdaResponse?: any;
  onViewResults: () => void;
  onBackToDashboard: () => void;
}

export const AssessmentComplete: React.FC<AssessmentCompleteProps> = ({
  business,
  responses,
  lambdaResponse,
  onViewResults,
  onBackToDashboard
}) => {
  // Mock competitor data
  const mockCompetitors = [
    {
      name: 'EcoTech Solutions',
      industry: business.industry,
      esgScore: 82,
      strengths: ['Renewable Energy', 'Waste Reduction', 'Employee Welfare'],
      marketPosition: 'Market Leader in Sustainable Tech'
    },
    {
      name: 'Green Manufacturing Co.',
      industry: business.industry,
      esgScore: 76,
      strengths: ['Carbon Neutral', 'Local Sourcing', 'Community Programs'],
      marketPosition: 'Regional Sustainability Champion'
    }
  ];

  // Use Lambda response if available, otherwise calculate from form responses
  const avgScore = (() => {
    if (lambdaResponse?.scoring?.overallScore && typeof lambdaResponse.scoring.overallScore === 'number') {
      return lambdaResponse.scoring.overallScore;
    }
    
    // Check for direct Lambda response format
    if (lambdaResponse && (lambdaResponse.NSRF || lambdaResponse.iESG)) {
      const nsrfScores = lambdaResponse.NSRF?.scores || {};
      const iesgScores = lambdaResponse.iESG?.scores || {};
      
      const environmentalScore = nsrfScores.Environmental || 0;
      const socialScore = nsrfScores.Social || 0;
      const governanceScore = nsrfScores.Governance || 0;
      const operationalScore = iesgScores['Operational Excellence'] || 0;
      
      return (environmentalScore + socialScore + governanceScore + operationalScore) / 4;
    }
    
    // Fallback to form responses
    return responses.reduce((sum, r) => sum + r.score, 0) / responses.length;
  })();

  // Use Lambda opportunities if available, otherwise use mock data
  const availableOpportunities = (lambdaResponse?.opportunities && Array.isArray(lambdaResponse.opportunities)) 
    ? lambdaResponse.opportunities 
    : mockOpportunities;

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Success Header */}
        <Card className="shadow-medium bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Assessment Successfully Completed!
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Your comprehensive ESG assessment has been processed. Here's what's next.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={onViewResults} className="bg-primary hover:bg-primary-light">
                <FileText className="h-5 w-5 mr-2" />
                View Detailed Results
              </Button>
              <Button size="lg" variant="outline" onClick={onBackToDashboard}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Score Overview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Initial Score Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-primary">{avgScore.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">Overall ESG Compliance</p>
                </div>
                <Badge 
                  variant={avgScore >= 75 ? "default" : avgScore >= 50 ? "secondary" : "destructive"}
                  className="text-sm px-3 py-1"
                >
                  {avgScore >= 75 ? "Financing-Ready" : avgScore >= 50 ? "Progressing" : "Needs Foundation"}
                </Badge>
              </div>

              {/* Lambda Framework Summary */}
              {lambdaResponse && (lambdaResponse.NSRF || lambdaResponse.iESG) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  {lambdaResponse.NSRF && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">NSRF Analysis</div>
                      <div className="text-sm text-muted-foreground">
                        E: {lambdaResponse.NSRF.scores?.Environmental || 0} | 
                        S: {lambdaResponse.NSRF.scores?.Social || 0} | 
                        G: {lambdaResponse.NSRF.scores?.Governance || 0}
                      </div>
                    </div>
                  )}
                  {lambdaResponse.iESG && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">iESG Analysis</div>
                      <div className="text-sm text-muted-foreground">
                        Operational: {lambdaResponse.iESG.scores?.['Operational Excellence'] || 0}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Competitor Analysis */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Users className="h-5 w-5" />
              Industry Competitor Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CompetitorDetails competitors={mockCompetitors} />
          </CardContent>
        </Card>

        {/* Available Opportunities */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Target className="h-5 w-5" />
              Available Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OpportunitiesSection 
              opportunities={availableOpportunities}
              companyEligibilityScore={avgScore}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};