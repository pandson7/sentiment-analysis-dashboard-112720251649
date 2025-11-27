import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class SentimentAnalysisStack112720251649 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '112720251649';

    // DynamoDB Table
    const feedbackTable = new dynamodb.Table(this, `FeedbackTable${suffix}`, {
      tableName: `FeedbackAnalysis${suffix}`,
      partitionKey: { name: 'feedbackId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Enable auto scaling
    feedbackTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    feedbackTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    // Sentiment Analysis Lambda
    const sentimentLambda = new lambda.Function(this, `SentimentLambda${suffix}`, {
      functionName: `sentiment-analysis-${suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { randomUUID } = require('crypto');

const dynamodb = new DynamoDBClient({});

// Simple sentiment analysis function
function analyzeSentiment(text) {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'best', 'awesome', 'perfect', 'happy', 'pleased', 'satisfied'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'worst', 'disappointed', 'angry', 'frustrated', 'poor', 'sad', 'upset'];
  
  const words = text.toLowerCase().split(/\\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  let sentiment = 'neutral';
  let confidence = 0.5;
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    confidence = Math.min(0.9, 0.6 + (positiveCount - negativeCount) * 0.1);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    confidence = Math.min(0.9, 0.6 + (negativeCount - positiveCount) * 0.1);
  }
  
  return { sentiment, confidence };
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const body = JSON.parse(event.body);
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' })
      };
    }

    // Analyze sentiment
    const sentimentResult = analyzeSentiment(text);
    const feedbackId = randomUUID();
    const timestamp = new Date().toISOString();

    // Store in DynamoDB
    await dynamodb.send(new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        feedbackId: { S: feedbackId },
        text: { S: text },
        sentiment: { S: sentimentResult.sentiment },
        confidence: { N: sentimentResult.confidence.toString() },
        timestamp: { S: timestamp }
      }
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        feedbackId,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        timestamp
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: feedbackTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Data Retrieval Lambda
    const retrievalLambda = new lambda.Function(this, `RetrievalLambda${suffix}`, {
      functionName: `feedback-retrieval-${suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');

const dynamodb = new DynamoDBClient({});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const result = await dynamodb.send(new ScanCommand({
      TableName: process.env.TABLE_NAME
    }));

    const items = result.Items?.map(item => ({
      feedbackId: item.feedbackId.S,
      text: item.text.S,
      sentiment: item.sentiment.S,
      confidence: parseFloat(item.confidence.N),
      timestamp: item.timestamp.S
    })) || [];

    // Sort by timestamp (newest first)
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        items,
        count: items.length
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: feedbackTable.tableName,
      },
    });

    // Grant permissions
    feedbackTable.grantReadWriteData(sentimentLambda);
    feedbackTable.grantReadData(retrievalLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, `SentimentApi${suffix}`, {
      restApiName: `sentiment-analysis-api-${suffix}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      },
    });

    // API endpoints
    const analyzeIntegration = new apigateway.LambdaIntegration(sentimentLambda);
    const feedbackIntegration = new apigateway.LambdaIntegration(retrievalLambda);

    api.root.addResource('analyze').addMethod('POST', analyzeIntegration);
    api.root.addResource('feedback').addMethod('GET', feedbackIntegration);

    // Output API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL'
    });
  }
}
