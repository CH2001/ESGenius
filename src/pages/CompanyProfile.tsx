import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CompanyService } from '@/services/companyService';
import { Company } from '@/types/database';
import { demoAuth, DemoUser, mockCompany } from '@/services/demoAuthService';
import { Plus, Building, ArrowLeft, Edit, Save, X } from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({});

  useEffect(() => {
    const unsubscribe = demoAuth.onAuthStateChange((user) => {
      setCurrentUser(user);
      if (user) {
        // Load demo data instead of trying to fetch from database
        loadDemoData();
      }
    });

    return unsubscribe;
  }, []);

  const loadDemoData = () => {
    // Use mock data for demo
    setCompanies([mockCompany as Company]);
  };

  const handleCreateCompany = async () => {
    if (!currentUser || !newCompany.name || !newCompany.industry || !newCompany.established_year || !newCompany.employees) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const companyData = {
        ...newCompany,
        user_id: currentUser.id,
        name: newCompany.name!,
        industry: newCompany.industry!,
        size: newCompany.size || 'small',
        location: newCompany.location || '',
        employees: newCompany.employees || 0,
        revenue: newCompany.revenue || 0,
        established_year: newCompany.established_year || new Date().getFullYear(),
        registration_number: newCompany.registration_number || '',
      } as Omit<Company, 'id' | 'created_at' | 'updated_at'>;

      const createdCompany = await CompanyService.createCompany(companyData);
      if (createdCompany) {
        setCompanies([...companies, createdCompany]);
        setNewCompany({});
        setShowNewCompany(false);
        toast.success('Company created successfully');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Failed to create company');
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p>Please log in to manage your company profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground">Manage your company information for ESG assessments</p>
        </div>
        <Button onClick={() => setShowNewCompany(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Company
        </Button>
      </div>

      {/* New Company Form */}
      {showNewCompany && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Company</CardTitle>
            <CardDescription>Add your company information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  value={newCompany.name || ''}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={newCompany.industry || ''} onValueChange={(value) => setNewCompany(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="bg-background border border-border">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="agriculture">Agriculture & Forestry</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="banking">Banking & Financial Services</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="energy">Energy & Utilities</SelectItem>
                    <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="mining">Mining & Quarrying</SelectItem>
                    <SelectItem value="retail">Retail & Wholesale</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="telecommunications">Telecommunications</SelectItem>
                    <SelectItem value="transportation">Transportation & Logistics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="established-year">Year of Establishment *</Label>
                <Input
                  id="established-year"
                  type="number"
                  value={newCompany.established_year || ''}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, established_year: parseInt(e.target.value) || undefined }))}
                  placeholder={new Date().getFullYear().toString()}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees *</Label>
                <Input
                  id="employees"
                  type="number"
                  value={newCompany.employees || ''}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, employees: parseInt(e.target.value) || undefined }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Select value={newCompany.size} onValueChange={(value: 'micro' | 'small' | 'medium') => setNewCompany(prev => ({ ...prev, size: value }))}>
                  <SelectTrigger className="bg-background border border-border">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="micro">Micro (1-5 employees)</SelectItem>
                    <SelectItem value="small">Small (6-30 employees)</SelectItem>
                    <SelectItem value="medium">Medium (31-200 employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newCompany.location || ''}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State, Malaysia"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateCompany}>
                <Save className="h-4 w-4 mr-2" />
                Create Company
              </Button>
              <Button variant="outline" onClick={() => { setShowNewCompany(false); setNewCompany({}); }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Companies */}
      <div className="space-y-6">
        {companies.map((company) => (
          <Card key={company.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {company.name}
                  </CardTitle>
                  <CardDescription>{company.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div><strong>Industry:</strong> {company.industry}</div>
                <div><strong>Size:</strong> {company.size} • <strong>Employees:</strong> {company.employees}</div>
                <div><strong>Location:</strong> {company.location}</div>
                <div><strong>Established:</strong> {company.established_year}</div>
                <div><strong>Revenue:</strong> RM {company.revenue?.toLocaleString()}</div>
                {company.registration_number && <div><strong>Registration:</strong> {company.registration_number}</div>}
                {company.website && <div className="md:col-span-2 lg:col-span-3"><strong>Website:</strong> <a href={company.website} className="text-primary hover:underline">{company.website}</a></div>}
                {company.address && <div className="md:col-span-2 lg:col-span-3"><strong>Address:</strong> {company.address}</div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No companies yet</h3>
            <p className="text-muted-foreground mb-4">Create your first company profile to get started with ESG assessments.</p>
            <Button onClick={() => setShowNewCompany(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Company
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
