import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Building2, 
  FileCheck,
  Target,
  ArrowRight,
  Shield,
  TrendingUp,
  Award,
  Gift,
  DollarSign,
  Users,
  Leaf
} from 'lucide-react';
import { ESGeniusLogo } from '@/components/ESGeniusLogo';
import { CompanyProfile } from '@/components/CompanyProfile';
import { OpportunitiesSection } from '@/components/OpportunitiesSection';
import { ProfilePane } from '@/components/ProfilePane';
import { Settings } from '@/components/Settings';
import { Business } from '@/types/esg';
import { FrameworkScore, OpportunityRecommendation } from '@/types/scoring';
import { mockOpportunities, calculateComplianceLevel, getComplianceLevelColor, getComplianceLevelLabel } from '@/data/mockScoringData';

interface DashboardProps {
  onStartAssessment: () => void;
  onViewResults?: () => void;
  hasCompletedAssessment?: boolean;
  business?: Business | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartAssessment,
  onViewResults,
  hasCompletedAssessment = false,
  business = null
}) => {
  // Mock framework scores for demonstration
  const mockFrameworkScores: FrameworkScore[] = [
    {
      frameworkId: 'nsrf',
      frameworkName: 'National Sustainability Reporting Framework (NSRF)',
      score: hasCompletedAssessment ? 72 : 0,
      complianceLevel: hasCompletedAssessment ? calculateComplianceLevel(72) : 'needs-foundation',
      status: hasCompletedAssessment ? 'completed' : 'not-started',
      lastAssessed: hasCompletedAssessment ? new Date() : undefined
    },
    {
      frameworkId: 'iesg',
      frameworkName: 'National Industry ESG (i-ESG) Framework',
      score: hasCompletedAssessment ? 68 : 0,
      complianceLevel: hasCompletedAssessment ? calculateComplianceLevel(68) : 'needs-foundation',
      status: hasCompletedAssessment ? 'completed' : 'not-started'
    },
    {
      frameworkId: 'sme-guide',
      frameworkName: 'SME Corp: ESG Quick Guide for MSMEs',
      score: hasCompletedAssessment ? 78 : 0,
      complianceLevel: hasCompletedAssessment ? calculateComplianceLevel(78) : 'needs-foundation',
      status: hasCompletedAssessment ? 'completed' : 'not-started'
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-8 w-8 text-success" />,
      title: 'Access Green Financing',
      description: 'Unlock up to RM 50 million in green technology funding and sustainable business loans'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'ESG Certification',
      description: 'Achieve recognized ESG certifications that enhance your market credibility'
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: 'Regulatory Compliance',
      description: 'Ensure compliance with Malaysian sustainability regulations and avoid penalties'
    },
    {
      icon: <Target className="h-8 w-8 text-accent" />,
      title: 'Market Opportunities',
      description: 'Access new markets and partnerships that prioritize sustainable businesses'
    },
    {
      icon: <Gift className="h-8 w-8 text-warning" />,
      title: 'Tax Deduction Opportunities',
      description: 'Double deduction for qualified ESG compliance and sustainability initiatives'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-success" />,
      title: 'Business Plan Opportunities',
      description: 'Connect with sustainable supply chains and ESG-focused business partnerships'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <ESGeniusLogo size="lg" />
          <Settings />
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            ESG Compliance Made Smart
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Navigate Malaysian sustainability regulations and unlock green financing opportunities 
            with our intelligent ESG assessment platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={onStartAssessment}
              className="bg-white text-primary hover:bg-white/90 shadow-strong"
            >
              {business ? 'Continue Assessment' : 'Begin Assessment'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            {hasCompletedAssessment && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={onViewResults}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Results
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Company Profile Section */}
        {business && (
          <section>
            <CompanyProfile 
              business={business} 
              frameworkScores={mockFrameworkScores}
              assessmentStatus={hasCompletedAssessment ? 'completed' : 'not-started'}
            />
          </section>
        )}

        {/* Profile Pane - Assessment History */}
        <section>
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold text-primary">Your ESG Journey</h2>
            <p className="text-lg text-muted-foreground">Track your progress and assessment history</p>
          </div>
          <ProfilePane 
            business={business}
            hasCompletedAssessment={hasCompletedAssessment}
            onViewResults={onViewResults}
          />
        </section>

        {/* Details about the application - only show when no assessment completed */}
        {!hasCompletedAssessment && (
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-primary">
                Why ESG Compliance Matters for Malaysian MSMEs
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The Malaysian government's iESG Framework opens doors to a US$12 trillion global ESG market. 
                Ensure your business is ready to capitalize on these opportunities.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow text-center">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-center">{benefit.icon}</div>
                    <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Framework Compliance Status */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-primary">
              Framework Compliance Status
            </h2>
            <p className="text-lg text-muted-foreground">
              Track your progress against official Malaysian sustainability frameworks
            </p>
          </div>

          <div className="grid gap-6">
            {mockFrameworkScores.map((framework, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl text-foreground">{framework.frameworkName}</CardTitle>
                      </div>
                      {framework.lastAssessed && (
                        <p className="text-sm text-muted-foreground">
                          Last assessed: {framework.lastAssessed.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        {framework.score.toFixed(1)}%
                      </div>
                      <Badge 
                        variant={getComplianceLevelColor(framework.complianceLevel) as any}
                        className="text-xs"
                      >
                        {getComplianceLevelLabel(framework.complianceLevel)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress 
                      value={framework.score} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Needs Foundation (0-49)</span>
                      <span>Progressing (50-74)</span>
                      <span>Financing-Ready (75+)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Opportunities Section */}
        <section>
          <OpportunitiesSection 
            opportunities={mockOpportunities}
            companyEligibilityScore={business ? 75 : 0}
          />
        </section>

        {/* Getting Started */}
        <section className="space-y-8">
          <Card className="gradient-card shadow-medium">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary">
                    {business ? 'Continue Your ESG Journey' : 'Ready to Get Started?'}
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI-powered assessment will evaluate your business against Malaysian ESG frameworks 
                    and provide personalized recommendations for improvement and funding opportunities.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      {business ? 'Update business profile' : 'Register your business information'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <FileCheck className="h-4 w-4 text-primary" />
                      Complete comprehensive ESG assessment
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Receive detailed scoring and recommendations
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Access grants and market opportunities
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    size="lg"
                    onClick={onStartAssessment}
                    className="w-full md:w-auto bg-primary hover:bg-primary-light shadow-medium"
                  >
                    {business ? 'Continue Assessment' : 'Begin Assessment Now'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};