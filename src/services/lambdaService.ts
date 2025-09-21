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
  // Submit ESG assessment to AWS Lambda
  async submitESGAssessment(data: LambdaESGRequest): Promise<LambdaResponse> {
    console.log('🚀 ESG Assessment Submission Started');
    console.log('📊 Assessment Data:', {
      businessName: data.business.name,
      business: data.business, 
      framework: data.framework,
      responseCount: data.responses.length,
      dataSize: JSON.stringify(data).length + ' bytes'
    });

    console.log('📋 Survey Responses Being Submitted:', {
      responses: data.responses.map(response => ({
        criterionId: response.criterionId,
        score: response.score,
        fieldResponses: response.fieldResponses,
        notes: response.notes,
        documents: response.documents
      }))
    });

    try {
      // Use your AWS API Gateway endpoint
      const lambdaEndpoint = 'https://09aoixhak3.execute-api.us-east-1.amazonaws.com';
      console.log('✅ Using Lambda endpoint:', lambdaEndpoint);
      
      // Flatten all field responses into a single object as expected by your Lambda
      const assessmentData: { [key: string]: any } = {};
      data.responses.forEach(response => {
        Object.keys(response.fieldResponses).forEach(fieldId => {
          assessmentData[fieldId] = response.fieldResponses[fieldId];
        });
      });

      console.log('📋 Flattened Assessment Data:', assessmentData);

      // Format request payload to match your Lambda function expectations
      const requestPayload = {
        assessmentData
      };

      console.log('📡 Sending request to Lambda:', lambdaEndpoint);
      console.log('📦 Request payload:', JSON.stringify(requestPayload, null, 2));
      
      const response = await fetch(lambdaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('📨 Lambda response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Lambda error response:', errorText);
        throw new Error(`Lambda request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const lambdaResult = await response.json();
      console.log('✅ Raw Lambda response:', lambdaResult);
      
      // Parse the response from your Lambda function
      const parsedBody = typeof lambdaResult.body === 'string' ? JSON.parse(lambdaResult.body) : lambdaResult.body;
      console.log('✅ Parsed Lambda body:', parsedBody);

      // Transform your Lambda response to match the expected LambdaResponse interface
      const transformedResult = this.transformLambdaResponse(parsedBody, data);
      console.log('✅ Transformed result:', transformedResult);
      
      return transformedResult;

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

  // Transform your Lambda response format to match the expected interface
  private transformLambdaResponse(lambdaData: any, originalRequest: LambdaESGRequest): LambdaResponse {
    const nsrfData = lambdaData.NSRF || {};
    const iesgData = lambdaData.iESG || {};
    
    // Calculate overall score from both frameworks
    const nsrfScores = nsrfData.scores || {};
    const iesgScores = iesgData.scores || {};
    
    const environmentalScore = nsrfScores.Environmental || 0;
    const socialScore = nsrfScores.Social || 0;
    const governanceScore = nsrfScores.Governance || 0;
    const operationalScore = iesgScores['Operational Excellence'] || 0;
    
    const overallScore = Math.round((environmentalScore + socialScore + governanceScore + operationalScore) / 4);
    
    // Determine compliance level
    let complianceLevel: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
    if (overallScore >= 80) complianceLevel = 'Excellent';
    else if (overallScore >= 60) complianceLevel = 'Good';
    else if (overallScore >= 40) complianceLevel = 'Fair';
    else complianceLevel = 'Needs Improvement';

    // Extract recommendations from both frameworks
    const combinedRecommendations = `${nsrfData.recommendations || ''}\n\n${iesgData.recommendations || ''}`.trim();
    
    return {
      scoring: {
        overallScore,
        environmentalScore,
        socialScore,
        governanceScore,
        complianceLevel,
        recommendations: [{
          id: 'lambda_rec_001',
          type: 'improvement',
          title: 'AI-Generated ESG Recommendations',
          description: combinedRecommendations,
          priority: 'high',
          estimatedImpact: 'Based on current ESG assessment',
          timeframe: 'Implementation timeline varies',
          requiredActions: ['Review AI recommendations', 'Prioritize implementation'],
          relatedCriteria: ['All assessed criteria'],
          resources: [{ 
            title: 'AI Analysis Results', 
            type: 'document', 
            description: 'Detailed ESG recommendations from AI analysis' 
          }]
        }],
        gaps: [], // Could be extracted from recommendations if needed
        actionItems: [{
          priority: 'High' as const,
          action: 'Review AI-generated recommendations',
          timeline: '1 month'
        }]
      },
      opportunities: [], // Could be added if your Lambda returns grant opportunities
      processingTime: 3.0,
      confidence: 0.9
    };
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