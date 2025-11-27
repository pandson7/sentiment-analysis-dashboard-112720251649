# Technical Design Document

## Architecture Overview

The Sentiment Analysis Dashboard follows a serverless architecture using AWS services with a React frontend and Node.js backend. The system processes customer feedback through AWS Bedrock for sentiment analysis and stores results in DynamoDB.

## System Components

### Frontend Layer
- **Technology**: React.js application
- **Hosting**: Local development server
- **Responsibilities**: 
  - User interface for feedback submission
  - Dashboard visualization of sentiment results
  - API communication with backend services

### API Layer
- **Technology**: AWS API Gateway with Lambda functions
- **Runtime**: Node.js 18.x
- **Endpoints**:
  - `POST /analyze` - Submit feedback for sentiment analysis
  - `GET /feedback` - Retrieve historical feedback and sentiment data

### Processing Layer
- **Technology**: AWS Lambda functions (Node.js 18.x)
- **Services**:
  - Sentiment Analysis Lambda: Processes text using AWS Bedrock
  - Data Retrieval Lambda: Fetches historical data from DynamoDB

### AI/ML Layer
- **Technology**: AWS Bedrock with Claude 4 LLM
- **Purpose**: Natural language processing for sentiment analysis
- **Output**: Sentiment classification (positive/negative/neutral) with confidence scores

### Data Layer
- **Technology**: Amazon DynamoDB
- **Tables**:
  - `FeedbackAnalysis` table with partition key `feedbackId`
  - Attributes: feedbackId, text, sentiment, confidence, timestamp

## Data Flow

```
User Input → React Frontend → API Gateway → Lambda Function → Bedrock → DynamoDB → Response Chain
```

### Sequence Diagram: Feedback Analysis Flow

```
User -> Frontend: Submit feedback text
Frontend -> API Gateway: POST /analyze {text}
API Gateway -> Lambda: Invoke sentiment analysis function
Lambda -> Bedrock: Analyze sentiment request
Bedrock -> Lambda: Return sentiment + confidence
Lambda -> DynamoDB: Store feedback and results
DynamoDB -> Lambda: Confirm storage
Lambda -> API Gateway: Return analysis results
API Gateway -> Frontend: JSON response
Frontend -> User: Display sentiment results
```

## Technical Specifications

### DynamoDB Schema
```json
{
  "feedbackId": "string (UUID)",
  "text": "string",
  "sentiment": "string (positive|negative|neutral)",
  "confidence": "number (0-1)",
  "timestamp": "string (ISO 8601)"
}
```

### API Specifications

#### POST /analyze
**Request:**
```json
{
  "text": "string (required, max 1000 characters)"
}
```

**Response:**
```json
{
  "feedbackId": "string",
  "sentiment": "string",
  "confidence": "number",
  "timestamp": "string"
}
```

#### GET /feedback
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

## Infrastructure as Code

### CDK Stack Components
- API Gateway REST API
- Lambda functions with appropriate IAM roles
- DynamoDB table with on-demand billing
- Bedrock service permissions

### Security Considerations
- Lambda execution roles with minimal required permissions
- API Gateway request validation
- DynamoDB access limited to Lambda functions
- No authentication required (prototype scope)

## Frontend Architecture

### React Components
- `App.js` - Main application component
- `FeedbackForm.js` - Text input and submission
- `SentimentDisplay.js` - Individual result display
- `Dashboard.js` - Historical data visualization

### State Management
- React hooks for local state management
- API calls using fetch or axios
- Error handling for network requests

## Deployment Strategy

### Local Development
- React development server on localhost:3000
- CDK deployment to AWS account
- Environment variables for API endpoints

### AWS Resources
- Single CDK stack deployment
- No CI/CD pipeline required
- Manual deployment using CDK CLI commands
