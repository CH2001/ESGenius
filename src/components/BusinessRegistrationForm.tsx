import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Users, MapPin, Calendar } from 'lucide-react';
import { Business } from '@/types/esg';

interface BusinessRegistrationFormProps {
  onSubmit: (business: Business) => void;
}

export const BusinessRegistrationForm: React.FC<BusinessRegistrationFormProps> = ({
  onSubmit
}) => {
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

  const industries = [
    'Manufacturing',
    'Technology',
    'Agriculture & Food Processing',
    'Construction',
    'Retail & Wholesale',
    'Healthcare',
    'Education',
    'Tourism & Hospitality',
    'Financial Services',
    'Professional Services',
    'Transportation & Logistics',
    'Energy & Utilities',
    'Other'
  ];

  const malaysianStates = [
    'Kuala Lumpur',
    'Selangor',
    'Johor',
    'Penang',
    'Sabah',
    'Sarawak',
    'Perak',
    'Kedah',
    'Kelantan',
    'Terengganu',
    'Pahang',
    'Negeri Sembilan',
    'Melaka',
    'Perlis',
    'Putrajaya',
    'Labuan'
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
      revenue: parseInt(formData.revenue) || 0,
      establishedYear: parseInt(formData.establishedYear) || new Date().getFullYear(),
      registrationNumber: formData.registrationNumber
    };

    onSubmit(business);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-medium">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
          <Building2 className="h-6 w-6" />
          Business Registration
        </CardTitle>
        <p className="text-muted-foreground">
          Register your business to begin ESG compliance assessment
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your business name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration">Registration Number *</Label>
                <Input
                  id="registration"
                  placeholder="e.g., 123456-X"
                  value={formData.registrationNumber}
                  onChange={(e) => updateField('registrationNumber', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => updateField('industry', value)}>
                  <SelectTrigger>
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
                <Label>Business Size *</Label>
                <Select value={formData.size} onValueChange={(value) => updateField('size', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">Micro (≤5 employees)</SelectItem>
                    <SelectItem value="small">Small (6-75 employees)</SelectItem>
                    <SelectItem value="medium">Medium (76-200 employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location & Demographics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-foreground">Location & Size</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>State/Location *</Label>
                <Select value={formData.location} onValueChange={(value) => updateField('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {malaysianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.employees}
                  onChange={(e) => updateField('employees', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue">Annual Revenue (RM)</Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="e.g., 1500000"
                  value={formData.revenue}
                  onChange={(e) => updateField('revenue', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-foreground">Additional Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="established">Established Year</Label>
              <Input
                id="established"
                type="number"
                placeholder="e.g., 2015"
                value={formData.establishedYear}
                onChange={(e) => updateField('establishedYear', e.target.value)}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="w-full md:w-auto px-8 bg-primary hover:bg-primary-light"
              disabled={!formData.name || !formData.industry || !formData.size || !formData.registrationNumber}
            >
              <Users className="h-4 w-4 mr-2" />
              Continue to ESG Assessment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};