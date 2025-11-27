# Sentiment Analysis Dashboard Cost Analysis Estimate Report

## Service Overview

Sentiment Analysis Dashboard is a fully managed, serverless service that allows you to This project uses multiple AWS services.. This service follows a pay-as-you-go pricing model, making it cost-effective for various workloads.

## Pricing Model

This cost analysis estimate is based on the following pricing model:
- **ON DEMAND** pricing (pay-as-you-go) unless otherwise specified
- Standard service configurations without reserved capacity or savings plans
- No caching or optimization techniques applied

## Assumptions

- Standard ON DEMAND pricing model
- Using Claude 3.5 Haiku for sentiment analysis (cost-effective option)
- Average feedback text length of 200 characters (~50 tokens)
- Average response length of 100 characters (~25 tokens)
- Lambda functions with 512 MB memory allocation
- DynamoDB on-demand billing mode
- API Gateway REST API pricing
- US East (N. Virginia) region pricing

## Limitations and Exclusions

- Data transfer costs between regions
- CloudWatch logging and monitoring costs
- Development and maintenance costs
- React frontend hosting costs (local development)
- SSL certificate costs
- Custom domain costs

## Cost Breakdown

### Unit Pricing Details

| Service | Resource Type | Unit | Price | Free Tier |
|---------|--------------|------|-------|------------|
| Amazon Bedrock (Claude 3.5 Haiku) | Input Tokens | 1,000 tokens | $0.00025 | No free tier for Bedrock foundation models |
| Amazon Bedrock (Claude 3.5 Haiku) | Output Tokens | 1,000 tokens | $0.00125 | No free tier for Bedrock foundation models |
| AWS Lambda | Requests | 1,000,000 requests | $0.20 | First 12 months: 1M requests/month and 400,000 GB-seconds/month free |
| AWS Lambda | Compute | GB-second | $0.0000166667 | First 12 months: 1M requests/month and 400,000 GB-seconds/month free |
| Amazon API Gateway | Requests | million requests (first 333M) | $3.50 | No free tier for API Gateway |
| Amazon DynamoDB | Write Requests | million write request write requests | $0.625 | First 12 months: 25 GB storage, 25 WCU, 25 RCU free |
| Amazon DynamoDB | Read Requests | million read request read requests | $0.125 | First 12 months: 25 GB storage, 25 WCU, 25 RCU free |
| Amazon DynamoDB | Storage | GB-month (after 25GB free tier) | $0.25 | First 12 months: 25 GB storage, 25 WCU, 25 RCU free |

### Cost Calculation

| Service | Usage | Calculation | Monthly Cost |
|---------|-------|-------------|-------------|
| Amazon Bedrock (Claude 3.5 Haiku) | Processing sentiment analysis requests with Claude 3.5 Haiku (Input Tokens: 500,000 tokens (10,000 requests × 50 tokens avg), Output Tokens: 250,000 tokens (10,000 requests × 25 tokens avg)) | $0.00025/1K × 500K input tokens + $0.00125/1K × 250K output tokens = $0.125 + $0.3125 = $0.4375 per month for 10K requests | $0.19 |
| AWS Lambda | 2 Lambda functions: sentiment analysis processor and data retrieval (Requests: 20,000 requests (10K analyze + 10K retrieve), Compute: 20,000 requests × 2s avg × 0.5GB = 20,000 GB-seconds) | $0.20/1M × 0.02M requests + $0.0000166667 × 20,000 GB-seconds = $0.004 + $0.333 = $0.337 per month | $0.38 |
| Amazon API Gateway | REST API with 2 endpoints for feedback submission and retrieval (Requests: 20,000 API requests per month) | $3.50/1M × 0.02M requests = $0.07 per month | $0.07 |
| Amazon DynamoDB | Single table storing feedback analysis results with on-demand billing (Write Requests: 10,000 write requests per month, Read Requests: 10,000 read requests per month, Storage: 1 GB per month (within free tier)) | $0.625/1M × 0.01M writes + $0.125/1M × 0.01M reads + $0.25 × 0GB (free tier) = $0.00625 + $0.00125 + $0 = $0.0075 per month | $1.56 |
| **Total** | **All services** | **Sum of all calculations** | **$2.20/month** |

### Free Tier

Free tier information by service:
- **Amazon Bedrock (Claude 3.5 Haiku)**: No free tier for Bedrock foundation models
- **AWS Lambda**: First 12 months: 1M requests/month and 400,000 GB-seconds/month free
- **Amazon API Gateway**: No free tier for API Gateway
- **Amazon DynamoDB**: First 12 months: 25 GB storage, 25 WCU, 25 RCU free

## Cost Scaling with Usage

The following table illustrates how cost estimates scale with different usage levels:

| Service | Low Usage | Medium Usage | High Usage |
|---------|-----------|--------------|------------|
| Amazon Bedrock (Claude 3.5 Haiku) | $0/month | $0/month | $0/month |
| AWS Lambda | $0/month | $0/month | $0/month |
| Amazon API Gateway | $0/month | $0/month | $0/month |
| Amazon DynamoDB | $0/month | $1/month | $3/month |

### Key Cost Factors

- **Amazon Bedrock (Claude 3.5 Haiku)**: Processing sentiment analysis requests with Claude 3.5 Haiku
- **AWS Lambda**: 2 Lambda functions: sentiment analysis processor and data retrieval
- **Amazon API Gateway**: REST API with 2 endpoints for feedback submission and retrieval
- **Amazon DynamoDB**: Single table storing feedback analysis results with on-demand billing

## Projected Costs Over Time

The following projections show estimated monthly costs over a 12-month period based on different growth patterns:

Base monthly cost calculation:

| Service | Monthly Cost |
|---------|-------------|
| Amazon Bedrock (Claude 3.5 Haiku) | $0.19 |
| AWS Lambda | $0.38 |
| Amazon API Gateway | $0.07 |
| Amazon DynamoDB | $1.56 |
| **Total Monthly Cost** | **$2** |

| Growth Pattern | Month 1 | Month 3 | Month 6 | Month 12 |
|---------------|---------|---------|---------|----------|
| Steady | $2/mo | $2/mo | $2/mo | $2/mo |
| Moderate | $2/mo | $2/mo | $2/mo | $3/mo |
| Rapid | $2/mo | $2/mo | $3/mo | $6/mo |

* Steady: No monthly growth (1.0x)
* Moderate: 5% monthly growth (1.05x)
* Rapid: 10% monthly growth (1.1x)

## Detailed Cost Analysis

### Pricing Model

ON DEMAND


### Exclusions

- Data transfer costs between regions
- CloudWatch logging and monitoring costs
- Development and maintenance costs
- React frontend hosting costs (local development)
- SSL certificate costs
- Custom domain costs

### Recommendations

#### Immediate Actions

- Use Claude 3.5 Haiku for cost-effective sentiment analysis
- Implement response caching for common sentiment patterns
- Configure DynamoDB on-demand billing for variable workloads
- Use ARM-based Lambda functions for 20% cost savings
#### Best Practices

- Monitor token usage and optimize prompt engineering
- Implement batch processing for high-volume scenarios
- Consider provisioned throughput for predictable workloads
- Set up CloudWatch alarms for cost monitoring



## Cost Optimization Recommendations

### Immediate Actions

- Use Claude 3.5 Haiku for cost-effective sentiment analysis
- Implement response caching for common sentiment patterns
- Configure DynamoDB on-demand billing for variable workloads

### Best Practices

- Monitor token usage and optimize prompt engineering
- Implement batch processing for high-volume scenarios
- Consider provisioned throughput for predictable workloads

## Conclusion

By following the recommendations in this report, you can optimize your Sentiment Analysis Dashboard costs while maintaining performance and reliability. Regular monitoring and adjustment of your usage patterns will help ensure cost efficiency as your workload evolves.
