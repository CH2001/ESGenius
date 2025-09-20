// ESGenius Scoring System Types

export interface ScoringRubric {
  environmental: {
    weight: number; // 40%
    categories: ScoringCategory[];
  };
  social: {
    weight: number; // 35%
    categories: ScoringCategory[];
  };
  governance: {
    weight: number; // 25%
    categories: ScoringCategory[];
  };
}

export interface ScoringCategory {
  id: string;
  name: string;
  weight: number;
  criteria: ScoringCriterion[];
}

export interface ScoringCriterion {
  id: string;
  title: string;
  description: string;
  maxScore: number;
  weight: number;
}

export interface CompanyScore {
  overallScore: number;
  complianceLevel: 'needs-foundation' | 'progressing' | 'financing-ready';
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  frameworkScores: FrameworkScore[];
}

export interface FrameworkScore {
  frameworkId: string;
  frameworkName: string;
  score: number;
  complianceLevel: 'needs-foundation' | 'progressing' | 'financing-ready';
  status: 'completed' | 'in-progress' | 'not-started';
  lastAssessed?: Date;
}

export interface OpportunityRecommendation {
  id: string;
  type: 'grant' | 'tax-deduction' | 'business-opportunity' | 'financing';
  title: string;
  description: string;
  eligibilityScore: number;
  potentialValue: string;
  provider: string;
  deadline?: Date;
  requirements: string[];
  applicationUrl?: string;
  priority: 'high' | 'medium' | 'low';
}

// Mock AWS Integration Types (for future implementation)
export interface AWSDocumentAnalysis {
  documentId: string;
  documentType: 'sustainability_report' | 'policy_document' | 'certification' | 'financial_statement';
  extractedData: {
    environmentalMetrics?: any;
    socialMetrics?: any;
    governanceMetrics?: any;
  };
  confidence: number;
  recommendations: string[];
}

export interface LLMAnalysisRequest {
  companyProfile: any;
  documents: string[];
  frameworks: string[];
  analysisType: 'scoring' | 'recommendations' | 'compliance_gap';
}

export interface LLMAnalysisResponse {
  scores: CompanyScore;
  recommendations: OpportunityRecommendation[];
  complianceGaps: {
    framework: string;
    gaps: string[];
    severity: 'high' | 'medium' | 'low';
  }[];
  actionPlan: {
    step: number;
    title: string;
    description: string;
    timeframe: string;
    priority: 'high' | 'medium' | 'low';
    templates?: string[];
    kpis?: string[];
  }[];
}

// AWS Integration Code (commented for future implementation)
/*
// AWS Bedrock LLM Integration
export interface AWSBedrockConfig {
  region: string;
  modelId: string; // e.g., 'anthropic.claude-3-sonnet-20240229-v1:0'
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

// AWS DocumentDB Integration
export interface AWSDocumentDBConfig {
  cluster: string;
  database: string;
  collection: string;
  credentials: {
    username: string;
    password: string;
  };
}

// Sample AWS Lambda Function for ESG Analysis
export const sampleLambdaFunction = `
import boto3
import json
from datetime import datetime

def lambda_handler(event, context):
    # Initialize AWS services
    bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
    docdb = boto3.client('docdb')
    
    company_data = event['companyData']
    frameworks = event['frameworks']
    
    # Analyze documents using Bedrock
    prompt = f\"\"\"
    Analyze the following company data against Malaysian ESG frameworks:
    Company: {company_data}
    Frameworks: {frameworks}
    
    Provide:
    1. ESG scores (E: 40%, S: 35%, G: 25%)
    2. Compliance level (0-49: Needs Foundation, 50-74: Progressing, 75+: Financing-Ready)
    3. Specific recommendations
    4. Grant opportunities
    \"\"\"
    
    response = bedrock.invoke_model(
        modelId='anthropic.claude-3-sonnet-20240229-v1:0',
        body=json.dumps({
            'prompt': prompt,
            'max_tokens': 2000,
            'temperature': 0.1
        })
    )
    
    # Process and return results
    return {
        'statusCode': 200,
        'body': json.dumps({
            'analysis': response,
            'timestamp': datetime.now().isoformat()
        })
    }
`;

// Python Backend Integration Sample
export const pythonBackendSample = `
# requirements.txt
# boto3==1.34.0
# langchain==0.1.0
# anthropic==0.15.0
# pymongo==4.6.0

import boto3
import json
from anthropic import Anthropic
from pymongo import MongoClient
from datetime import datetime

class ESGAnalyzer:
    def __init__(self):
        self.bedrock = boto3.client('bedrock-runtime')
        self.anthropic = Anthropic()
        self.docdb = MongoClient('mongodb://your-docdb-cluster')
        
    def analyze_company_esg(self, company_data, documents):
        # Document analysis using AWS Textract
        textract = boto3.client('textract')
        
        extracted_data = []
        for doc in documents:
            response = textract.analyze_document(
                Document={'S3Object': {'Bucket': 'esg-documents', 'Name': doc}},
                FeatureTypes=['TABLES', 'FORMS']
            )
            extracted_data.append(response)
        
        # LLM Analysis using Anthropic Claude
        prompt = self._build_analysis_prompt(company_data, extracted_data)
        
        response = self.anthropic.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Store results in DocumentDB
        result = {
            'company_id': company_data['id'],
            'analysis': response.content,
            'timestamp': datetime.now(),
            'frameworks_assessed': ['NSRF', 'iESG', 'SME_ESG']
        }
        
        self.docdb.esg_assessments.insert_one(result)
        
        return self._format_response(response.content)
    
    def _build_analysis_prompt(self, company_data, documents):
        return f\"\"\"
        Analyze this Malaysian MSME against ESG frameworks:
        
        Company Profile: {json.dumps(company_data, indent=2)}
        Document Data: {json.dumps(documents, indent=2)}
        
        Provide detailed analysis for:
        1. Environmental Score (40% weight)
        2. Social Score (35% weight) 
        3. Governance Score (25% weight)
        4. Overall compliance level
        5. Grant opportunities
        6. Action plan with KPIs
        \"\"\"
`;
*/