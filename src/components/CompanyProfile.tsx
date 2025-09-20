import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Building2, 
  Users, 
  MapPin, 
  Calendar,
  TrendingUp,
  FileCheck,
  Clock
} from 'lucide-react';
import { Business } from '@/types/esg';
import { FrameworkScore } from '@/types/scoring';

interface CompanyProfileProps {
  business: Business;
  frameworkScores?: FrameworkScore[];
  assessmentStatus?: 'completed' | 'in-progress' | 'not-started';
}

export const CompanyProfile: React.FC<CompanyProfileProps> = ({
  business,
  frameworkScores = [],
  assessmentStatus = 'not-started'
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <FileCheck className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {business?.name ? business.name.substring(0, 2).toUpperCase() : 'CO'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground">{business.name}</CardTitle>
              <Badge 
                variant={getStatusColor(assessmentStatus) as any}
                className="flex items-center gap-1"
              >
                {getStatusIcon(assessmentStatus)}
                {assessmentStatus === 'not-started' ? 'Ready to Start' : 
                 assessmentStatus === 'in-progress' ? 'Assessment In Progress' : 
                 'Assessment Completed'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Registration: {business.registrationNumber}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Company Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="font-medium">Industry:</span>
              <span className="text-muted-foreground">{business.industry}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">Size:</span>
              <Badge variant="outline" className="text-xs">
                {business?.size ? business.size.charAt(0).toUpperCase() + business.size.slice(1) : 'Unknown'} Enterprise
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Location:</span>
              <span className="text-muted-foreground">{business.location}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">Employees:</span>
              <span className="text-muted-foreground">{business.employees}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">Revenue:</span>
              <span className="text-muted-foreground">RM {business.revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">Established:</span>
              <span className="text-muted-foreground">{business.establishedYear}</span>
            </div>
          </div>
        </div>

        {/* Framework Compliance Status */}
        {frameworkScores.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Framework Compliance Status</h4>
            <div className="space-y-2">
              {frameworkScores.map((framework, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{framework.frameworkName}</p>
                    {framework.lastAssessed && (
                      <p className="text-xs text-muted-foreground">
                        Last assessed: {framework.lastAssessed.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">
                      {framework.score.toFixed(1)}%
                    </span>
                    <Badge 
                      variant={
                        framework.complianceLevel === 'financing-ready' ? 'default' :
                        framework.complianceLevel === 'progressing' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {framework.complianceLevel === 'financing-ready' ? 'Ready' :
                       framework.complianceLevel === 'progressing' ? 'Progress' : 'Foundation'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};