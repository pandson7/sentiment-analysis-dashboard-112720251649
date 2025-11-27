# Sentiment Analysis Dashboard

A minimal web application that analyzes customer feedback sentiment using AWS services. The system allows users to submit customer feedback text and receive real-time sentiment analysis results with visual dashboard representation.

## Architecture

### Frontend Layer
- **Technology**: React.js with TypeScript
- **Hosting**: Local development server (localhost:3000)
- **Features**: 
  - Feedback submission form
  - Real-time sentiment analysis results
  - Historical data visualization
  - Sentiment distribution statistics

### API Layer
- **Technology**: AWS API Gateway with Lambda functions
- **Runtime**: Node.js 22.x
- **Endpoints**:
  - `POST /analyze` - Submit feedback for sentiment analysis
  - `GET /feedback` - Retrieve historical feedback and sentiment data

### Processing Layer
- **Technology**: AWS Lambda functions (Node.js 22.x)
- **Services**:
  - Sentiment Analysis Lambda: Processes text using rule-based sentiment analysis
  - Data Retrieval Lambda: Fetches historical data from DynamoDB

### Data Layer
- **Technology**: Amazon DynamoDB
- **Table**: `FeedbackAnalysis112720251649`
- **Schema**: feedbackId (PK), text, sentiment, confidence, timestamp

## API Endpoints

### POST /analyze
Analyzes sentiment of submitted feedback text.

**Request:**
```json
{
  "text": "string (required, customer feedback text)"
}
```

**Response:**
```json
{
  "feedbackId": "string (UUID)",
  "sentiment": "string (positive|negative|neutral)",
  "confidence": "number (0-1)",
  "timestamp": "string (ISO 8601)"
}
```

### GET /feedback
Retrieves all historical feedback and sentiment analysis results.

**Response:**
```json
{
  "items": [
    {
      "feedbackId": "string",
      "text": "string",
      "sentiment": "string",
      "confidence": "number",
      "timestamp": "string"
    }
  ],
  "count": "number"
}
```

## Deployment Instructions

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- CDK CLI installed (`npm install -g aws-cdk`)

### Backend Deployment

1. Navigate to the CDK directory:
   ```bash
   cd cdk-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy the CDK stack:
   ```bash
   npx cdk deploy --require-approval never
   ```

5. Note the API Gateway URL from the deployment output.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API_BASE_URL in `src/App.tsx` with your API Gateway URL.

4. Start the development server:
   ```bash
   npm start
   ```

5. Open http://localhost:3000 in your browser.

## Features

### Sentiment Analysis
- Rule-based sentiment analysis using keyword matching
- Supports positive, negative, and neutral sentiment classification
- Confidence scoring based on keyword frequency
- Real-time processing and storage

### Dashboard Visualization
- Interactive feedback submission form
- Real-time sentiment analysis results display
- Historical feedback timeline
- Sentiment distribution statistics
- Responsive design for mobile and desktop

### Data Management
- Automatic storage of all feedback and analysis results
- Chronological ordering of feedback history
- Unique identification for each feedback item
- Timestamp tracking for analysis trends

## AWS Resources Created

- **DynamoDB Table**: `FeedbackAnalysis112720251649`
- **Lambda Functions**:
  - `sentiment-analysis-112720251649`
  - `feedback-retrieval-112720251649`
- **API Gateway**: `sentiment-analysis-api-112720251649`
- **IAM Roles**: Appropriate execution roles with minimal permissions

## Security Features

- CORS configuration for cross-origin requests
- Input validation for all API endpoints
- Error handling with appropriate HTTP status codes
- No hardcoded credentials or sensitive data

## Testing

### API Testing
Test the sentiment analysis endpoint:
```bash
curl -X POST https://your-api-url/prod/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This product is amazing!"}'
```

Test the feedback retrieval endpoint:
```bash
curl -X GET https://your-api-url/prod/feedback
```

### Frontend Testing
1. Open http://localhost:3000
2. Submit various types of feedback (positive, negative, neutral)
3. Verify sentiment analysis results are displayed correctly
4. Check that feedback history updates automatically
5. Confirm sentiment distribution statistics are accurate

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the API Gateway has proper CORS configuration
2. **Lambda Timeouts**: Check CloudWatch logs for function execution details
3. **DynamoDB Access**: Verify IAM permissions for Lambda functions
4. **Frontend API Calls**: Confirm the API_BASE_URL is correctly set

### Monitoring
- CloudWatch Logs: Monitor Lambda function execution
- API Gateway Metrics: Track API usage and errors
- DynamoDB Metrics: Monitor read/write capacity usage

## Cleanup

To remove all AWS resources:
```bash
cd cdk-app
npx cdk destroy
```

## License

This project is for demonstration purposes. Use at your own discretion.
