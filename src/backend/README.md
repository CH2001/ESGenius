# ESGenius Backend Integration

This folder contains placeholder code and documentation for future AWS and Python backend integration.

## Architecture Overview

```
Frontend (React/Next.js) → API Gateway → Lambda Functions → DocumentDB/DynamoDB
                                     ↓
                              LLM Services (Bedrock)
```

## Planned Components

### 1. LLM Analysis Service (`llm_service.py`)
- **Purpose**: Analyze company ESG data against frameworks using AWS Bedrock
- **Models**: Claude 3, GPT-4 via Bedrock
- **Functions**:
  - `analyze_esg_compliance(company_data, framework)`
  - `generate_recommendations(scores, industry)`
  - `compare_with_competitors(company, industry_benchmarks)`

### 2. Document Processing (`document_processor.py`)
- **Purpose**: Process uploaded company documents (policies, reports, certificates)
- **Services**: AWS Textract, Comprehend
- **Functions**:
  - `extract_text_from_pdf(document)`
  - `classify_document_type(content)`
  - `extract_esg_metrics(document_content)`

### 3. Scoring Engine (`scoring_engine.py`)
- **Purpose**: Calculate weighted ESG scores based on frameworks
- **Weights**: E(40%), S(35%), G(25%) for NSRF
- **Functions**:
  - `calculate_weighted_score(responses, weights)`
  - `determine_compliance_level(score)`
  - `generate_action_items(weak_areas)`

### 4. Opportunities Matcher (`opportunities_matcher.py`)
- **Purpose**: Match companies with relevant grants and opportunities
- **Data Sources**: Malaysian government APIs, grant databases
- **Functions**:
  - `find_eligible_grants(company_profile, esg_score)`
  - `calculate_match_probability(company, opportunity)`
  - `prioritize_opportunities(matches, company_goals)`

## AWS Services Integration

### Database
- **DocumentDB**: Store ESG frameworks, assessment results, company profiles
- **DynamoDB**: Cache frequently accessed data, user sessions
- **S3**: Store uploaded documents, generated reports

### Compute
- **Lambda Functions**: Serverless API endpoints
- **ECS/Fargate**: For heavy document processing tasks

### AI/ML
- **Bedrock**: LLM services for analysis and recommendations
- **Textract**: Document text extraction
- **Comprehend**: Sentiment analysis and entity extraction

### Security
- **Cognito**: User authentication and authorization
- **IAM**: Fine-grained access control
- **KMS**: Encrypt sensitive company data

## Implementation Phases

### Phase 1: Basic API Setup
- [ ] Lambda functions for CRUD operations
- [ ] DocumentDB connection and basic queries
- [ ] Authentication with Cognito

### Phase 2: Document Processing
- [ ] S3 upload functionality
- [ ] Textract integration for PDF processing
- [ ] Document classification system

### Phase 3: LLM Integration
- [ ] Bedrock setup with Claude 3
- [ ] ESG analysis prompts and workflows
- [ ] Recommendation generation

### Phase 4: Advanced Features
- [ ] Real-time compliance monitoring
- [ ] Competitor benchmarking
- [ ] Automated report generation

## Environment Variables Required

```
AWS_REGION=ap-southeast-1
DOCUMENTDB_CONNECTION_STRING=mongodb://...
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
S3_BUCKET_NAME=esgenius-documents
COGNITO_USER_POOL_ID=...
```

## API Endpoints (Planned)

```
POST /api/v1/assessment/submit
GET  /api/v1/assessment/{id}/results
POST /api/v1/documents/upload
GET  /api/v1/opportunities/search
POST /api/v1/analysis/llm-review
```

## Cost Optimization

- Use Lambda for compute to pay only for usage
- Implement caching with DynamoDB for frequent queries
- Use S3 Intelligent Tiering for document storage
- Monitor Bedrock token usage and implement rate limiting

## Security Considerations

- Encrypt all company data at rest and in transit
- Implement audit logging for all data access
- Use least privilege access for all services
- Regular security assessments and penetration testing

---

*Note: This is a planning document. Actual implementation will require AWS account setup, proper IAM roles, and production-ready error handling.*