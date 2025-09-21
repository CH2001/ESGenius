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
  const readinessStage = report.header?.readiness_stage || results?.header?.readiness_stage || 'Unknown';
  const executiveSummary = report.executive_summary || results?.executive_summary || '';
  
  // Calculate scores from baseline checklist - sync with Framework Compliance Status
  const calculateCategoryScore = (categoryData: any) => {
    if (!categoryData) return 0;
    const items = Object.values(categoryData);
    const yesCount = items.filter((item: any) => item === 'Yes').length;
    const totalItems = items.length;
    const unknownCount = items.filter((item: any) => item === 'Unknown').length;
    // For scoring, treat Unknown as partial (0.5) to be more realistic
    const partialScore = (yesCount + (unknownCount * 0.3)) / totalItems;
    return Math.round(partialScore * 100);
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
              {executiveSummary && executiveSummary !== "(LLM JSON parse failed; baseline-only summary returned.)" && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{executiveSummary}</p>
                </div>
              )}

              {/* Gaps and Risks */}
              {(results?.report?.gaps_and_risks || results?.gaps_and_risks) && (results?.report?.gaps_and_risks || results?.gaps_and_risks).length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Key Gaps & Risks Identified</h4>
                  <div className="grid gap-3">
                    {(results?.report?.gaps_and_risks || results?.gaps_and_risks).map((risk: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-sm">{risk.gap}</h5>
                          <Badge 
                            variant={
                              risk.urgency === 'High' ? 'destructive' :
                              risk.urgency === 'Medium' ? 'secondary' :
                              'outline'
                            }
                            className="text-xs"
                          >
                            {risk.urgency} Priority
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{risk.why_it_matters}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Framework Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle>Framework Compliance Status</CardTitle>
            <CardDescription>Track your progress against official Malaysian sustainability frameworks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* NSRF Framework */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-semibold">National Sustainability Reporting Framework (NSRF)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last assessed: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    {framework === 'NSRF Framework' ? (
                      <>
                        <div className="text-2xl font-bold text-primary">
                          {overallScore.toFixed(1)}%
                        </div>
                        <Badge 
                          variant={
                            overallScore >= 75 ? 'default' : 
                            overallScore >= 50 ? 'secondary' : 
                            'outline'
                          }
                          className={
                            overallScore >= 75 ? 'bg-green-500/10 text-green-700 border-green-200' :
                            overallScore >= 50 ? 'bg-yellow-500/10 text-yellow-700 border-yellow-200' :
                            'bg-red-500/10 text-red-700 border-red-200'
                          }
                        >
                          {overallScore >= 75 ? 'Financing-Ready (75+)' : 
                           overallScore >= 50 ? 'Progressing (50-74)' : 
                           'Needs Foundation (0-49)'}
                        </Badge>
                      </>
                    ) : (
                      <>
                        <div className="text-lg text-muted-foreground">
                          Pending Review
                        </div>
                        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-200">
                          Not Assessed
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Progress 
                    value={framework === 'NSRF Framework' ? overallScore : 0} 
                    className={`h-3 ${framework !== 'NSRF Framework' ? 'opacity-50' : ''}`}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Needs Foundation (0-49)</span>
                    <span>Progressing (50-74)</span>
                    <span>Financing-Ready (75+)</span>
                  </div>
                </div>
              </div>

              {/* i-ESG Framework */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-semibold">National Industry ESG (i-ESG) Framework</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last assessed: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    {framework === 'i-ESG (qualitative)' || framework === 'i-ESG Framework' ? (
                      <>
                        <div className="text-2xl font-bold text-primary">
                          {overallScore.toFixed(1)}%
                        </div>
                        <Badge 
                          variant={
                            overallScore >= 75 ? 'default' : 
                            overallScore >= 50 ? 'secondary' : 
                            'outline'
                          }
                          className={
                            overallScore >= 75 ? 'bg-green-500/10 text-green-700 border-green-200' :
                            overallScore >= 50 ? 'bg-yellow-500/10 text-yellow-700 border-yellow-200' :
                            'bg-red-500/10 text-red-700 border-red-200'
                          }
                        >
                          {overallScore >= 75 ? 'Financing-Ready (75+)' : 
                           overallScore >= 50 ? 'Progressing (50-74)' : 
                           'Needs Foundation (0-49)'}
                        </Badge>
                      </>
                    ) : (
                      <>
                        <div className="text-lg text-muted-foreground">
                          Pending Review
                        </div>
                        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-200">
                          Not Assessed
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Progress 
                    value={framework === 'i-ESG (qualitative)' || framework === 'i-ESG Framework' ? overallScore : 0} 
                    className={`h-3 ${framework !== 'i-ESG (qualitative)' && framework !== 'i-ESG Framework' ? 'opacity-50' : ''}`}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Needs Foundation (0-49)</span>
                    <span>Progressing (50-74)</span>
                    <span>Financing-Ready (75+)</span>
                  </div>
                </div>
              </div>
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

        {/* Baseline Checklist - Detailed breakdown of checklist items */}
        {results?.baseline_checklist && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Compliance Checklist</CardTitle>
              <CardDescription>Individual checklist items based on {framework} assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(results.baseline_checklist).map(([category, items]: [string, any]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-semibold text-lg text-primary">{category}</h4>
                    <div className="space-y-2">
                      {Object.entries(items).map(([item, status]: [string, any]) => (
                        <div key={item} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                          <span className="text-sm font-medium">{item}</span>
                          <Badge 
                            variant={
                              status === 'Yes' ? 'default' : 
                              status === 'No' ? 'destructive' : 
                              'secondary'
                            }
                            className={
                              status === 'Yes' ? 'bg-green-500/10 text-green-700 border-green-200' :
                              status === 'No' ? 'bg-red-500/10 text-red-700 border-red-200' :
                              'bg-yellow-500/10 text-yellow-700 border-yellow-200'
                            }
                          >
                            {status}
                          </Badge>
                        </div>
                      ))}
                    </div>
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