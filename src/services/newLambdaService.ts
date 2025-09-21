import { Company, Profile, Assessment, AssessmentResult } from '@/types/database';
import { ESGResponse } from '@/types/esg';
import { ProfileService } from './profileService';

export interface ESGiLambdaRequest {
  data: {
    meta: {
      company_name: string;
    };
    environmental: {
      energy: {
        monthly_electricity_kwh?: number;
        monthly_electricity_spend_rm?: number;
        renewable_used?: boolean;
        renewable_types?: string[];
        efficiency_measures?: string[];
      };
      waste: {
        recycling_practices?: string[];
        recycling_rate_pct?: number;
        hazardous_waste_handling?: boolean;
      };
      water: {
        water_saving_measures?: string[];
      };
      general: {
        environmental_certifications?: string[];
      };
    };
    social: {
      compliance: {
        minimum_wage_compliance?: boolean;
        statutory_contributions_paid?: boolean;
      };
      health_safety: {
        safety_training_conducted?: boolean;
        safety_training_frequency?: string;
        incident_tracking?: boolean;
      };
      diversity_inclusion: {
        non_discrimination_policy?: boolean;
        inclusion_initiatives?: string[];
      };
      employee_engagement: {
        training_hours_per_employee?: number;
        grievance_mechanism?: boolean;
      };
    };
    governance: {
      policies: {
        code_of_ethics?: boolean;
        anti_corruption_policy?: boolean;
        whistleblowing_channel?: boolean;
      };
      management_oversight: {
        assigned_esg_owner?: string;
        esg_in_mgmt_meetings?: boolean;
      };
      supply_chain: {
        supplier_esg_policy?: boolean;
        esg_clauses_in_contracts?: boolean;
      };
    };
    operational_excellence: {
      supplier_assessments: {
        assess_suppliers_for_esg?: boolean;
        supplier_compliance_rate_pct?: number;
      };
      sustainable_innovation: {
        has_sustainable_products_or_processes?: boolean;
        description?: string;
        circular_practices?: string[];
      };
      sustainable_procurement: {
        green_purchasing_policy?: boolean;
      };
    };
    capacity_financing: {
      training: {
        participated_in_esg_training?: boolean;
        number_of_staff_trained?: number;
      };
      financing: {
        accessed_green_financing?: boolean;
        applied_government_incentives?: string[];
      };
    };
  };
}

export interface ESGiLambdaResponse {
  ok: boolean;
  framework: string;
  report: {
    header: {
      company_name: string;
      assessment_date: string;
      prepared_by: string;
      framework: string;
      readiness_stage: string;
    };
    executive_summary: string;
    baseline_checklist: {
      [category: string]: Array<{
        label: string;
        status: string;
        note?: string;
      }>;
    };
    gaps_and_risks: Array<{
      gap: string;
      why_it_matters: string;
      urgency: string;
    }>;
    prioritized_improvements: Array<{
      action: string;
      owner: string;
      timeline: string;
      expected_benefit: string;
      evidence_required: string;
    }>;
    financing_and_incentives: Array<{
      program_name: string;
      type: string;
      eligibility_hint: string;
      next_step_link: string;
      documents_needed: string[];
    }>;
  };
  baseline_checklist: {
    [category: string]: {
      [item: string]: string;
    };
  };
  gaps_detected: string[];
  normalized_input: any;
  kb_used: string;
}

export class NewLambdaService {
  private static readonly ESG_I_API_URL = 'https://09aoixhak3.execute-api.us-east-1.amazonaws.com/esg';

  static async submitESGAssessment(
    profile: Profile,
    company: Company,
    assessment: Assessment,
    responses: ESGResponse[],
    frameworks: string[]
  ): Promise<void> {
    console.log('=== STARTING ESG ASSESSMENT SUBMISSION ===');
    console.log('Profile:', profile);
    console.log('Company:', company);
    console.log('Assessment ID:', assessment.id);
    console.log('Selected Frameworks:', frameworks);
    console.log('ESG Responses:', responses);

    // Process each framework separately
    for (const frameworkId of frameworks) {
      console.log(`\n--- Processing Framework: ${frameworkId} ---`);
      
      if (frameworkId === 'esg-i') {
        await this.processESGiFramework(assessment.id, company, responses);
      } else {
        console.log(`Framework ${frameworkId} not implemented yet`);
        // For future frameworks, add similar processing here
      }
    }

    // Mark assessment as completed
    await ProfileService.updateAssessment(assessment.id, { status: 'completed' });
    console.log('Assessment marked as completed');
  }

  private static async processESGiFramework(
    assessmentId: string,
    company: Company,
    responses: ESGResponse[]
  ): Promise<void> {
    try {
      const lambdaRequest = this.transformToESGiRequest(company, responses);
      console.log('ESG-i Lambda Request:', JSON.stringify(lambdaRequest, null, 2));

      console.log('Sending request to ESG-i Lambda API...');
      const response = await fetch(this.ESG_I_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lambdaRequest),
      });

      console.log('Lambda API Response Status:', response.status);
      console.log('Lambda API Response Headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lambda API Error Response:', errorText);
        throw new Error(`Lambda API returned ${response.status}: ${errorText}`);
      }

      const lambdaResponse: ESGiLambdaResponse = await response.json();
      console.log('ESG-i Lambda Response:', JSON.stringify(lambdaResponse, null, 2));

      // Save the result to database
      await ProfileService.createAssessmentResult({
        assessment_id: assessmentId,
        framework: 'esg-i',
        lambda_request: lambdaRequest,
        lambda_response: lambdaResponse,
        success: lambdaResponse.ok,
        error_message: lambdaResponse.ok ? undefined : 'API returned ok: false',
      });

      console.log('✅ ESG-i framework processing completed successfully');

    } catch (error) {
      console.error('❌ Error processing ESG-i framework:', error);
      
      // Save error result to database
      await ProfileService.createAssessmentResult({
        assessment_id: assessmentId,
        framework: 'esg-i',
        lambda_request: this.transformToESGiRequest(company, responses),
        lambda_response: null,
        success: false,
        error_message: error instanceof Error ? error.message : 'Unknown error occurred',
      });

      throw error;
    }
  }

  private static transformToESGiRequest(company: Company, responses: ESGResponse[]): ESGiLambdaRequest {
    console.log('Transforming responses to ESG-i format...');
    
    // Create a map of responses by criterion ID for easy lookup
    const responseMap = new Map<string, ESGResponse>();
    responses.forEach(response => {
      responseMap.set(response.criterionId, response);
    });

    // Helper function to get field value from responses
    const getFieldValue = (criterionId: string, fieldId: string): any => {
      const response = responseMap.get(criterionId);
      if (!response?.fieldResponses) return undefined;
      return response.fieldResponses[fieldId];
    };

    // Helper function to get array field values
    const getArrayField = (criterionId: string, fieldId: string): string[] => {
      const value = getFieldValue(criterionId, fieldId);
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    };

    const requestData: ESGiLambdaRequest = {
      data: {
        meta: {
          company_name: company.name
        },
        environmental: {
          energy: {
            monthly_electricity_kwh: getFieldValue('energy-management', 'monthly-electricity-usage'),
            monthly_electricity_spend_rm: getFieldValue('energy-management', 'monthly-electricity-cost'),
            renewable_used: getFieldValue('energy-management', 'renewable-energy-use'),
            renewable_types: getArrayField('energy-management', 'renewable-types'),
            efficiency_measures: getArrayField('energy-management', 'energy-efficiency-measures')
          },
          waste: {
            recycling_practices: getArrayField('waste-management', 'recycling-practices'),
            recycling_rate_pct: getFieldValue('waste-management', 'waste-recycling-rate'),
            hazardous_waste_handling: getFieldValue('waste-management', 'hazardous-waste-management')
          },
          water: {
            water_saving_measures: getArrayField('water-management', 'water-conservation-measures')
          },
          general: {
            environmental_certifications: getArrayField('environmental-compliance', 'environmental-certifications')
          }
        },
        social: {
          compliance: {
            minimum_wage_compliance: getFieldValue('labor-welfare', 'minimum-wage-compliance'),
            statutory_contributions_paid: getFieldValue('labor-welfare', 'statutory-contributions')
          },
          health_safety: {
            safety_training_conducted: getFieldValue('health-safety', 'safety-training-program'),
            safety_training_frequency: getFieldValue('health-safety', 'training-frequency'),
            incident_tracking: getFieldValue('health-safety', 'incident-reporting-system')
          },
          diversity_inclusion: {
            non_discrimination_policy: getFieldValue('diversity-inclusion', 'non-discrimination-policy'),
            inclusion_initiatives: getArrayField('diversity-inclusion', 'inclusion-programs')
          },
          employee_engagement: {
            training_hours_per_employee: getFieldValue('employee-development', 'training-hours-per-employee'),
            grievance_mechanism: getFieldValue('employee-development', 'grievance-mechanism')
          }
        },
        governance: {
          policies: {
            code_of_ethics: getFieldValue('governance-ethics', 'code-of-ethics'),
            anti_corruption_policy: getFieldValue('governance-ethics', 'anti-corruption-policy'),
            whistleblowing_channel: getFieldValue('governance-ethics', 'whistleblowing-mechanism')
          },
          management_oversight: {
            assigned_esg_owner: getFieldValue('governance-ethics', 'esg-responsible-person'),
            esg_in_mgmt_meetings: getFieldValue('governance-ethics', 'esg-management-integration')
          },
          supply_chain: {
            supplier_esg_policy: getFieldValue('supply-chain', 'supplier-esg-policy'),
            esg_clauses_in_contracts: getFieldValue('supply-chain', 'esg-contract-clauses')
          }
        },
        operational_excellence: {
          supplier_assessments: {
            assess_suppliers_for_esg: getFieldValue('supply-chain', 'supplier-assessment'),
            supplier_compliance_rate_pct: getFieldValue('supply-chain', 'supplier-compliance-rate')
          },
          sustainable_innovation: {
            has_sustainable_products_or_processes: getFieldValue('innovation-technology', 'sustainable-products'),
            description: getFieldValue('innovation-technology', 'innovation-description'),
            circular_practices: getArrayField('innovation-technology', 'circular-economy-practices')
          },
          sustainable_procurement: {
            green_purchasing_policy: getFieldValue('supply-chain', 'green-procurement-policy')
          }
        },
        capacity_financing: {
          training: {
            participated_in_esg_training: getFieldValue('stakeholder-engagement', 'esg-training-participation'),
            number_of_staff_trained: getFieldValue('stakeholder-engagement', 'staff-trained-count')
          },
          financing: {
            accessed_green_financing: getFieldValue('financial-performance', 'green-financing-access'),
            applied_government_incentives: getArrayField('financial-performance', 'government-incentives')
          }
        }
      }
    };

    console.log('Transformed ESG-i request:', requestData);
    return requestData;
  }
}