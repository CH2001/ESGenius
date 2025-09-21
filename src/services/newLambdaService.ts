import { Company, Assessment } from '@/types/database';
import { ESGResponse } from '@/types/esg';

export class NewLambdaService {
  private static readonly API_ENDPOINT = 'https://09aoixhak3.execute-api.us-east-1.amazonaws.com/esg';

  static async submitESGAssessment(
    company: Company,
    assessment: Assessment,
    responses: ESGResponse[],
    frameworks: string[]
  ): Promise<any> {
    console.log('Submitting ESG assessment to Lambda:', {
      company,
      assessment,
      responses,
      frameworks
    });

    try {
      const payload = {
        company: {
          id: company.id,
          name: company.name,
          industry: company.industry,
          size: company.size,
          location: company.location,
          employees: company.employees,
          revenue: company.revenue,
          establishedYear: company.established_year,
          registrationNumber: company.registration_number || ''
        },
        assessment: {
          id: assessment.id,
          frameworks: frameworks,
          responses: responses
        },
        timestamp: new Date().toISOString()
      };

      console.log('Sending payload to Lambda:', payload);

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Lambda response:', result);
      
      return result; // Return the results for visualization

    } catch (error) {
      console.error('Error submitting to Lambda:', error);
      throw error;
    }
  }
}