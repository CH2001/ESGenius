import { ScoringRubric, CompanyScore, OpportunityRecommendation } from '@/types/scoring';

export const defaultScoringRubric: ScoringRubric = {
  environmental: {
    weight: 0.40, // 40%
    categories: [
      {
        id: 'waste-management',
        name: 'Waste Management',
        weight: 0.30,
        criteria: [
          {
            id: 'waste-reduction',
            title: 'Waste Reduction Programs',
            description: 'Implementation of waste minimization strategies',
            maxScore: 100,
            weight: 0.40
          },
          {
            id: 'recycling',
            title: 'Recycling Initiatives',
            description: 'Active recycling and circular economy practices',
            maxScore: 100,
            weight: 0.35
          },
          {
            id: 'waste-tracking',
            title: 'Waste Monitoring',
            description: 'Systems for tracking and reporting waste metrics',
            maxScore: 100,
            weight: 0.25
          }
        ]
      },
      {
        id: 'energy-efficiency',
        name: 'Energy Efficiency',
        weight: 0.35,
        criteria: [
          {
            id: 'renewable-energy',
            title: 'Renewable Energy Usage',
            description: 'Adoption of solar, wind, or other renewable energy sources',
            maxScore: 100,
            weight: 0.45
          },
          {
            id: 'energy-monitoring',
            title: 'Energy Consumption Monitoring',
            description: 'Systems to track and optimize energy usage',
            maxScore: 100,
            weight: 0.30
          },
          {
            id: 'energy-efficiency-measures',
            title: 'Efficiency Improvements',
            description: 'LED lighting, efficient equipment, building optimization',
            maxScore: 100,
            weight: 0.25
          }
        ]
      },
      {
        id: 'environmental-compliance',
        name: 'Environmental Compliance',
        weight: 0.35,
        criteria: [
          {
            id: 'environmental-permits',
            title: 'Environmental Permits & Licenses',
            description: 'Valid environmental permits and regulatory compliance',
            maxScore: 100,
            weight: 0.40
          },
          {
            id: 'environmental-reporting',
            title: 'Environmental Reporting',
            description: 'Regular environmental impact reporting and disclosure',
            maxScore: 100,
            weight: 0.35
          },
          {
            id: 'pollution-control',
            title: 'Pollution Prevention',
            description: 'Measures to prevent air, water, and soil pollution',
            maxScore: 100,
            weight: 0.25
          }
        ]
      }
    ]
  },
  social: {
    weight: 0.35, // 35%
    categories: [
      {
        id: 'labor-practices',
        name: 'Labor Practices',
        weight: 0.40,
        criteria: [
          {
            id: 'fair-wages',
            title: 'Fair Wages & Benefits',
            description: 'Competitive compensation and comprehensive benefits',
            maxScore: 100,
            weight: 0.35
          },
          {
            id: 'worker-safety',
            title: 'Workplace Safety',
            description: 'Health and safety programs and incident prevention',
            maxScore: 100,
            weight: 0.40
          },
          {
            id: 'training-development',
            title: 'Training & Development',
            description: 'Employee skill development and career advancement programs',
            maxScore: 100,
            weight: 0.25
          }
        ]
      },
      {
        id: 'community-engagement',
        name: 'Community Engagement',
        weight: 0.30,
        criteria: [
          {
            id: 'local-hiring',
            title: 'Local Employment',
            description: 'Hiring from local communities and supporting local economy',
            maxScore: 100,
            weight: 0.40
          },
          {
            id: 'community-programs',
            title: 'Community Programs',
            description: 'Corporate social responsibility and community involvement',
            maxScore: 100,
            weight: 0.35
          },
          {
            id: 'stakeholder-engagement',
            title: 'Stakeholder Engagement',
            description: 'Regular communication with community stakeholders',
            maxScore: 100,
            weight: 0.25
          }
        ]
      },
      {
        id: 'diversity-inclusion',
        name: 'Diversity & Inclusion',
        weight: 0.30,
        criteria: [
          {
            id: 'gender-equality',
            title: 'Gender Equality',
            description: 'Equal opportunities and representation across genders',
            maxScore: 100,
            weight: 0.40
          },
          {
            id: 'minority-inclusion',
            title: 'Minority Inclusion',
            description: 'Inclusive hiring and promotion of underrepresented groups',
            maxScore: 100,
            weight: 0.35
          },
          {
            id: 'anti-discrimination',
            title: 'Anti-Discrimination Policies',
            description: 'Clear policies preventing workplace discrimination',
            maxScore: 100,
            weight: 0.25
          }
        ]
      }
    ]
  },
  governance: {
    weight: 0.25, // 25%
    categories: [
      {
        id: 'corporate-governance',
        name: 'Corporate Governance',
        weight: 0.45,
        criteria: [
          {
            id: 'board-structure',
            title: 'Board Structure & Independence',
            description: 'Independent directors and diverse board composition',
            maxScore: 100,
            weight: 0.35
          },
          {
            id: 'transparency',
            title: 'Transparency & Disclosure',
            description: 'Regular financial and operational reporting',
            maxScore: 100,
            weight: 0.40
          },
          {
            id: 'stakeholder-rights',
            title: 'Stakeholder Rights',
            description: 'Protection of shareholder and stakeholder interests',
            maxScore: 100,
            weight: 0.25
          }
        ]
      },
      {
        id: 'compliance-ethics',
        name: 'Compliance & Ethics',
        weight: 0.35,
        criteria: [
          {
            id: 'code-of-conduct',
            title: 'Code of Conduct',
            description: 'Clear ethical guidelines and enforcement mechanisms',
            maxScore: 100,
            weight: 0.40
          },
          {
            id: 'regulatory-compliance',
            title: 'Regulatory Compliance',
            description: 'Adherence to all applicable laws and regulations',
            maxScore: 100,
            weight: 0.35
          },
          {
            id: 'anti-corruption',
            title: 'Anti-Corruption Measures',
            description: 'Policies and practices to prevent corruption and bribery',
            maxScore: 100,
            weight: 0.25
          }
        ]
      },
      {
        id: 'risk-management',
        name: 'Risk Management',
        weight: 0.20,
        criteria: [
          {
            id: 'risk-assessment',
            title: 'Risk Assessment Framework',
            description: 'Systematic identification and assessment of business risks',
            maxScore: 100,
            weight: 0.50
          },
          {
            id: 'risk-mitigation',
            title: 'Risk Mitigation Strategies',
            description: 'Effective strategies to manage identified risks',
            maxScore: 100,
            weight: 0.50
          }
        ]
      }
    ]
  }
};

export const mockOpportunities: OpportunityRecommendation[] = [
  {
    id: 'green-tech-fund',
    type: 'grant',
    title: 'Malaysia Green Technology Financing Scheme (GTFS)',
    description: 'Up to RM 50 million funding for green technology adoption and development',
    eligibilityScore: 85,
    potentialValue: 'RM 5M - RM 50M',
    provider: 'Malaysia Green Technology Corporation (GreenTech Malaysia)',
    deadline: new Date('2024-12-31'),
    requirements: [
      'Must be a Malaysian company',
      'Green technology project with clear environmental benefits',
      'Minimum 60% local content',
      'ESG compliance score above 70%'
    ],
    applicationUrl: 'https://www.gtfs.my',
    priority: 'high'
  },
  {
    id: 'sme-esg-incentive',
    type: 'tax-deduction',
    title: 'SME ESG Compliance Tax Incentive',
    description: 'Double deduction for ESG compliance and sustainability initiatives',
    eligibilityScore: 78,
    potentialValue: 'Up to 200% tax deduction',
    provider: 'Malaysian Investment Development Authority (MIDA)',
    requirements: [
      'Valid ESG assessment report',
      'Investment in sustainability initiatives',
      'Employment of local workforce',
      'Regular ESG reporting'
    ],
    priority: 'high'
  },
  {
    id: 'sustainable-supply-chain',
    type: 'business-opportunity',
    title: 'Sustainable Supply Chain Partnership',
    description: 'Partnership opportunities with MNCs requiring ESG-compliant suppliers',
    eligibilityScore: 72,
    potentialValue: 'RM 500K - RM 10M contracts',
    provider: 'Malaysia External Trade Development Corporation (MATRADE)',
    requirements: [
      'ESG certification or high compliance score',
      'ISO 14001 or equivalent environmental certification',
      'Proven track record in sustainability',
      'Export readiness assessment'
    ],
    priority: 'medium'
  },
  {
    id: 'climate-resilience-grant',
    type: 'grant',
    title: 'Climate Resilience and Adaptation Grant',
    description: 'Funding for climate adaptation and resilience building projects',
    eligibilityScore: 68,
    potentialValue: 'RM 100K - RM 2M',
    provider: 'Ministry of Environment and Water (KASA)',
    deadline: new Date('2024-10-15'),
    requirements: [
      'Climate risk assessment completed',
      'Adaptation plan developed',
      'Community impact demonstration',
      'Environmental compliance record'
    ],
    applicationUrl: 'https://www.kasa.gov.my/grants',
    priority: 'medium'
  },
  {
    id: 'green-bond-financing',
    type: 'financing',
    title: 'Green Bond Financing Program',
    description: 'Access to green bonds for sustainable business expansion',
    eligibilityScore: 82,
    potentialValue: 'RM 1M - RM 20M',
    provider: 'Securities Commission Malaysia (SC)',
    requirements: [
      'Green project classification',
      'Independent ESG verification',
      'Use of proceeds framework',
      'Impact reporting commitment'
    ],
    priority: 'high'
  }
];

export const calculateComplianceLevel = (score: number): 'needs-foundation' | 'progressing' | 'financing-ready' => {
  if (score < 50) return 'needs-foundation';
  if (score < 75) return 'progressing';
  return 'financing-ready';
};

export const getComplianceLevelColor = (level: 'needs-foundation' | 'progressing' | 'financing-ready'): string => {
  switch (level) {
    case 'needs-foundation': return 'destructive';
    case 'progressing': return 'warning';
    case 'financing-ready': return 'success';
  }
};

export const getComplianceLevelLabel = (level: 'needs-foundation' | 'progressing' | 'financing-ready'): string => {
  switch (level) {
    case 'needs-foundation': return 'Needs Foundation (0-49)';
    case 'progressing': return 'Progressing (50-74)';
    case 'financing-ready': return 'Financing-Ready (75+)';
  }
};