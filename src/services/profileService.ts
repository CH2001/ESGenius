import { supabase } from '@/integrations/supabase/client';
import { Profile, Company, Assessment, AssessmentResult } from '@/types/database';

export class ProfileService {
  // Profile operations
  static async createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile | null> {
    console.log('Creating profile:', profileData);
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    console.log('Profile created successfully:', data);
    return data;
  }

  static async getProfilesByUser(userId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
    
    return data || [];
  }

  static async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    console.log('Updating profile:', id, updates);
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log('Profile updated successfully:', data);
    return data;
  }

  // Company operations
  static async createCompany(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company | null> {
    console.log('Creating company:', companyData);
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating company:', error);
      throw error;
    }
    
    console.log('Company created successfully:', data);
    return data;
  }

  static async getCompaniesByProfile(profileId: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('profile_id', profileId);
    
    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
    
    return (data || []) as Company[];
  }

  static async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    console.log('Updating company:', id, updates);
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating company:', error);
      throw error;
    }
    
    console.log('Company updated successfully:', data);
    return data;
  }

  // Assessment operations
  static async createAssessment(assessmentData: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>): Promise<Assessment | null> {
    console.log('Creating assessment:', assessmentData);
    const { data, error } = await supabase
      .from('assessments')
      .insert([assessmentData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
    
    console.log('Assessment created successfully:', data);
    return data as Assessment;
  }

  static async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | null> {
    console.log('Updating assessment:', id, updates);
    const { data, error } = await supabase
      .from('assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
    
    console.log('Assessment updated successfully:', data);
    return data as Assessment;
  }

  static async getAssessmentsByProfile(profileId: string): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        companies (
          name,
          industry
        )
      `)
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
    
    return (data || []) as Assessment[];
  }

  // Assessment results operations
  static async createAssessmentResult(resultData: Omit<AssessmentResult, 'id' | 'created_at'>): Promise<AssessmentResult | null> {
    console.log('Creating assessment result:', resultData);
    const { data, error } = await supabase
      .from('assessment_results')
      .insert([resultData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating assessment result:', error);
      throw error;
    }
    
    console.log('Assessment result created successfully:', data);
    return data;
  }

  static async getAssessmentResults(assessmentId: string): Promise<AssessmentResult[]> {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching assessment results:', error);
      throw error;
    }
    
    return data || [];
  }

  static async getResultsByProfile(profileId: string, startDate?: string, endDate?: string): Promise<AssessmentResult[]> {
    let query = supabase
      .from('assessment_results')
      .select(`
        *,
        assessments!inner (
          profile_id,
          companies (
            name
          )
        )
      `)
      .eq('assessments.profile_id', profileId)
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching results by profile:', error);
      throw error;
    }
    
    return data || [];
  }
}