import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Building2, 
  Leaf, 
  Users, 
  Shield, 
  Award,
  TrendingUp,
  FileCheck,
  Target,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  onStartAssessment: () => void;
  onViewResults?: () => void;
  hasCompletedAssessment?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartAssessment,
  onViewResults,
  hasCompletedAssessment = false
}) => {
  const esgFrameworks = [
    {
      id: 'nsrf',
      name: 'National Sustainability Reporting Framework (NSRF)',
      description: 'Malaysian framework for sustainability reporting aligned with global standards',
      categories: ['Environmental', 'Social', 'Governance'],
      status: hasCompletedAssessment ? 'completed' : 'pending'
    },
    {
      id: 'iesg',
      name: 'National Industry ESG (i-ESG) Framework',
      description: 'Industry-specific ESG framework for Malaysian businesses',
      categories: ['Operational Excellence', 'Innovation'],
      status: 'pending'
    },
    {
      id: 'sme-guide',
      name: 'SME Corp: ESG Quick Guide for MSMEs',
      description: 'Simplified ESG guidance specifically designed for Malaysian MSMEs',
      categories: ['Basic ESG', 'Compliance'],
      status: 'pending'
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
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <Leaf className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            AI-Powered ESG Compliance Assistant
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
              <FileCheck className="h-5 w-5 mr-2" />
              Start ESG Assessment
            </Button>
            {hasCompletedAssessment && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={onViewResults}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Results
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Key Benefits */}
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Assessment Frameworks */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-primary">
              Malaysian ESG Assessment Frameworks
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform evaluates your business against official Malaysian sustainability frameworks
            </p>
          </div>

          <div className="grid gap-6">
            {esgFrameworks.map((framework, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl text-foreground">{framework.name}</CardTitle>
                      </div>
                      <p className="text-muted-foreground">{framework.description}</p>
                    </div>
                    <Badge 
                      variant={framework.status === 'completed' ? 'default' : 'secondary'}
                      className="ml-4"
                    >
                      {framework.status === 'completed' ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Assessment Categories:</div>
                    <div className="flex flex-wrap gap-2">
                      {framework.categories.map((category, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className="space-y-8">
          <Card className="gradient-card shadow-medium">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary">Ready to Get Started?</h3>
                  <p className="text-muted-foreground">
                    Our AI-powered assessment will evaluate your business against Malaysian ESG frameworks 
                    and provide personalized recommendations for improvement and funding opportunities.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      Register your business information
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
                    Begin Assessment Now
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