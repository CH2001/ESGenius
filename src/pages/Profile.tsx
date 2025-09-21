import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ProfileService } from '@/services/profileService';
import { Profile, Company } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Building, Edit, Save, X } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [companies, setCompanies] = useState<{ [profileId: string]: Company[] }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [showNewCompany, setShowNewCompany] = useState<string | null>(null);
  const [newProfile, setNewProfile] = useState<Partial<Profile>>({});
  const [newCompany, setNewCompany] = useState<Partial<Company>>({});

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setCurrentUser(session.user);
      loadProfiles(session.user.id);
    }
  };

  const loadProfiles = async (userId: string) => {
    try {
      const profilesData = await ProfileService.getProfilesByUser(userId);
      setProfiles(profilesData);
      
      // Load companies for each profile
      const companiesData: { [profileId: string]: Company[] } = {};
      for (const profile of profilesData) {
        const profileCompanies = await ProfileService.getCompaniesByProfile(profile.id);
        companiesData[profile.id] = profileCompanies;
      }
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast.error('Failed to load profiles');
    }
  };

  const handleCreateProfile = async () => {
    if (!currentUser || !newProfile.organization_name) {
      toast.error('Please fill in the organization name');
      return;
    }

    try {
      const profileData = {
        ...newProfile,
        user_id: currentUser.id,
        organization_name: newProfile.organization_name!,
      };

      const createdProfile = await ProfileService.createProfile(profileData);
      if (createdProfile) {
        setProfiles([...profiles, createdProfile]);
        setNewProfile({});
        setShowNewProfile(false);
        toast.success('Profile created successfully');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    }
  };

  const handleCreateCompany = async (profileId: string) => {
    if (!newCompany.name || !newCompany.industry) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const companyData = {
        ...newCompany,
        profile_id: profileId,
        name: newCompany.name!,
        industry: newCompany.industry!,
        size: newCompany.size || 'small',
        location: newCompany.location || '',
        employees: newCompany.employees || 0,
        revenue: newCompany.revenue || 0,
        established_year: newCompany.established_year || new Date().getFullYear(),
        registration_number: newCompany.registration_number || '',
      } as Omit<Company, 'id' | 'created_at' | 'updated_at'>;

      const createdCompany = await ProfileService.createCompany(companyData);
      if (createdCompany) {
        setCompanies(prev => ({
          ...prev,
          [profileId]: [...(prev[profileId] || []), createdCompany]
        }));
        setNewCompany({});
        setShowNewCompany(null);
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
            <p>Please log in to manage your profiles.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile Management</h1>
          <p className="text-muted-foreground">Manage your organization profiles and companies</p>
        </div>
        <Button onClick={() => setShowNewProfile(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Profile
        </Button>
      </div>

      {/* New Profile Form */}
      {showNewProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Profile</CardTitle>
            <CardDescription>Add a new organization profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name *</Label>
                <Input
                  id="org-name"
                  value={newProfile.organization_name || ''}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, organization_name: e.target.value }))}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={newProfile.industry || ''}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="Enter industry"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={newProfile.website || ''}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={newProfile.contact_email || ''}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  value={newProfile.contact_phone || ''}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="+60 123456789"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProfile.description || ''}
                onChange={(e) => setNewProfile(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your organization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={newProfile.address || ''}
                onChange={(e) => setNewProfile(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Organization address"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateProfile}>
                <Save className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
              <Button variant="outline" onClick={() => { setShowNewProfile(false); setNewProfile({}); }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Profiles */}
      <div className="space-y-6">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {profile.organization_name}
                  </CardTitle>
                  <CardDescription>{profile.description}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewCompany(profile.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {profile.industry && <div><strong>Industry:</strong> {profile.industry}</div>}
                {profile.website && <div><strong>Website:</strong> <a href={profile.website} className="text-primary hover:underline">{profile.website}</a></div>}
                {profile.contact_email && <div><strong>Email:</strong> {profile.contact_email}</div>}
                {profile.contact_phone && <div><strong>Phone:</strong> {profile.contact_phone}</div>}
                {profile.address && <div className="md:col-span-2 lg:col-span-3"><strong>Address:</strong> {profile.address}</div>}
              </div>

              {/* Companies under this profile */}
              {companies[profile.id] && companies[profile.id].length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Companies ({companies[profile.id].length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companies[profile.id].map((company) => (
                      <Card key={company.id} className="p-4">
                        <h5 className="font-medium">{company.name}</h5>
                        <div className="text-sm text-muted-foreground space-y-1 mt-2">
                          <div>Industry: {company.industry}</div>
                          <div>Size: {company.size} • Employees: {company.employees}</div>
                          <div>Location: {company.location}</div>
                          <div>Established: {company.established_year}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* New Company Form */}
              {showNewCompany === profile.id && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Add New Company</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input
                        value={newCompany.name || ''}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Industry *</Label>
                      <Input
                        value={newCompany.industry || ''}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="Industry"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Size</Label>
                      <Select value={newCompany.size} onValueChange={(value: 'micro' | 'small' | 'medium') => setNewCompany(prev => ({ ...prev, size: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="micro">Micro (1-5 employees)</SelectItem>
                          <SelectItem value="small">Small (6-30 employees)</SelectItem>
                          <SelectItem value="medium">Medium (31-200 employees)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={newCompany.location || ''}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Location"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Employees</Label>
                      <Input
                        type="number"
                        value={newCompany.employees || ''}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, employees: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Annual Revenue (RM)</Label>
                      <Input
                        type="number"
                        value={newCompany.revenue || ''}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, revenue: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Established Year</Label>
                      <Input
                        type="number"
                        value={newCompany.established_year || ''}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, established_year: parseInt(e.target.value) || new Date().getFullYear() }))}
                        placeholder={new Date().getFullYear().toString()}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Registration Number</Label>
                      <Input
                        value={newCompany.registration_number || ''}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, registration_number: e.target.value }))}
                        placeholder="Registration number"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleCreateCompany(profile.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Add Company
                    </Button>
                    <Button variant="outline" onClick={() => { setShowNewCompany(null); setNewCompany({}); }}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {profiles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No profiles yet</h3>
            <p className="text-muted-foreground mb-4">Create your first organization profile to get started with ESG assessments.</p>
            <Button onClick={() => setShowNewProfile(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Profile
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
