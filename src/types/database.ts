// Database entity types for profiles, companies, and assessments

export interface Profile {
  id: string;
  user_id: string;
  organization_name: string;
  description?: string;
  industry?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  profile_id: string;
  name: string;
  industry: string;
  size: 'micro' | 'small' | 'medium';
  location: string;
  employees: number;
  revenue: number;
  established_year: number;
  registration_number: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  profile_id: string;
  company_id: string;
  frameworks: string[];
  status: 'in_progress' | 'completed' | 'failed';
  responses?: any;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResult {
  id: string;
  assessment_id: string;
  framework: string;
  lambda_request: any;
  lambda_response?: any;
  success: boolean;
  error_message?: string;
  created_at: string;
}

export interface ESGFramework {
  id: string;
  name: string;
  description: string;
  api_endpoint?: string;
}

// Available frameworks
export const AVAILABLE_FRAMEWORKS: ESGFramework[] = [
  {
    id: 'esg-i',
    name: 'i-ESG Framework',
    description: 'Integrated ESG framework for Malaysian businesses',
    api_endpoint: 'https://09aoixhak3.execute-api.us-east-1.amazonaws.com/esg'
  },
  {
    id: 'nsrf',
    name: 'NSRF Framework', 
    description: 'National Sustainability Reporting Framework',
    api_endpoint: 'https://api.example.com/nsrf' // Placeholder for future implementation
  }
];