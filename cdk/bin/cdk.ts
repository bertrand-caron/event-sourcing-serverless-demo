#!/usr/bin/env node
import 'source-map-support/register'
import {App} from 'aws-cdk-lib'
import { RootCdkStack } from '../lib/stacks/root-stack'

const app = new App()
new RootCdkStack(app, 'event-sourcing-serverless-demo', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
})
