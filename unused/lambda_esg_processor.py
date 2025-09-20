import json
import boto3
from typing import Dict, List, Any
from dataclasses import dataclass, asdict
import logging
import os

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Configuration constants for Lambda endpoint and AWS region
# These can be overridden by environment variables if available
LAMBDA_ENDPOINT_URL = os.getenv('LAMBDA_ENDPOINT_URL', 'https://your-lambda-endpoint.amazonaws.com')
AWS_REGION = os.getenv('AWS_REGION', 'ap-southeast-1')

# Initialize AWS Bedrock client with configurable region
bedrock_runtime = boto3.client('bedrock-runtime', region_name=AWS_REGION)

@dataclass
class ESGScoring:
    environmental_score: float
    social_score: float
    governance_score: float
    overall_score: float
    compliance_level: str
    
@dataclass
class ESGRecommendation:
    id: str
    type: str  # 'improvement', 'grant', 'market_opportunity', 'certification'
    title: str
    description: str
    priority: str  # 'high', 'medium', 'low'
    estimatedImpact: str
    timeframe: str
    requiredActions: List[str]
    relatedCriteria: List[str]
    resources: List[Dict[str, str]]
    
@dataclass
class GrantOpportunity:
    name: str
    provider: str
    amount: str
    eligibility_match_score: float
    description: str
    deadline: str
    requirements: List[str]

class ESGProcessor:
    def __init__(self):
        self.model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
        
    def analyze_esg_assessment(self, business_data: Dict, responses: List[Dict], framework: str) -> Dict[str, Any]:
        """
        Main function to analyze ESG assessment using AWS Bedrock LLM
        """
        try:
            # Calculate ESG scores using LLM
            scores = self._calculate_esg_scores(business_data, responses, framework)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(business_data, responses, scores)
            
            # Find matching grants and opportunities
            opportunities = self._find_grant_opportunities(business_data, scores)
            
            return {
                "scores": asdict(scores),
                "recommendations": [asdict(rec) for rec in recommendations],
                "opportunities": [asdict(opp) for opp in opportunities],
                "analysis_timestamp": json.dumps({"timestamp": "2024-01-01T00:00:00Z"}),
                "compliance_gaps": self._identify_compliance_gaps(responses, scores)
            }
            
        except Exception as e:
            logger.error(f"Error in ESG analysis: {str(e)}")
            return self._fallback_analysis(business_data, responses)
    
    def _calculate_esg_scores(self, business_data: Dict, responses: List[Dict], framework: str) -> ESGScoring:
        """
        Calculate ESG scores using Claude 3 Sonnet via AWS Bedrock
        """
        prompt = self._build_scoring_prompt(business_data, responses, framework)
        
        try:
            response = bedrock_runtime.invoke_model(
                modelId=self.model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 2000,
                    "messages": [{
                        "role": "user",
                        "content": prompt
                    }],
                    "temperature": 0.3
                })
            )
            
            result = json.loads(response['body'].read())
            scores_text = result['content'][0]['text']
            
            # Parse LLM response to extract scores
            return self._parse_scores_from_llm(scores_text)
            
        except Exception as e:
            logger.error(f"Error calculating scores: {str(e)}")
            return self._fallback_scores(responses)
    
    def _generate_recommendations(self, business_data: Dict, responses: List[Dict], scores: ESGScoring) -> List[ESGRecommendation]:
        """
        Generate ESG improvement recommendations using LLM
        """
        prompt = f"""
        Based on the ESG assessment results for {business_data.get('name', 'this company')} 
        in the {business_data.get('industry', 'unknown')} industry with {business_data.get('employees', 'unknown')} employees:
        
        ESG Scores:
        - Environmental: {scores.environmental_score}
        - Social: {scores.social_score} 
        - Governance: {scores.governance_score}
        - Overall: {scores.overall_score}
        
        Assessment Responses: {json.dumps(responses[:3])}  # Limit for token efficiency
        
        Generate 3-5 specific, actionable ESG improvement recommendations for Malaysian SMEs.
        Focus on practical steps with clear timeframes and expected impacts.
        
        Return as JSON array with format:
        [{{
            "id": "rec_001",
            "type": "improvement",
            "title": "Short recommendation title",
            "description": "Detailed recommendation description",
            "priority": "high|medium|low",
            "estimatedImpact": "Expected impact description with specific metrics",
            "timeframe": "Implementation timeframe (e.g., 3-6 months)",
            "requiredActions": ["Specific action 1", "Specific action 2", "Specific action 3"],
            "relatedCriteria": ["Environmental management", "Energy efficiency"],
            "resources": [{{"title": "Resource name", "type": "document", "description": "Resource description"}}]
        }}]
        """
        
        try:
            response = bedrock_runtime.invoke_model(
                modelId=self.model_id,
                contentType="application/json", 
                accept="application/json",
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 3000,
                    "messages": [{
                        "role": "user",
                        "content": prompt
                    }],
                    "temperature": 0.5
                })
            )
            
            result = json.loads(response['body'].read())
            recommendations_text = result['content'][0]['text']
            
            # Parse JSON from LLM response
            recommendations_data = self._extract_json_from_text(recommendations_text)
            
            # Convert to ESGRecommendation objects with proper field mapping
            recommendations = []
            for i, rec in enumerate(recommendations_data[:5]):
                recommendations.append(ESGRecommendation(
                    id=rec.get('id', f'rec_{i+1:03d}'),
                    type=rec.get('type', 'improvement'),
                    title=rec.get('title', 'ESG Improvement'),
                    description=rec.get('description', 'No description available'),
                    priority=rec.get('priority', 'medium').lower(),
                    estimatedImpact=rec.get('estimatedImpact', 'Positive impact on ESG score'),
                    timeframe=rec.get('timeframe', '3-6 months'),
                    requiredActions=rec.get('requiredActions', ['Review current practices', 'Implement improvements']),
                    relatedCriteria=rec.get('relatedCriteria', []),
                    resources=rec.get('resources', [])
                ))
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return self._fallback_recommendations(business_data, scores)
    
    def _find_grant_opportunities(self, business_data: Dict, scores: ESGScoring) -> List[GrantOpportunity]:
        """
        Find matching Malaysian government grants and opportunities
        """
        # Malaysian grant database (simplified for demo)
        available_grants = [
            {
                "name": "Malaysian Green Technology Financing Scheme",
                "provider": "Malaysia Green Technology Corporation",
                "amount": "Up to RM 50 million",
                "description": "Funding for green technology adoption and sustainable practices",
                "deadline": "2024-12-31",
                "requirements": ["Green tech project", "60% local content", "Environmental impact assessment"],
                "min_environmental_score": 65
            },
            {
                "name": "SME ESG Excellence Grant",
                "provider": "SME Corporation Malaysia", 
                "amount": "Up to RM 200,000",
                "description": "Grant for SMEs achieving ESG excellence",
                "deadline": "2024-06-30",
                "requirements": ["SME status", "ESG assessment completion", "Sustainability plan"],
                "min_overall_score": 60
            },
            {
                "name": "Digital Sustainability Fund",
                "provider": "Malaysia Digital Economy Corporation",
                "amount": "Up to RM 1 million",
                "description": "Digital solutions for sustainability and ESG compliance",
                "deadline": "2024-09-30", 
                "requirements": ["Digital solution focus", "Sustainability metrics", "Malaysian company"],
                "min_governance_score": 70
            }
        ]
        
        opportunities = []
        for grant in available_grants:
            eligibility_score = self._calculate_eligibility_score(grant, scores, business_data)
            if eligibility_score > 0.5:  # 50% match threshold
                opportunities.append(GrantOpportunity(
                    name=grant["name"],
                    provider=grant["provider"],
                    amount=grant["amount"],
                    eligibility_match_score=eligibility_score,
                    description=grant["description"],
                    deadline=grant["deadline"],
                    requirements=grant["requirements"]
                ))
        
        # Sort by eligibility score
        return sorted(opportunities, key=lambda x: x.eligibility_match_score, reverse=True)[:3]
    
    def _build_scoring_prompt(self, business_data: Dict, responses: List[Dict], framework: str) -> str:
        return f"""
        Analyze this Malaysian SME's ESG assessment and provide numerical scores (0-100):

        Company: {business_data.get('name', 'Unknown')}
        Industry: {business_data.get('industry', 'Unknown')}
        Size: {business_data.get('size', 'Unknown')} ({business_data.get('employees', 'Unknown')} employees)
        Framework: {framework}

        Assessment Responses: {json.dumps(responses[:5])}  # Limit for tokens

        Provide scores in this exact format:
        Environmental Score: [0-100]
        Social Score: [0-100] 
        Governance Score: [0-100]
        Overall Score: [0-100]
        Compliance Level: [Excellent|Good|Needs Improvement|Poor]

        Consider Malaysian ESG standards and SME context in scoring.
        """
    
    def _parse_scores_from_llm(self, llm_text: str) -> ESGScoring:
        """Parse scores from LLM response text"""
        try:
            # Extract scores using simple parsing
            lines = llm_text.split('\n')
            scores = {}
            
            for line in lines:
                if 'Environmental Score:' in line:
                    scores['environmental'] = float(line.split(':')[1].strip())
                elif 'Social Score:' in line:
                    scores['social'] = float(line.split(':')[1].strip()) 
                elif 'Governance Score:' in line:
                    scores['governance'] = float(line.split(':')[1].strip())
                elif 'Overall Score:' in line:
                    scores['overall'] = float(line.split(':')[1].strip())
                elif 'Compliance Level:' in line:
                    scores['compliance'] = line.split(':')[1].strip()
            
            return ESGScoring(
                environmental_score=scores.get('environmental', 65.0),
                social_score=scores.get('social', 70.0),
                governance_score=scores.get('governance', 60.0),
                overall_score=scores.get('overall', 65.0),
                compliance_level=scores.get('compliance', 'Good')
            )
            
        except Exception as e:
            logger.error(f"Error parsing scores: {str(e)}")
            return self._fallback_scores([])
    
    def _extract_json_from_text(self, text: str) -> List[Dict]:
        """Extract JSON array from LLM text response"""
        try:
            # Find JSON array in text
            start = text.find('[')
            end = text.rfind(']') + 1
            if start != -1 and end > start:
                json_str = text[start:end]
                return json.loads(json_str)
        except:
            pass
        return []
    
    def _calculate_eligibility_score(self, grant: Dict, scores: ESGScoring, business_data: Dict) -> float:
        """Calculate eligibility score for a grant opportunity"""
        score = 0.0
        
        # Check score requirements
        if grant.get('min_environmental_score', 0) <= scores.environmental_score:
            score += 0.3
        if grant.get('min_social_score', 0) <= scores.social_score:
            score += 0.3
        if grant.get('min_governance_score', 0) <= scores.governance_score:
            score += 0.3
        if grant.get('min_overall_score', 0) <= scores.overall_score:
            score += 0.4
            
        # Business criteria matching
        if business_data.get('size') in ['micro', 'small', 'medium']:
            score += 0.2
            
        return min(score, 1.0)
    
    def _identify_compliance_gaps(self, responses: List[Dict], scores: ESGScoring) -> List[str]:
        """Identify key compliance gaps"""
        gaps = []
        
        if scores.environmental_score < 60:
            gaps.append("Environmental management systems need strengthening")
        if scores.social_score < 60:
            gaps.append("Workplace safety and employee welfare require attention")
        if scores.governance_score < 60:
            gaps.append("Corporate governance framework needs implementation")
            
        return gaps
    
    def _fallback_scores(self, responses: List[Dict]) -> ESGScoring:
        """Provide fallback scores when LLM fails"""
        # Simple scoring based on response completeness
        base_score = 65 + (len(responses) * 2)
        return ESGScoring(
            environmental_score=min(base_score + 5, 100),
            social_score=min(base_score, 100),
            governance_score=min(base_score - 5, 100),
            overall_score=min(base_score, 100),
            compliance_level="Good" if base_score > 70 else "Needs Improvement"
        )
    
    def _fallback_recommendations(self, business_data: Dict = None, scores: ESGScoring = None) -> List[ESGRecommendation]:
        """Generate fallback recommendations using LLM"""
        try:
            # Use LLM to generate contextual recommendations
            context = f"""
            Generate 4-5 diverse ESG improvement recommendations for Malaysian SMEs.
            
            Business Context: {business_data.get('industry', 'General') if business_data else 'General'} industry
            Company Size: {business_data.get('size', 'SME') if business_data else 'SME'}
            
            Focus Areas (vary priorities and timeframes):
            - Environmental: Energy efficiency, waste reduction, sustainable sourcing
            - Social: Employee welfare, community engagement, workplace safety
            - Governance: Transparency, ethics, stakeholder engagement
            - Operational: Digital transformation, supply chain sustainability
            
            Return as JSON array with this exact format:
            [{{
                "id": "rec_001",
                "type": "improvement",
                "title": "Specific actionable title",
                "description": "Detailed implementation description",
                "priority": "high|medium|low",
                "estimatedImpact": "Specific measurable outcomes with percentages/metrics",
                "timeframe": "Realistic timeframe (e.g., 2-3 months, 6-12 months)",
                "requiredActions": ["Action 1", "Action 2", "Action 3", "Action 4"],
                "relatedCriteria": ["ESG Category 1", "ESG Category 2"],
                "resources": [{{"title": "Resource name", "type": "document|website|tool", "description": "Brief description"}}]
            }}]
            
            Ensure recommendations are practical for Malaysian SMEs with limited resources.
            """
            
            response = bedrock_runtime.invoke_model(
                modelId=self.model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 4000,
                    "messages": [{
                        "role": "user",
                        "content": context
                    }],
                    "temperature": 0.7
                })
            )
            
            result = json.loads(response['body'].read())
            recommendations_text = result['content'][0]['text']
            
            # Parse JSON from LLM response
            recommendations_data = self._extract_json_from_text(recommendations_text)
            
            if recommendations_data:
                recommendations = []
                for i, rec in enumerate(recommendations_data[:5]):
                    recommendations.append(ESGRecommendation(
                        id=rec.get('id', f'rec_{i+1:03d}'),
                        type=rec.get('type', 'improvement'),
                        title=rec.get('title', 'ESG Improvement'),
                        description=rec.get('description', 'Improve ESG practices'),
                        priority=rec.get('priority', 'medium').lower(),
                        estimatedImpact=rec.get('estimatedImpact', 'Positive impact on ESG performance'),
                        timeframe=rec.get('timeframe', '3-6 months'),
                        requiredActions=rec.get('requiredActions', ['Review current practices', 'Implement improvements']),
                        relatedCriteria=rec.get('relatedCriteria', ['ESG Management']),
                        resources=rec.get('resources', [])
                    ))
                return recommendations
                
        except Exception as e:
            logger.error(f"Error generating LLM fallback recommendations: {str(e)}")
        
        # Ultimate fallback with static recommendations
        return [
            ESGRecommendation(
                id="rec_001",
                type="improvement",
                title="Implement Energy Management System",
                description="Establish systematic tracking and reduction of energy consumption across all operations",
                priority="high",
                estimatedImpact="10-15% reduction in energy costs and 8-12% reduction in carbon footprint",
                timeframe="3-6 months",
                requiredActions=["Install smart sub-metering systems", "Conduct comprehensive energy audit", "Set measurable reduction targets", "Train staff on energy monitoring"],
                relatedCriteria=["Environmental Management", "Energy Efficiency"],
                resources=[{"title": "Energy Audit Guide", "type": "document", "description": "Comprehensive guide for conducting energy audits"}]
            ),
            ESGRecommendation(
                id="rec_002",
                type="improvement",
                title="Enhance Workplace Safety Program",
                description="Strengthen safety training and incident reporting systems to improve workplace culture",
                priority="high",
                estimatedImpact="50% reduction in workplace incidents and 20% decrease in insurance premiums",
                timeframe="2-4 months",
                requiredActions=["Update safety protocols and procedures", "Increase training frequency to monthly", "Implement digital incident reporting system", "Conduct regular safety audits"],
                relatedCriteria=["Workplace Safety", "Employee Welfare"],
                resources=[{"title": "DOSH Safety Guidelines", "type": "website", "description": "Malaysian workplace safety regulations"}]
            ),
            ESGRecommendation(
                id="rec_003",
                type="improvement", 
                title="Establish Waste Reduction Program",
                description="Implement comprehensive waste management and circular economy practices",
                priority="medium",
                estimatedImpact="30-40% reduction in waste disposal costs and improved environmental compliance",
                timeframe="4-6 months",
                requiredActions=["Conduct waste audit", "Implement recycling programs", "Partner with waste management vendors", "Train employees on waste reduction"],
                relatedCriteria=["Environmental Management", "Waste Management"],
                resources=[{"title": "Malaysian Waste Management Guidelines", "type": "document", "description": "Government guidelines for SME waste management"}]
            ),
            ESGRecommendation(
                id="rec_004",
                type="improvement",
                title="Develop Employee Engagement Initiative",
                description="Create structured programs for employee wellness, development, and community involvement",
                priority="medium",
                estimatedImpact="25% improvement in employee retention and 15% increase in productivity",
                timeframe="3-5 months",
                requiredActions=["Launch employee wellness program", "Establish skills development pathways", "Create community volunteer opportunities", "Implement feedback systems"],
                relatedCriteria=["Employee Welfare", "Community Engagement"],
                resources=[{"title": "Employee Engagement Best Practices", "type": "guide", "description": "Comprehensive guide for SME employee programs"}]
            )
        ]
    
    def _fallback_analysis(self, business_data: Dict, responses: List[Dict]) -> Dict[str, Any]:
        """Provide fallback analysis when main processing fails"""
        fallback_scores = self._fallback_scores(responses)
        return {
            "scores": asdict(fallback_scores),
            "recommendations": [asdict(rec) for rec in self._fallback_recommendations(business_data, fallback_scores)],
            "opportunities": [],
            "analysis_timestamp": json.dumps({"timestamp": "2024-01-01T00:00:00Z"}),
            "compliance_gaps": ["Assessment processing encountered issues - manual review recommended"]
        }

def lambda_handler(event, context):
    """
    AWS Lambda entry point for ESG assessment processing
    """
    try:
        # Parse incoming request
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', event)
        
        business_data = body.get('business', {})
        responses = body.get('responses', [])
        framework = body.get('framework', 'NSRF')
        
        logger.info(f"Processing ESG assessment for: {business_data.get('name', 'Unknown Company')}")
        
        # Initialize processor and analyze
        processor = ESGProcessor()
        results = processor.analyze_esg_assessment(business_data, responses, framework)
        
        # Return successful response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'success': True,
                'data': results,
                'message': 'ESG assessment processed successfully'
            })
        }
        
    except Exception as e:
        logger.error(f"Lambda execution error: {str(e)}")
        
        # Return error response with fallback
        processor = ESGProcessor()
        fallback_results = processor._fallback_analysis({}, [])
        
        return {
            'statusCode': 200,  # Still return 200 with fallback data
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type', 
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'success': False,
                'data': fallback_results,
                'error': str(e),
                'message': 'ESG assessment processed with fallback data'
            })
        }

# Requirements for deployment:
# boto3==1.34.0
# botocore==1.34.0