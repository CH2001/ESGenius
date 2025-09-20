import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Gift, 
  TrendingUp, 
  DollarSign, 
  ExternalLink,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { OpportunityRecommendation } from '@/types/scoring';

interface OpportunitiesSectionProps {
  opportunities: OpportunityRecommendation[];
  companyEligibilityScore?: number;
}

export const OpportunitiesSection: React.FC<OpportunitiesSectionProps> = ({
  opportunities,
  companyEligibilityScore = 0
}) => {
  const getTypeIcon = (type: OpportunityRecommendation['type']) => {
    switch (type) {
      case 'grant': return <Gift className="h-5 w-5" />;
      case 'tax-deduction': return <DollarSign className="h-5 w-5" />;
      case 'business-opportunity': return <TrendingUp className="h-5 w-5" />;
      case 'financing': return <Award className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: OpportunityRecommendation['type']) => {
    switch (type) {
      case 'grant': return 'success';
      case 'tax-deduction': return 'secondary';
      case 'business-opportunity': return 'primary';
      case 'financing': return 'accent';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
    }
  };

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">Available Opportunities</h2>
        <p className="text-muted-foreground">
          Grants, tax incentives, and business opportunities matched to your profile
        </p>
      </div>

      <div className="grid gap-6">
        {sortedOpportunities.slice(0, 6).map((opportunity) => (
          <Card key={opportunity.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg bg-${getTypeColor(opportunity.type)}/10`}>
                    {getTypeIcon(opportunity.type)}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg text-foreground">{opportunity.title}</CardTitle>
                      <Badge 
                        variant={getTypeColor(opportunity.type) as any}
                        className="text-xs"
                      >
                        {opportunity?.type ? opportunity.type.replace('-', ' ').toUpperCase() : 'OPPORTUNITY'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    <p className="text-xs text-muted-foreground">Provider: {opportunity.provider}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge 
                    variant={getPriorityColor(opportunity.priority) as any}
                    className="text-xs"
                  >
                    {opportunity?.priority ? opportunity.priority.toUpperCase() : 'MEDIUM'} PRIORITY
                  </Badge>
                  <div className="text-sm font-bold text-primary">{opportunity.potentialValue}</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Eligibility Match */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Eligibility Match:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">
                    {opportunity.eligibilityScore}%
                  </span>
                  <Badge 
                    variant={opportunity.eligibilityScore >= 80 ? 'default' : 
                            opportunity.eligibilityScore >= 60 ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {opportunity.eligibilityScore >= 80 ? 'High Match' : 
                     opportunity.eligibilityScore >= 60 ? 'Good Match' : 'Moderate Match'}
                  </Badge>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Key Requirements:</p>
                <div className="space-y-1">
                  {opportunity.requirements.slice(0, 3).map((req, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                  {opportunity.requirements.length > 3 && (
                    <p className="text-xs text-primary pl-3">
                      +{opportunity.requirements.length - 3} more requirements
                    </p>
                  )}
                </div>
              </div>

              {/* Deadline */}
              {opportunity.deadline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {opportunity.deadline.toLocaleDateString()}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                {opportunity.applicationUrl ? (
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(opportunity.applicationUrl, '_blank')}
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full">
                    Contact Provider
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {opportunities.length > 6 && (
        <div className="text-center">
          <Button variant="outline">
            View All Opportunities ({opportunities.length})
          </Button>
        </div>
      )}
    </div>
  );
};