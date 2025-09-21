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
  recommendations: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    priority: string;
    estimatedImpact: string;
    timeframe: string;
    requiredActions: string[];
    relatedCriteria: string[];
    resources: Array<{
      title: string;
      type: string;
      description: string;
    }>;
  }>;
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
    console.log('🚀 ESG Assessment Submission Started');
    console.log('📊 Assessment Data:', {
      businessName: data.business.name,
      data: data.business, 
      framework: data.framework,
      responseCount: data.responses.length,
      dataSize: JSON.stringify(data).length + ' bytes'
    });

    try {
      const config = this.getConfig();
      console.log('✅ Lambda endpoint configured:', config.endpoint);
      console.log('🔑 AWS credentials configured:', !!config.credentials);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add AWS credentials if available
      if (config.credentials) {
        headers['X-AWS-Access-Key-Id'] = config.credentials.accessKeyId;
        headers['X-AWS-Secret-Access-Key'] = config.credentials.secretAccessKey;
        headers['X-AWS-Region'] = config.credentials.region;
        console.log('🔐 AWS headers added to request');
      }

      const requestPayload = {
        action: 'analyze_esg',
        data
      };

      console.log('📡 Sending request to Lambda:', config.endpoint);
      console.log('📦 Request payload size:', JSON.stringify(requestPayload).length + ' bytes');
      
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestPayload)
      });

      console.log('📨 Lambda response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        throw new Error(`Lambda request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Lambda processing successful:', {
        hasScoring: !!result.scoring,
        hasOpportunities: !!result.opportunities,
        processingTime: result.processingTime + 's'
      });
      
      return result;

    } catch (error) {
      console.error('❌ Lambda service error:', error);
      console.warn('🔄 Falling back to mock data');
      
      // Return mock data for development
      const mockResponse = this.getMockResponse(data);
      console.log('🎭 Mock response generated:', {
        overallScore: mockResponse.scoring.overallScore,
        recommendationCount: mockResponse.scoring.recommendations.length,
        opportunityCount: mockResponse.opportunities.length
      });
      
      return mockResponse;
    }
  }

  // Mock response for development/testing
  private getMockResponse(data: LambdaESGRequest): LambdaResponse {
    const totalResponses = data.responses.length;
    const avgScore = data.responses.reduce((sum, r) => sum + r.score, 0) / totalResponses;
    
    // Generate comprehensive mock recommendations
    const mockRecommendations = [
      {
        id: 'rec_001',
        type: 'improvement',
        title: 'Implement Energy Management System',
        description: 'Establish systematic tracking and reduction of energy consumption across all operations',
        priority: 'high',
        estimatedImpact: '10-15% reduction in energy costs and 8-12% reduction in carbon footprint',
        timeframe: '3-6 months',
        requiredActions: [
          'Install smart sub-metering systems',
          'Conduct comprehensive energy audit',
          'Set measurable reduction targets',
          'Train staff on energy monitoring'
        ],
        relatedCriteria: ['Environmental Management', 'Energy Efficiency'],
        resources: [
          { title: 'Energy Audit Guide', type: 'document', description: 'Comprehensive guide for conducting energy audits' }
        ]
      },
      {
        id: 'rec_002', 
        type: 'improvement',
        title: 'Enhance Workplace Safety Program',
        description: 'Strengthen safety training and incident reporting systems to improve workplace culture',
        priority: 'high',
        estimatedImpact: '50% reduction in workplace incidents and 20% decrease in insurance premiums',
        timeframe: '2-4 months',
        requiredActions: [
          'Update safety protocols and procedures',
          'Increase training frequency to monthly',
          'Implement digital incident reporting system',
          'Conduct regular safety audits'
        ],
        relatedCriteria: ['Workplace Safety', 'Employee Welfare'],
        resources: [
          { title: 'DOSH Safety Guidelines', type: 'website', description: 'Malaysian workplace safety regulations' }
        ]
      },
      {
        id: 'rec_003',
        type: 'improvement', 
        title: 'Develop ESG Governance Framework',
        description: 'Establish formal ESG governance structure with clear responsibilities and reporting',
        priority: 'medium',
        estimatedImpact: 'Improved ESG performance tracking and 25% better compliance scores',
        timeframe: '4-8 months',
        requiredActions: [
          'Form ESG steering committee',
          'Define ESG policies and procedures', 
          'Implement quarterly ESG reporting',
          'Establish stakeholder engagement process'
        ],
        relatedCriteria: ['Corporate Governance', 'ESG Management'],
        resources: [
          { title: 'ESG Governance Best Practices', type: 'document', description: 'Guide to establishing ESG governance' }
        ]
      }
    ];
    
    return {
      scoring: {
        overallScore: Math.round(avgScore),
        environmentalScore: Math.round(avgScore * 0.9),
        socialScore: Math.round(avgScore * 1.1),
        governanceScore: Math.round(avgScore * 0.95),
        complianceLevel: avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : avgScore >= 40 ? 'Fair' : 'Needs Improvement',
        recommendations: mockRecommendations,
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