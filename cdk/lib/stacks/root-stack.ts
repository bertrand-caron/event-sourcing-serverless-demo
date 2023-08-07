import {Stack, StackProps} from 'aws-cdk-lib'
import {RestApi} from "aws-cdk-lib/aws-apigateway"
import { Construct } from 'constructs'
import { ApiEndpoint } from '../api-endpoint';
import { PublicStack } from './public-stack';
import { AnalyticsStack } from './analytics-stack';

export class RootCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const api = new RestApi(this, `${id}-api`, {
    })


    new PublicStack(this, 'public-stack', {api})

    new AnalyticsStack(this, 'analytics-stack')
  }
}
