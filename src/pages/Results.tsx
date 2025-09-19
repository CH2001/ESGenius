import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ESGScoreDisplay } from '@/components/ESGScoreDisplay';
import { ESGRecommendations } from '@/components/ESGRecommendations';
import { Business, ESGResponse, ESGRecommendation } from '@/types/esg';
import { mockGrantOpportunities } from '@/data/mockESGFrameworks';
import { Download, Share2, RefreshCw, ArrowLeft } from 'lucide-react';

interface ResultsProps {
  business: Business;
  responses: ESGResponse[];
  onBack: () => void;
  onRetakeAssessment: () => void;
}

export const Results: React.FC<ResultsProps> = ({ 
  business, 
  responses, 
  onBack, 
  onRetakeAssessment 
}) => {
  // Calculate mock scores based on responses
  const calculateScores = () => {
    const environmentalScore = responses.slice(0, 4).reduce((sum, r) => sum + r.score, 0) / 4;
    const socialScore = responses.slice(4, 7).reduce((sum, r) => sum + r.score, 0) / 3;
    const governanceScore = responses.slice(7, 10).reduce((sum, r) => sum + r.score, 0) / 3;
    
    const categoryScores = [
      { category: 'Environmental', score: environmentalScore, weight: 0.4 },
      { category: 'Social', score: socialScore, weight: 0.35 },
      { category: 'Governance', score: governanceScore, weight: 0.25 }
    ];
    
    const overallScore = categoryScores.reduce((sum, cat) => sum + (cat.score * cat.weight), 0);
    
    return { overallScore, categoryScores };
  };

  const { overallScore, categoryScores } = calculateScores();

  // Generate mock recommendations based on scores
  const generateRecommendations = (): ESGRecommendation[] => {
    const recommendations: ESGRecommendation[] = [];
    
    // Environmental recommendations
    if (categoryScores[0].score < 70) {
      recommendations.push({
        id: 'env-energy',
        type: 'improvement',
        title: 'Implement Energy Management System',
        description: 'Establish a comprehensive energy monitoring and reduction program to improve environmental performance',
        priority: 'high',
        estimatedImpact: 'Potential 15-25% reduction in energy costs and carbon emissions',
        timeframe: '3-6 months',
        requiredActions: [
          'Conduct comprehensive energy audit',
          'Install smart energy monitoring systems',
          'Implement energy-efficient equipment upgrades',
          'Train staff on energy conservation practices'
        ],
        relatedCriteria: ['energy-efficiency'],
        resources: [
          {
            title: 'Malaysia Energy Efficiency Guide',
            type: 'document',
            description: 'Official guidelines for energy management in Malaysian businesses'
          }
        ]
      });
    }

    // Social recommendations
    if (categoryScores[1].score < 70) {
      recommendations.push({
        id: 'social-diversity',
        type: 'improvement',
        title: 'Enhance Diversity & Inclusion Program',
        description: 'Develop comprehensive diversity policies and inclusive workplace practices',
        priority: 'medium',
        estimatedImpact: 'Improved employee satisfaction and regulatory compliance',
        timeframe: '2-4 months',
        requiredActions: [
          'Develop formal diversity and inclusion policy',
          'Implement inclusive hiring practices',
          'Provide diversity training for management',
          'Establish employee resource groups'
        ],
        relatedCriteria: ['diversity-inclusion'],
        resources: [
          {
            title: 'Malaysian Employment Act Guidelines',
            type: 'document',
            description: 'Legal requirements for fair employment practices'
          }
        ]
      });
    }

    // Add market opportunity recommendation
    if (overallScore >= 65) {
      recommendations.push({
        id: 'market-green-supply',
        type: 'market_opportunity',
        title: 'Green Supply Chain Certification',
        description: 'Leverage your ESG performance to access sustainable supply chain partnerships',
        priority: 'medium',
        estimatedImpact: 'Access to premium sustainable markets and partnerships',
        timeframe: '6-12 months',
        requiredActions: [
          'Apply for green business certification',
          'Document sustainability practices',
          'Join sustainable business networks'
        ],
        relatedCriteria: ['supply-chain'],
        resources: []
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">ESG Assessment Results</h1>
            <p className="text-muted-foreground">
              Comprehensive evaluation for <span className="font-medium">{business.name}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={onRetakeAssessment}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </div>

        {/* Business Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Business Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium text-foreground">Industry</div>
                <div className="text-muted-foreground">{business.industry}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Size</div>
                <div className="text-muted-foreground capitalize">{business.size}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Location</div>
                <div className="text-muted-foreground">{business.location}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Employees</div>
                <div className="text-muted-foreground">{business.employees}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ESG Score */}
        <ESGScoreDisplay
          overallScore={overallScore}
          categoryScores={categoryScores}
          frameworkName="National Sustainability Reporting Framework (NSRF)"
        />

        {/* Recommendations */}
        <ESGRecommendations
          recommendations={recommendations}
          grantOpportunities={mockGrantOpportunities}
        />

        {/* Action Buttons */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
              <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary-light">
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AWS Integration Note */}
        <Card className="shadow-soft border-primary/20">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-primary">Enhanced AI Analysis Available</h3>
              <p className="text-sm text-muted-foreground">
                This assessment uses mock data. In production, our AWS-powered AI models would provide 
                deeper analysis, personalized recommendations, and real-time market opportunity matching 
                using advanced machine learning and Malaysian regulatory databases.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};