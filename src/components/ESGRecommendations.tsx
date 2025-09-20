import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  DollarSign, 
  TrendingUp, 
  Award,
  ExternalLink,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react';
import { ESGRecommendation, GrantOpportunity } from '@/types/esg';

interface ESGRecommendationsProps {
  recommendations: ESGRecommendation[];
  grantOpportunities: GrantOpportunity[];
}

export const ESGRecommendations: React.FC<ESGRecommendationsProps> = ({
  recommendations,
  grantOpportunities
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <Lightbulb className="h-5 w-5 text-primary" />;
      case 'grant':
        return <DollarSign className="h-5 w-5 text-success" />;
      case 'market_opportunity':
        return <TrendingUp className="h-5 w-5 text-secondary" />;
      case 'certification':
        return <Award className="h-5 w-5 text-accent" />;
      default:
        return <Lightbulb className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Improvement Recommendations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">ESG Improvement Recommendations</h2>
        <div className="grid gap-4">
          {recommendations
            .filter(rec => rec.type === 'improvement')
            .sort((a, b) => {
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              return priorityOrder[b.priority as keyof typeof priorityOrder] - 
                     priorityOrder[a.priority as keyof typeof priorityOrder];
            })
            .map((rec, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getTypeIcon(rec.type)}
                    <div>
                      <CardTitle className="text-lg text-foreground">{rec.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge 
                      variant={getPriorityColor(rec.priority) as any}
                      className="flex items-center gap-1"
                    >
                      {getPriorityIcon(rec.priority)}
                      {rec?.priority ? rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1) : 'Medium'} Priority
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.timeframe}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-sm font-medium text-foreground mb-1">Expected Impact</div>
                  <div className="text-sm text-muted-foreground">{rec.estimatedImpact}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">Required Actions:</div>
                  <ul className="space-y-1">
                    {rec.requiredActions.map((action, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {rec.resources.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Helpful Resources:</div>
                    <div className="flex flex-wrap gap-2">
                      {rec.resources.map((resource, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {resource.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Grant Opportunities */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Available Grant Opportunities
        </h2>
        <div className="grid gap-4">
          {grantOpportunities.map((grant, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-success">{grant.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{grant.provider}</p>
                  </div>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    {grant.amount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{grant.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Eligibility Requirements:</div>
                    <ul className="space-y-1">
                      {grant.eligibilityRequirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">ESG Requirements:</div>
                    <ul className="space-y-1">
                      {grant.esgRequirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-success mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Deadline: {grant.applicationDeadline.toLocaleDateString('en-MY')}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Market Opportunities */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Market Opportunities
        </h2>
        <div className="grid gap-4">
          {recommendations
            .filter(rec => rec.type === 'market_opportunity')
            .map((rec, index) => (
            <Card key={index} className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg text-secondary flex items-center gap-2">
                  {getTypeIcon(rec.type)}
                  {rec.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                <div className="text-sm">
                  <span className="font-medium text-foreground">Expected Impact: </span>
                  <span className="text-muted-foreground">{rec.estimatedImpact}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};