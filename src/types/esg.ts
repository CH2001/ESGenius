// ESG Types for Malaysian Compliance Framework

export interface Business {
  id: string;
  name: string;
  industry: string;
  size: 'micro' | 'small' | 'medium';
  location: string;
  employees: number;
  revenue: number;
  establishedYear: number;
  registrationNumber: string;
}

export interface ESGFramework {
  id: string;
  name: string;
  description: string;
  categories: ESGCategory[];
}

export interface ESGCategory {
  id: string;
  name: string;
  weight: number;
  criteria: ESGCriterion[];
}

export interface ESGCriterion {
  id: string;
  title: string;
  description: string;
  weight: number;
  benchmark: string;
  requiredDocuments: string[];
  scoringGuideline: string;
}

export interface ESGAssessment {
  id: string;
  businessId: string;
  frameworkId: string;
  responses: ESGResponse[];
  overallScore: number;
  categoryScores: { categoryId: string; score: number }[];
  completedAt: Date;
  status: 'draft' | 'completed' | 'reviewed';
}

export interface ESGResponse {
  criterionId: string;
  score: number;
  evidence: string;
  documents: string[];
  notes: string;
}

export interface ESGRecommendation {
  id: string;
  type: 'improvement' | 'grant' | 'market_opportunity' | 'certification';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
  timeframe: string;
  requiredActions: string[];
  relatedCriteria: string[];
  resources: ESGResource[];
}

export interface ESGResource {
  title: string;
  type: 'document' | 'website' | 'contact' | 'training';
  url?: string;
  description: string;
}

export interface GrantOpportunity {
  id: string;
  name: string;
  provider: string;
  amount: string;
  eligibilityRequirements: string[];
  applicationDeadline: Date;
  esgRequirements: string[];
  description: string;
  applicationUrl: string;
}

// AWS Integration Types (for future implementation)
/*
// AWS Bedrock Integration for LLM RAG
export interface AWSBedrockConfig {
  region: string;
  modelId: string;
  accessKeyId: string;
  secretAccessKey: string;
}

// AWS Lambda Function for ESG Processing
export interface ESGProcessingRequest {
  businessData: Business;
  assessmentData: ESGAssessment;
  frameworkIds: string[];
}

export interface ESGProcessingResponse {
  scores: { [frameworkId: string]: number };
  recommendations: ESGRecommendation[];
  grantOpportunities: GrantOpportunity[];
  complianceGaps: string[];
}
*/