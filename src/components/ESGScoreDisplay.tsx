import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ESGScoreDisplayProps {
  overallScore: number;
  categoryScores: { category: string; score: number; weight: number }[];
  frameworkName: string;
}

export const ESGScoreDisplay: React.FC<ESGScoreDisplayProps> = ({
  overallScore,
  categoryScores,
  frameworkName
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-success" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-warning" />;
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  return (
    <Card className="shadow-medium">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          ESG Compliance Score
        </CardTitle>
        <p className="text-muted-foreground">{frameworkName}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            {getScoreIcon(overallScore)}
            <span className="text-4xl font-bold text-primary">
              {overallScore.toFixed(1)}
            </span>
            <span className="text-2xl text-muted-foreground">/ 100</span>
          </div>
          <Badge 
            variant={getScoreColor(overallScore) === 'success' ? 'default' : 'secondary'}
            className="px-4 py-1 text-sm font-medium"
          >
            {getScoreLabel(overallScore)}
          </Badge>
          <Progress 
            value={overallScore} 
            className="w-full h-3 bg-muted"
          />
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Category Breakdown
          </h3>
          {categoryScores.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  {category.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Weight: {(category.weight * 100).toFixed(0)}%
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {category.score.toFixed(1)}
                  </span>
                </div>
              </div>
              <Progress 
                value={category.score} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        {/* Compliance Status */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-success">
                {categoryScores.filter(c => c.score >= 80).length}
              </div>
              <div className="text-xs text-muted-foreground">Excellent</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-warning">
                {categoryScores.filter(c => c.score >= 60 && c.score < 80).length}
              </div>
              <div className="text-xs text-muted-foreground">Good</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-destructive">
                {categoryScores.filter(c => c.score < 60).length}
              </div>
              <div className="text-xs text-muted-foreground">Needs Work</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};