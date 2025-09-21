import { supabase } from '@/integrations/supabase/client';
import { Company, Assessment, AssessmentResult } from '@/types/database';

export class CompanyService {
  // Company operations
  static async getCompaniesByUser(userId: string): Promise<Company[]> {
    console.log('Fetching companies for user:', userId);
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }

    return (data || []).map(company => ({
      ...company,
      size: company.size as 'micro' | 'small' | 'medium'
    }));
  }

  static async createCompany(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company | null> {
    console.log('Creating company:', companyData);
    
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw error;
    }

    return data ? {
      ...data,
      size: data.size as 'micro' | 'small' | 'medium'
    } : null;
  }

  static async updateCompany(companyId: string, updates: Partial<Company>): Promise<Company | null> {
    console.log('Updating company:', companyId, updates);
    
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating company:', error);
      throw error;
    }

    return data ? {
      ...data,
      size: data.size as 'micro' | 'small' | 'medium'
    } : null;
  }

  static async getCompanyById(companyId: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      throw error;
    }

    return data ? {
      ...data,
      size: data.size as 'micro' | 'small' | 'medium'
    } : null;
  }

  // Assessment operations
  static async createAssessment(assessmentData: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>): Promise<Assessment | null> {
    console.log('Creating assessment:', assessmentData);
    
    const { data, error } = await supabase
      .from('assessments')
      .insert([assessmentData])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }

    return data ? {
      ...data,
      status: data.status as 'in_progress' | 'completed' | 'failed'
    } : null;
  }

  static async getAssessmentsByCompany(companyId: string): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }

    return (data || []).map(assessment => ({
      ...assessment,
      status: assessment.status as 'in_progress' | 'completed' | 'failed'
    }));
  }

  static async updateAssessment(assessmentId: string, updates: Partial<Assessment>): Promise<Assessment | null> {
    const { data, error } = await supabase
      .from('assessments')
      .update(updates)
      .eq('id', assessmentId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }

    return data ? {
      ...data,
      status: data.status as 'in_progress' | 'completed' | 'failed'
    } : null;
  }

  // Assessment result operations
  static async createAssessmentResult(resultData: Omit<AssessmentResult, 'id' | 'created_at'>): Promise<AssessmentResult | null> {
    const { data, error } = await supabase
      .from('assessment_results')
      .insert([resultData])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating assessment result:', error);
      throw error;
    }

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
}