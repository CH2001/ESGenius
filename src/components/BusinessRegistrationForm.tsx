import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Users, MapPin, Calendar, DollarSign, FileText, ArrowLeft } from 'lucide-react';
import { Business } from '@/types/esg';
import { CompetitorDetails } from './CompetitorDetails';

interface BusinessRegistrationFormProps {
  onComplete: (business: Business) => void;
  onBack?: () => void;
}

export const BusinessRegistrationForm: React.FC<BusinessRegistrationFormProps> = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    location: '',
    employees: '',
    revenue: '',
    establishedYear: '',
    registrationNumber: '',
    description: ''
  });

  // Mock competitor data
  const mockCompetitors = [
    {
      name: 'EcoTech Solutions',
      industry: formData.industry || 'Technology',
      esgScore: 82,
      strengths: ['Renewable Energy', 'Waste Reduction', 'Employee Welfare'],
      marketPosition: 'Market Leader in Sustainable Tech'
    },
    {
      name: 'Green Manufacturing Co.',
      industry: formData.industry || 'Manufacturing', 
      esgScore: 76,
      strengths: ['Carbon Neutral', 'Local Sourcing', 'Community Programs'],
      marketPosition: 'Regional Sustainability Champion'
    }
  ];

  const industries = [
    'Manufacturing',
    'Technology',
    'Agriculture',
    'Construction',
    'Healthcare',
    'Education',
    'Finance',
    'Retail',
    'Transportation',
    'Energy',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const business: Business = {
      id: Date.now().toString(),
      name: formData.name,
      industry: formData.industry,
      size: formData.size as 'micro' | 'small' | 'medium',
      location: formData.location,
      employees: parseInt(formData.employees) || 0,
      revenue: parseFloat(formData.revenue) || 0,
      establishedYear: parseInt(formData.establishedYear) || new Date().getFullYear(),
      registrationNumber: formData.registrationNumber
    };

    onComplete(business);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary-light"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        )}

        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Building2 className="h-6 w-6" />
              Business Registration
            </CardTitle>
            <p className="text-muted-foreground">
              Tell us about your business to get personalized ESG recommendations
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Company Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="shadow-soft"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber" className="text-sm font-medium">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="e.g., 202301234567 (1234567-A)"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    required
                    className="shadow-soft"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className="shadow-soft">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size" className="text-sm font-medium">Company Size *</Label>
                  <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                    <SelectTrigger className="shadow-soft">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Micro (≤ 5 employees, ≤ RM 300k revenue)</SelectItem>
                      <SelectItem value="small">Small (6-30 employees, ≤ RM 15M revenue)</SelectItem>
                      <SelectItem value="medium">Medium (31-200 employees, ≤ RM 50M revenue)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g., Kuala Lumpur, Malaysia"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                    className="shadow-soft"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employees" className="text-sm font-medium">Number of Employees *</Label>
                  <Input
                    id="employees"
                    type="number"
                    placeholder="Enter number of employees"
                    value={formData.employees}
                    onChange={(e) => handleInputChange('employees', e.target.value)}
                    required
                    min="1"
                    className="shadow-soft"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue" className="text-sm font-medium">Annual Revenue (RM) *</Label>
                  <Input
                    id="revenue"
                    type="number"
                    placeholder="Enter annual revenue in RM"
                    value={formData.revenue}
                    onChange={(e) => handleInputChange('revenue', e.target.value)}
                    required
                    min="0"
                    className="shadow-soft"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishedYear" className="text-sm font-medium">Year Established *</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    placeholder="e.g., 2020"
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    className="shadow-soft"
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary-light shadow-medium"
                  disabled={!formData.name || !formData.industry || !formData.registrationNumber}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Continue to Assessment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Competitor Analysis */}
        {formData.industry && (
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <CompetitorDetails competitors={mockCompetitors} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};