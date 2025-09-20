import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Users } from 'lucide-react';

interface Competitor {
  name: string;
  industry: string;
  esgScore: number;
  strengths: string[];
  marketPosition: string;
}

interface CompetitorDetailsProps {
  competitors: Competitor[];
}

export const CompetitorDetails: React.FC<CompetitorDetailsProps> = ({ competitors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Industry Competitors Analysis</h3>
      <div className="grid gap-4">
        {competitors.map((competitor, index) => (
          <Card key={index} className="shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{competitor.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  ESG: {competitor.esgScore}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>{competitor.marketPosition}</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">Key Strengths:</p>
                <div className="flex flex-wrap gap-1">
                  {competitor.strengths.map((strength, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};