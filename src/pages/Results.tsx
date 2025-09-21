import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Award, 
  FileCheck,
  Building2,
  RefreshCw
} from 'lucide-react';
import { ESGScoreDisplay } from '@/components/ESGScoreDisplay';
import { ESGRecommendations } from '@/components/ESGRecommendations';
import { Company, Assessment } from '@/types/database';
import { ESGResponse } from '@/types/esg';

interface ResultsProps {
  company: Company;
  assessment: Assessment;
  responses: ESGResponse[];
  onBack: () => void;
  onRetake: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  company,
  assessment,
  responses,
  onBack,
  onRetake
}) => {
  // Mock data for demonstration
  const overallScore = 72;
  const complianceLevel = 'Progressing';
  
  const categoryScores = [
    { category: 'Environmental', score: 75, maxScore: 100 },
    { category: 'Social', score: 68, maxScore: 100 },
    { category: 'Governance', score: 73, maxScore: 100 }
  ];

  const recommendations = [
    {
      id: 'env-1',
      category: 'Environmental',
      title: 'Implement Energy Management System',
      description: 'Establish ISO 50001 certified energy management to reduce carbon footprint',
      priority: 'high' as const,
      impact: 'Potential 15-20% reduction in energy costs',
      timeframe: '3-6 months',
      funding: 'Green Technology Financing Scheme (GTFS) up to RM 100 million'
    },
    {
      id: 'soc-1',
      category: 'Social',
      title: 'Enhance Employee Well-being Programs',
      description: 'Develop comprehensive wellness initiatives and diversity programs',
      priority: 'medium' as const,
      impact: 'Improved employee retention and productivity',
      timeframe: '2-4 months',
      funding: 'HRD Corp training grants available'
    },
    {
      id: 'gov-1',
      category: 'Governance',
      title: 'Strengthen Supply Chain Monitoring',
      description: 'Implement supplier ESG assessment and monitoring systems',
      priority: 'high' as const,
      impact: 'Enhanced risk management and compliance',
      timeframe: '4-8 months',
      funding: 'SME Digitalization Grant up to RM 50,000'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">ESG Assessment Results</h1>
              <p className="text-sm text-muted-foreground">{company.name}</p>
            </div>
          </div>
          <Button onClick={onRetake} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retake Assessment
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Company Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {company.name}
                </CardTitle>
                <CardDescription>
                  {company.industry} • {company.size} • {company.employees} employees • {company.location}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                Assessment completed on {new Date(assessment.created_at).toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Overall Score */}
        <Card className="gradient-card">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Overall ESG Score</h3>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-foreground">{overallScore}</span>
                    <span className="text-lg text-muted-foreground">/ 100</span>
                  </div>
                  <Badge variant={overallScore >= 75 ? 'default' : overallScore >= 50 ? 'secondary' : 'destructive'}>
                    {complianceLevel}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={overallScore} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Needs Foundation (0-49)</span>
                    <span>Progressing (50-74)</span>
                    <span>Financing-Ready (75+)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Ready for ESG certification programs</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>Eligible for green financing opportunities</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileCheck className="h-4 w-4 text-secondary" />
                  <span>Compliant with basic regulatory requirements</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="grid md:grid-cols-3 gap-6">
          {categoryScores.map((category, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{Math.round(category.score)}</span>
                    <span className="text-sm text-muted-foreground">/ {category.maxScore}</span>
                  </div>
                  <Progress value={category.score} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>ESG Recommendations</CardTitle>
            <CardDescription>Priority actions to improve your ESG performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div><strong>Impact:</strong> {rec.impact}</div>
                  <div><strong>Timeframe:</strong> {rec.timeframe}</div>
                  <div className="md:col-span-2"><strong>Funding:</strong> {rec.funding}</div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Framework Details */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
            <CardDescription>
              Framework compliance and scoring methodology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><strong>Frameworks Assessed:</strong> {assessment.frameworks.join(', ')}</div>
              <div><strong>Questions Answered:</strong> {responses.length}</div>
              <div><strong>Assessment Date:</strong> {new Date(assessment.created_at).toLocaleDateString()}</div>
              <div><strong>Status:</strong> {assessment.status}</div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={onRetake}>
            <RefreshCw className="h-5 w-5 mr-2" />
            Retake Assessment
          </Button>
          <Button size="lg" variant="outline" onClick={onBack}>
            <BarChart3 className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};