#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SentimentAnalysisStack112720251649 } from '../lib/cdk-app-stack';

const app = new cdk.App();
new SentimentAnalysisStack112720251649(app, 'SentimentAnalysisStack112720251649', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
});
