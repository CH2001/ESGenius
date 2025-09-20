// Mock ESG Frameworks for Malaysian Compliance with Structured Fields

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
            id: 'energy-management',
            title: 'Energy Management',
            description: 'Monitor and manage energy consumption and renewable usage',
            weight: 0.33,
            benchmark: 'Track energy consumption and implement efficiency measures',
            fields: [
              {
                id: 'monthly-electricity-spend',
                label: 'Monthly Electricity Spend',
                type: 'number',
                required: true,
                unit: 'RM',
                placeholder: 'Enter monthly electricity cost'
              },
              {
                id: 'electricity-kwh',
                label: 'Monthly Electricity Consumption (if tracked)',
                type: 'number',
                required: false,
                unit: 'kWh',
                placeholder: 'Enter kWh consumption'
              },
              {
                id: 'sub-metering',
                label: 'Presence of Sub-metering',
                type: 'boolean',
                required: true
              },
              {
                id: 'renewable-usage-type',
                label: 'Renewable Energy Usage',
                type: 'multiselect',
                required: true,
                options: ['None', 'Solar', 'Wind', 'Hybrid', 'Other']
              },
              {
                id: 'renewable-percentage',
                label: 'Renewable Energy Percentage',
                type: 'number',
                required: false,
                unit: '%',
                placeholder: 'Enter percentage if applicable'
              },
              {
                id: 'energy-efficiency-measures',
                label: 'Energy Efficiency Measures Implemented',
                type: 'boolean',
                required: true
              },
              {
                id: 'efficiency-details',
                label: 'Efficiency Measures Details',
                type: 'textarea',
                required: false,
                placeholder: 'Describe energy efficiency measures if any'
              }
            ],
            scoringGuideline: 'Score based on energy tracking completeness, renewable usage, and efficiency measures'
          },
          {
            id: 'waste-management',
            title: 'Waste Management',
            description: 'Track and manage different types of waste and recycling practices',
            weight: 0.33,
            benchmark: 'Implement comprehensive waste tracking and recycling practices',
            fields: [
              {
                id: 'waste-types',
                label: 'Types of Waste Generated',
                type: 'select',
                required: true,
                options: ['General only', 'General + Recyclable', 'General + Hazardous', 'General + E-waste', 'All types']
              },
              {
                id: 'monthly-waste-volume',
                label: 'Estimated Monthly Waste Volume',
                type: 'number',
                required: true,
                unit: 'kg',
                placeholder: 'Enter estimated volume'
              },
              {
                id: 'waste-handlers',
                label: 'Waste Handlers',
                type: 'select',
                required: true,
                options: ['Municipal only', 'Licensed only', 'Both municipal and licensed']
              },
              {
                id: 'recycling-practices',
                label: 'Active Recycling Practices',
                type: 'boolean',
                required: true
              },
              {
                id: 'recycling-details',
                label: 'Recycling Details',
                type: 'textarea',
                required: false,
                placeholder: 'Describe recycling practices if any'
              }
            ],
            scoringGuideline: 'Score based on waste type diversity tracking, proper handling, and recycling implementation'
          },
          {
            id: 'water-management',
            title: 'Water Management',
            description: 'Monitor water consumption and implement conservation measures',
            weight: 0.34,
            benchmark: 'Track water usage and implement conservation measures',
            fields: [
              {
                id: 'monthly-water-bill',
                label: 'Monthly Water Bill',
                type: 'number',
                required: true,
                unit: 'RM',
                placeholder: 'Enter monthly water cost'
              },
              {
                id: 'water-consumption-m3',
                label: 'Monthly Water Consumption (if tracked)',
                type: 'number',
                required: false,
                unit: 'm³',
                placeholder: 'Enter cubic meters'
              },
              {
                id: 'conservation-measures',
                label: 'Water Conservation Measures Implemented',
                type: 'boolean',
                required: true
              },
              {
                id: 'conservation-details',
                label: 'Conservation Measures Details',
                type: 'textarea',
                required: false,
                placeholder: 'Describe water conservation measures if any'
              }
            ],
            scoringGuideline: 'Score based on water consumption tracking and conservation initiative implementation'
          }
        ]
      },
      {
        id: 'social',
        name: 'Social',
        weight: 0.35,
        criteria: [
          {
            id: 'labor-welfare',
            title: 'Labor & Welfare',
            description: 'Ensure compliance with labor standards and employee welfare',
            weight: 0.5,
            benchmark: 'Comply with minimum wage and provide proper employee benefits',
            fields: [
              {
                id: 'minimum-wage-compliance',
                label: 'Minimum Wage Compliance',
                type: 'boolean',
                required: true
              },
              {
                id: 'lowest-wage',
                label: 'Lowest Wage Paid',
                type: 'number',
                required: true,
                unit: 'RM',
                placeholder: 'Enter lowest wage'
              },
              {
                id: 'overtime-tracking',
                label: 'Overtime Tracking and Pay',
                type: 'boolean',
                required: true
              },
              {
                id: 'statutory-contributions',
                label: 'EPF/SOCSO/EIS Contributions',
                type: 'boolean',
                required: true
              },
              {
                id: 'safety-training-frequency',
                label: 'Safety Training Frequency',
                type: 'select',
                required: true,
                options: ['None', 'Annually', 'Bi-annually', 'Quarterly', 'Monthly']
              },
              {
                id: 'incidents-12months',
                label: 'Number of Workplace Safety Incidents in Last 12 Months',
                type: 'number',
                required: true,
                unit: 'incidents',
                placeholder: 'Enter total workplace accidents, injuries, near-misses'
              }
            ],
            scoringGuideline: 'Score based on wage compliance, benefits provision, and safety record'
          },
          {
            id: 'social-inclusion',
            title: 'Social Inclusion',
            description: 'Promote diversity and non-discrimination in the workplace',
            weight: 0.5,
            benchmark: 'Maintain gender balance and implement non-discrimination policies',
            fields: [
              {
                id: 'gender-ratio-male',
                label: 'Male Employees (%)',
                type: 'number',
                required: true,
                unit: '%',
                placeholder: 'Enter male percentage'
              },
              {
                id: 'gender-ratio-female',
                label: 'Female Employees (%)',
                type: 'number',
                required: true,
                unit: '%',
                placeholder: 'Enter female percentage'
              },
              {
                id: 'non-discrimination-policy',
                label: 'Non-discrimination Policy in Place',
                type: 'boolean',
                required: true
              },
              {
                id: 'inclusion-details',
                label: 'Inclusion Initiatives Details',
                type: 'textarea',
                required: false,
                placeholder: 'Describe any diversity and inclusion initiatives'
              }
            ],
            scoringGuideline: 'Score based on gender balance and formal non-discrimination policy implementation'
          }
        ]
      },
      {
        id: 'governance',
        name: 'Governance',
        weight: 0.25,
        criteria: [
          {
            id: 'governance-framework',
            title: 'Governance Framework',
            description: 'Implement proper governance structures and policies',
            weight: 1.0,
            benchmark: 'Establish comprehensive governance framework with proper policies',
            fields: [
              {
                id: 'code-of-ethics',
                label: 'Code of Ethics in Place',
                type: 'boolean',
                required: true
              },
              {
                id: 'anti-corruption-policy',
                label: 'Anti-corruption Policy in Place',
                type: 'boolean',
                required: true
              },
              {
                id: 'supplier-esg-policy',
                label: 'Supplier ESG Policy in Place',
                type: 'boolean',
                required: true
              },
              {
                id: 'esg-committee-owner',
                label: 'ESG Committee/Owner Designated',
                type: 'boolean',
                required: true
              },
              {
                id: 'governance-details',
                label: 'Governance Implementation Details',
                type: 'textarea',
                required: false,
                placeholder: 'Describe governance structures and implementation status'
              }
            ],
            scoringGuideline: 'Score based on presence and implementation of key governance policies and structures'
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
            fields: [
              {
                id: 'supplier-assessment',
                label: 'Supplier ESG Assessment Conducted',
                type: 'boolean',
                required: true
              },
              {
                id: 'supplier-compliance-rate',
                label: 'Supplier ESG Compliance Rate',
                type: 'number',
                required: false,
                unit: '%',
                placeholder: 'Enter percentage of compliant suppliers'
              }
            ],
            scoringGuideline: 'Score based on supplier ESG compliance percentage'
          },
          {
            id: 'innovation',
            title: 'Sustainable Innovation & Technology',
            description: 'Adopt sustainable technologies and innovation practices',
            weight: 0.5,
            benchmark: '5% of revenue invested in sustainable innovation',
            fields: [
              {
                id: 'innovation-investment',
                label: 'Annual Innovation Investment',
                type: 'number',
                required: true,
                unit: 'RM',
                placeholder: 'Enter annual investment amount'
              },
              {
                id: 'sustainability-focus',
                label: 'Innovation Has Sustainability Focus',
                type: 'boolean',
                required: true
              }
            ],
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