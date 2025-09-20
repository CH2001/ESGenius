import { ESGResponse, Business } from '@/types/esg';

export interface LambdaESGRequest {
  business: Business;
  responses: ESGResponse[];
  framework: string;
}

export interface LambdaESGScoring {
  overallScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  complianceLevel: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
  recommendations: string[];
  gaps: string[];
  actionItems: {
    priority: 'High' | 'Medium' | 'Low';
    action: string;
    timeline: string;
  }[];
}

export interface LambdaOpportunity {
  id: string;
  title: string;
  type: 'Grant' | 'Financing' | 'Partnership' | 'Certification';
  description: string;
  eligibilityMatch: number;
  estimatedValue: string;
  deadline?: string;
  provider: string;
  requirements: string[];
  applicationUrl?: string;
}

export interface LambdaResponse {
  scoring: LambdaESGScoring;
  opportunities: LambdaOpportunity[];
  processingTime: number;
  confidence: number;
}

class LambdaService {
  private lambdaEndpoint: string = '';
  private awsCredentials: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  } | null = null;

  // Configure AWS Lambda endpoint and credentials
  configure(endpoint: string, credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  }) {
    this.lambdaEndpoint = endpoint;
    if (credentials) {
      this.awsCredentials = credentials;
    }
  }

  // Get configuration from localStorage (temporary solution)
  private getConfig() {
    const endpoint = localStorage.getItem('aws_lambda_endpoint');
    const accessKeyId = localStorage.getItem('aws_access_key_id');
    const secretAccessKey = localStorage.getItem('aws_secret_access_key');
    const region = localStorage.getItem('aws_region');

    if (!endpoint) {
      throw new Error('AWS Lambda endpoint not configured');
    }

    return {
      endpoint,
      credentials: accessKeyId && secretAccessKey && region ? {
        accessKeyId,
        secretAccessKey,
        region
      } : null
    };
  }

  // Submit ESG assessment to AWS Lambda
  async submitESGAssessment(data: LambdaESGRequest): Promise<LambdaResponse> {
    try {
      const config = this.getConfig();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add AWS credentials if available
      if (config.credentials) {
        headers['X-AWS-Access-Key-Id'] = config.credentials.accessKeyId;
        headers['X-AWS-Secret-Access-Key'] = config.credentials.secretAccessKey;
        headers['X-AWS-Region'] = config.credentials.region;
      }

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'analyze_esg',
          data
        })
      });

      if (!response.ok) {
        throw new Error(`Lambda request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Lambda service error:', error);
      
      // Return mock data for development
      return this.getMockResponse(data);
    }
  }

  // Mock response for development/testing
  private getMockResponse(data: LambdaESGRequest): LambdaResponse {
    const totalResponses = data.responses.length;
    const avgScore = data.responses.reduce((sum, r) => sum + r.score, 0) / totalResponses;
    
    return {
      scoring: {
        overallScore: Math.round(avgScore),
        environmentalScore: Math.round(avgScore * 0.9),
        socialScore: Math.round(avgScore * 1.1),
        governanceScore: Math.round(avgScore * 0.95),
        complianceLevel: avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : avgScore >= 40 ? 'Fair' : 'Needs Improvement',
        recommendations: [
          'Implement energy monitoring system',
          'Develop diversity and inclusion policy',
          'Establish ESG governance committee'
        ],
        gaps: [
          'Missing carbon footprint tracking',
          'No formal sustainability reporting',
          'Limited stakeholder engagement'
        ],
        actionItems: [
          {
            priority: 'High',
            action: 'Conduct energy audit',
            timeline: '3 months'
          },
          {
            priority: 'Medium',
            action: 'Develop ESG policy framework',
            timeline: '6 months'
          }
        ]
      },
      opportunities: [
        {
          id: 'grant-001',
          title: 'Malaysia Green Technology Grant',
          type: 'Grant',
          description: 'Funding for green technology adoption and energy efficiency projects',
          eligibilityMatch: 85,
          estimatedValue: 'RM 50,000 - RM 500,000',
          deadline: '2024-12-31',
          provider: 'Malaysia Green Technology Corporation',
          requirements: ['Energy audit report', 'Implementation plan', 'Company registration'],
          applicationUrl: 'https://www.mgtc.gov.my/grants'
        },
        {
          id: 'cert-001',
          title: 'ISO 14001 Environmental Management',
          type: 'Certification',
          description: 'International standard for environmental management systems',
          eligibilityMatch: 70,
          estimatedValue: 'RM 15,000 - RM 30,000',
          provider: 'SIRIM QAS International',
          requirements: ['Environmental management system', 'Internal audit', 'Management review']
        }
      ],
      processingTime: 2.5,
      confidence: 0.87
    };
  }
}

export const lambdaService = new LambdaService();