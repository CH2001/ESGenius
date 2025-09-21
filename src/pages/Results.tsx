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
  results?: any; // Lambda results
  onBack: () => void;
  onRetake: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  company,
  assessment,
  responses,
  results,
  onBack,
  onRetake
}) => {
  // Extract data from Lambda results or use defaults
  const framework = results?.framework || 'ESG Assessment';
  const report = results?.report || {};
  const readinessStage = report.header?.readiness_stage || 'Unknown';
  const executiveSummary = report.executive_summary || '';
  
  // Calculate scores from baseline checklist
  const calculateCategoryScore = (categoryData: any) => {
    if (!categoryData) return 0;
    const items = Object.values(categoryData);
    const yesCount = items.filter((item: any) => item === 'Yes').length;
    return Math.round((yesCount / items.length) * 100);
  };

  const baseline = results?.baseline_checklist || {};
  const categoryScores = [
    { category: 'Environmental', score: calculateCategoryScore(baseline.Environmental), maxScore: 100 },
    { category: 'Social', score: calculateCategoryScore(baseline.Social), maxScore: 100 },
    { category: 'Governance', score: calculateCategoryScore(baseline.Governance), maxScore: 100 },
    { category: 'Operational Excellence', score: calculateCategoryScore(baseline['Operational Excellence']), maxScore: 100 }
  ];

  // Calculate overall score
  const overallScore = Math.round(categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length);
  const complianceLevel = overallScore >= 75 ? 'Financing-Ready' : overallScore >= 50 ? 'Progressing' : 'Needs Foundation';

  // Convert Lambda prioritized improvements to recommendations
  const recommendations = (report.prioritized_improvements || []).map((improvement: any, index: number) => ({
    id: `rec-${index}`,
    category: 'Action Item',
    title: improvement.action,
    description: `Owner: ${improvement.owner}`,
    priority: 'high' as const,
    impact: improvement.expected_benefit,
    timeframe: improvement.timeline,
    funding: improvement.evidence_required ? `Evidence required: ${improvement.evidence_required}` : 'N/A'
  }));

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

        {/* Framework and Score Overview */}
        <Card className="gradient-card">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Framework Info */}
              <div className="text-center space-y-2">
                <Badge variant="outline" className="text-sm px-4 py-1">
                  {framework}
                </Badge>
                <h3 className="text-2xl font-bold text-primary">ESG Assessment Results</h3>
                <p className="text-muted-foreground">Readiness Stage: <strong>{readinessStage}</strong></p>
              </div>
              
              {/* Overall Score */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-4 justify-center md:justify-start">
                      <span className="text-4xl font-bold text-foreground">{overallScore}</span>
                      <span className="text-lg text-muted-foreground">/ 100</span>
                    </div>
                    <div className="flex justify-center md:justify-start">
                      <Badge variant={overallScore >= 75 ? 'default' : overallScore >= 50 ? 'secondary' : 'destructive'}>
                        {complianceLevel}
                      </Badge>
                    </div>
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

              {/* Executive Summary */}
              {executiveSummary && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{executiveSummary}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Gaps Detected */}
        {results?.gaps_detected && results.gaps_detected.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Key Gaps Identified</CardTitle>
              <CardDescription>Areas requiring immediate attention based on your assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.gaps_detected.map((gap: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border-l-4 border-destructive">
                    <div className="mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                    </div>
                    <p className="text-sm text-foreground flex-1">{gap}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Actions and Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions & Next Steps</CardTitle>
            <CardDescription>Priority actions based on your assessment results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <Card key={rec.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge variant="destructive">
                      High Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <strong className="text-primary">Expected Benefit:</strong>
                      <p className="text-muted-foreground">{rec.impact}</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-primary">Timeline:</strong>
                      <p className="text-muted-foreground">{rec.timeframe}</p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <strong className="text-primary">Requirements:</strong>
                      <p className="text-muted-foreground">{rec.funding}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No specific recommendations available. Your ESG performance is on track!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assessment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
            <CardDescription>
              Framework compliance and scoring methodology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><strong>Framework Used:</strong> {framework}</div>
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