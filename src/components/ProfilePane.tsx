import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileCheck, TrendingUp, Download, Eye } from 'lucide-react';
import { Business } from '@/types/esg';

interface ProfilePaneProps {
  business: Business | null;
  hasCompletedAssessment: boolean;
  onViewResults?: () => void;
}

interface AssessmentHistory {
  id: string;
  date: Date;
  framework: string;
  score: number;
  status: 'completed' | 'in-progress' | 'draft';
  complianceLevel: string;
}

export const ProfilePane: React.FC<ProfilePaneProps> = ({
  business,
  hasCompletedAssessment,
  onViewResults
}) => {
  // Mock assessment history
  const assessmentHistory: AssessmentHistory[] = [
    {
      id: '1',
      date: new Date('2024-03-15'),
      framework: 'NSRF',
      score: 72,
      status: 'completed',
      complianceLevel: 'Progressing'
    },
    {
      id: '2',
      date: new Date('2024-02-28'),
      framework: 'i-ESG Framework',
      score: 68,
      status: 'completed',
      complianceLevel: 'Progressing'
    },
    {
      id: '3',
      date: new Date('2024-01-20'),
      framework: 'SME Corp Guide',
      score: 45,
      status: 'completed',
      complianceLevel: 'Needs Foundation'
    }
  ];

  if (!business) {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="text-muted-foreground">
              Complete your business registration to view your profile and assessment history.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Profile Summary */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Company Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Company Name</div>
              <div className="font-medium">{business.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Industry</div>
              <div className="font-medium">{business.industry}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Size</div>
              <div className="font-medium capitalize">{business.size}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Employees</div>
              <div className="font-medium">{business.employees}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment History Timeline */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Assessment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasCompletedAssessment ? (
            <div className="space-y-4">
              {assessmentHistory.map((assessment, index) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      {index < assessmentHistory.length - 1 && (
                        <div className="w-0.5 h-8 bg-border mt-2"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{assessment.framework}</div>
                      <div className="text-sm text-muted-foreground">
                        {assessment.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {assessment.score}%
                      </div>
                      <Badge 
                        variant={assessment.score >= 75 ? "default" : assessment.score >= 50 ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {assessment.complianceLevel}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={onViewResults}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <div>No assessments completed yet</div>
              <div className="text-sm">Complete your first ESG assessment to see your history here</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {hasCompletedAssessment && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">72</div>
                <div className="text-xs text-muted-foreground">Latest Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">+15</div>
                <div className="text-xs text-muted-foreground">Improvement</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">3</div>
                <div className="text-xs text-muted-foreground">Assessments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};