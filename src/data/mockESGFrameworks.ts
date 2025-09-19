// Mock ESG Frameworks for Malaysian Compliance

import { ESGFramework, GrantOpportunity } from '@/types/esg';

export const mockESGFrameworks: ESGFramework[] = [
  {
    id: 'nsrf',
    name: 'National Sustainability Reporting Framework (NSRF)',
    description: 'Malaysian framework for sustainability reporting aligned with global standards',
    categories: [
      {
        id: 'environmental',
        name: 'Environmental',
        weight: 0.4,
        criteria: [
          {
            id: 'energy-efficiency',
            title: 'Energy Efficiency & Carbon Management',
            description: 'Monitor and reduce energy consumption and carbon emissions',
            weight: 0.3,
            benchmark: 'Reduce energy intensity by 15% annually',
            requiredDocuments: ['Energy audit report', 'Carbon footprint calculation'],
            scoringGuideline: 'Score based on reduction percentage and documentation quality'
          },
          {
            id: 'waste-management',
            title: 'Waste Management & Circular Economy',
            description: 'Implement sustainable waste reduction and recycling practices',
            weight: 0.25,
            benchmark: 'Achieve 70% waste diversion from landfill',
            requiredDocuments: ['Waste management plan', 'Recycling records'],
            scoringGuideline: 'Score based on waste reduction percentage and circular practices'
          },
          {
            id: 'water-conservation',
            title: 'Water Conservation',
            description: 'Efficient water usage and conservation measures',
            weight: 0.2,
            benchmark: 'Reduce water consumption by 10% annually',
            requiredDocuments: ['Water usage reports', 'Conservation initiatives'],
            scoringGuideline: 'Score based on water efficiency improvements'
          },
          {
            id: 'biodiversity',
            title: 'Biodiversity & Environmental Protection',
            description: 'Protect local ecosystems and biodiversity',
            weight: 0.25,
            benchmark: 'Zero negative impact on local biodiversity',
            requiredDocuments: ['Environmental impact assessment', 'Conservation activities'],
            scoringGuideline: 'Score based on environmental protection measures'
          }
        ]
      },
      {
        id: 'social',
        name: 'Social',
        weight: 0.35,
        criteria: [
          {
            id: 'labor-practices',
            title: 'Fair Labor Practices & Worker Rights',
            description: 'Ensure fair wages, safe working conditions, and worker rights',
            weight: 0.4,
            benchmark: 'Comply with Malaysian Employment Act and ILO standards',
            requiredDocuments: ['Employment contracts', 'Safety training records', 'Grievance procedures'],
            scoringGuideline: 'Score based on compliance with labor standards'
          },
          {
            id: 'diversity-inclusion',
            title: 'Diversity & Inclusion',
            description: 'Promote workplace diversity and inclusive practices',
            weight: 0.25,
            benchmark: '30% women in leadership, inclusive hiring practices',
            requiredDocuments: ['Diversity policy', 'Hiring statistics', 'Training records'],
            scoringGuideline: 'Score based on diversity metrics and inclusion initiatives'
          },
          {
            id: 'community-engagement',
            title: 'Community Development & Engagement',
            description: 'Support local community development and engagement',
            weight: 0.35,
            benchmark: 'Annual community investment of 1% of revenue',
            requiredDocuments: ['Community programs list', 'Investment records', 'Impact assessments'],
            scoringGuideline: 'Score based on community investment and engagement quality'
          }
        ]
      },
      {
        id: 'governance',
        name: 'Governance',
        weight: 0.25,
        criteria: [
          {
            id: 'business-ethics',
            title: 'Business Ethics & Anti-Corruption',
            description: 'Maintain high ethical standards and anti-corruption measures',
            weight: 0.4,
            benchmark: 'Zero tolerance corruption policy with training program',
            requiredDocuments: ['Ethics policy', 'Anti-corruption training', 'Whistleblower procedures'],
            scoringGuideline: 'Score based on policy comprehensiveness and implementation'
          },
          {
            id: 'transparency',
            title: 'Transparency & Disclosure',
            description: 'Provide transparent reporting and stakeholder communication',
            weight: 0.3,
            benchmark: 'Annual sustainability report with third-party verification',
            requiredDocuments: ['Annual reports', 'Sustainability disclosures', 'Verification certificates'],
            scoringGuideline: 'Score based on reporting quality and transparency'
          },
          {
            id: 'risk-management',
            title: 'Risk Management & Compliance',
            description: 'Implement comprehensive risk management systems',
            weight: 0.3,
            benchmark: 'Documented risk management framework with regular reviews',
            requiredDocuments: ['Risk register', 'Compliance procedures', 'Internal audit reports'],
            scoringGuideline: 'Score based on risk management maturity and compliance record'
          }
        ]
      }
    ]
  },
  {
    id: 'iesg',
    name: 'National Industry ESG (i-ESG) Framework',
    description: 'Industry-specific ESG framework for Malaysian businesses',
    categories: [
      {
        id: 'operational-excellence',
        name: 'Operational Excellence',
        weight: 0.3,
        criteria: [
          {
            id: 'supply-chain',
            title: 'Sustainable Supply Chain Management',
            description: 'Ensure ESG compliance throughout supply chain',
            weight: 0.5,
            benchmark: '80% of suppliers meet ESG criteria',
            requiredDocuments: ['Supplier ESG assessments', 'Supply chain mapping'],
            scoringGuideline: 'Score based on supplier ESG compliance percentage'
          },
          {
            id: 'innovation',
            title: 'Sustainable Innovation & Technology',
            description: 'Adopt sustainable technologies and innovation practices',
            weight: 0.5,
            benchmark: '5% of revenue invested in sustainable innovation',
            requiredDocuments: ['R&D investments', 'Innovation projects', 'Technology assessments'],
            scoringGuideline: 'Score based on innovation investment and sustainability focus'
          }
        ]
      }
    ]
  }
];

export const mockGrantOpportunities: GrantOpportunity[] = [
  {
    id: 'green-tech-fund',
    name: 'Malaysian Green Technology Financing Scheme',
    provider: 'Malaysia Green Technology and Climate Change Corporation',
    amount: 'Up to RM 50 million',
    eligibilityRequirements: [
      'Malaysian incorporated company',
      'Green technology project implementation',
      'Minimum 60% local content',
      'Environmental impact assessment'
    ],
    applicationDeadline: new Date('2024-12-31'),
    esgRequirements: [
      'Energy efficiency score above 70%',
      'Carbon reduction target of 20%',
      'Environmental management system certification'
    ],
    description: 'Funding for green technology adoption and sustainable business practices',
    applicationUrl: 'https://www.mgtc.gov.my/schemes/'
  },
  {
    id: 'sme-esg-grant',
    name: 'SME ESG Excellence Grant',
    provider: 'SME Corporation Malaysia',
    amount: 'Up to RM 200,000',
    eligibilityRequirements: [
      'SME status verification',
      'ESG assessment completion',
      'Sustainability plan submission',
      'Local workforce requirement'
    ],
    applicationDeadline: new Date('2025-03-31'),
    esgRequirements: [
      'Overall ESG score above 65%',
      'Social impact initiatives',
      'Governance framework implementation'
    ],
    description: 'Grant to support SMEs in achieving ESG excellence and sustainability goals',
    applicationUrl: 'https://www.smecorp.gov.my/esg-grant'
  },
  {
    id: 'climate-resilience-fund',
    name: 'Climate Resilience Business Fund',
    provider: 'Bank Negara Malaysia',
    amount: 'Up to RM 10 million',
    eligibilityRequirements: [
      'Climate resilience project',
      'Financial institution partnership',
      'Risk assessment completion',
      'Sustainability metrics tracking'
    ],
    applicationDeadline: new Date('2024-11-30'),
    esgRequirements: [
      'Climate risk management plan',
      'Environmental score above 75%',
      'Carbon neutral commitment'
    ],
    description: 'Financing for businesses implementing climate resilience measures',
    applicationUrl: 'https://www.bnm.gov.my/climate-fund'
  }
];

// AWS Integration Mock Functions (for future implementation)
/*
// Example AWS Bedrock LLM integration for ESG recommendations
export const generateESGRecommendations = async (
  businessData: Business,
  assessmentResults: ESGAssessment
): Promise<ESGRecommendation[]> => {
  // AWS SDK v3 example code
  
  const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
  });

  const prompt = `
    Generate ESG improvement recommendations for a Malaysian ${businessData.industry} 
    company with the following assessment results: ${JSON.stringify(assessmentResults)}.
    
    Consider Malaysian ESG frameworks (NSRF, i-ESG) and provide specific, actionable 
    recommendations with timeframes and required resources.
  `;

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  const response = await bedrockClient.send(command);
  // Process response and return structured recommendations
  return parseRecommendations(response);
};

// Example AWS Lambda function for ESG processing
export const processESGAssessment = async (
  request: ESGProcessingRequest
): Promise<ESGProcessingResponse> => {
  const lambdaClient = new LambdaClient({
    region: process.env.AWS_REGION || 'ap-southeast-1'
  });

  const command = new InvokeCommand({
    FunctionName: 'esg-assessment-processor',
    Payload: JSON.stringify(request)
  });

  const response = await lambdaClient.send(command);
  return JSON.parse(new TextDecoder().decode(response.Payload));
};

// Example AWS DynamoDB integration for storing ESG data
export const saveESGAssessment = async (assessment: ESGAssessment): Promise<void> => {
  const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-1'
  });

  const command = new PutItemCommand({
    TableName: 'ESGAssessments',
    Item: marshall(assessment)
  });

  await dynamoClient.send(command);
};
*/