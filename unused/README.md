# ESG Assessment Lambda Function

This folder contains the AWS Lambda function code for processing ESG assessments using AWS Bedrock.

## Files

- `lambda_esg_processor.py` - Main Lambda function for ESG analysis
- `requirements.txt` - Python dependencies

## Deployment Instructions

1. **Prepare the deployment package:**
   ```bash
   pip install -r requirements.txt -t .
   zip -r esg-processor.zip . -x "*.git*" "*.DS_Store*"
   ```

2. **Create Lambda Function:**
   - Function name: `esg-assessment-processor`
   - Runtime: Python 3.9 or later
   - Handler: `lambda_esg_processor.lambda_handler`
   - Timeout: 5 minutes
   - Memory: 1024 MB

3. **IAM Permissions Required:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel"
         ],
         "Resource": "arn:aws:bedrock:*:*:foundation-model/anthropic.claude-3-sonnet-*"
       },
       {
         "Effect": "Allow", 
         "Action": [
           "logs:CreateLogGroup",
           "logs:CreateLogStream",
           "logs:PutLogEvents"
         ],
         "Resource": "arn:aws:logs:*:*:*"
       }
     ]
   }
   ```

4. **Environment Variables:**
   - `AWS_REGION` - Your AWS region (e.g., ap-southeast-1)

## API Gateway Integration

Create an API Gateway endpoint with:
- Method: POST
- Enable CORS
- Integration: Lambda Proxy Integration
- Deploy to stage (e.g., 'prod')

Your endpoint URL will be: `https://your-api-id.execute-api.region.amazonaws.com/prod`

## Testing

Send POST request with body:
```json
{
  "business": {
    "name": "Test Company",
    "industry": "Manufacturing", 
    "size": "small",
    "employees": 25
  },
  "responses": [
    {
      "criterionId": "energy-management",
      "score": 75,
      "fieldResponses": {
        "monthly-electricity-spend": 2500,
        "renewable-usage-type": "Solar"
      },
      "notes": "Installed solar panels last year"
    }
  ],
  "framework": "NSRF"
}
```

Expected response includes ESG scores, recommendations, and grant opportunities.