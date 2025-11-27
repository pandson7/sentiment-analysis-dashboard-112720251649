# Sentiment Analysis Dashboard - AWS Architecture Diagram

## Overview
Generated AWS Architecture diagram for the Sentiment Analysis Dashboard based on the technical design specifications.

## Architecture Components

### Frontend Layer
- **React.js Dashboard**: User interface for feedback submission and sentiment visualization
- **Local Development**: Runs on localhost:3000 during development

### API Layer
- **AWS API Gateway**: REST API endpoints for feedback processing
  - POST /analyze - Submit feedback for sentiment analysis
  - GET /feedback - Retrieve historical feedback data

### Processing Layer
- **Sentiment Analysis Lambda**: Processes text using AWS Bedrock for sentiment analysis
- **Data Retrieval Lambda**: Fetches historical data from DynamoDB
- **Runtime**: Node.js 18.x

### AI/ML Layer
- **AWS Bedrock with Claude 4**: Natural language processing for sentiment analysis
- **Output**: Sentiment classification (positive/negative/neutral) with confidence scores

### Data Layer
- **Amazon DynamoDB**: NoSQL database storing feedback analysis results
- **Table**: FeedbackAnalysis with feedbackId as partition key
- **Attributes**: feedbackId, text, sentiment, confidence, timestamp

## Data Flow
1. User submits feedback through React frontend
2. Frontend sends POST request to API Gateway
3. API Gateway invokes Sentiment Analysis Lambda
4. Lambda calls AWS Bedrock for sentiment analysis
5. Results stored in DynamoDB
6. Response returned through the chain back to user
7. Historical data retrieved via separate Lambda function

## Generated Files
- **Architecture Diagram**: `/home/pandson/echo-architect-artifacts/sentiment-analysis-dashboard-112720251649/generated-diagrams/generated-diagrams/sentiment-analysis-architecture.png`
- **Summary Document**: `/home/pandson/echo-architect-artifacts/sentiment-analysis-dashboard-112720251649/generated-diagrams/architecture-summary.md`

## Key Design Decisions
- Serverless architecture using Lambda functions
- DynamoDB for scalable NoSQL storage
- AWS Bedrock for AI-powered sentiment analysis
- No authentication required (prototype scope)
- React frontend for modern UI experience

The diagram accurately represents the serverless, event-driven architecture with clear data flow from user input to sentiment analysis and storage.
