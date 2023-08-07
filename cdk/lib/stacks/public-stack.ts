import { NestedStack } from "aws-cdk-lib"
import { Construct } from "constructs"
import { ApiEndpoint } from "../api-endpoint"
import { RestApi } from "aws-cdk-lib/aws-apigateway"

export type PublicStackProps = {
    readonly api: RestApi
}

export class PublicStack extends NestedStack {
    constructor(scope: Construct, id: string, props: PublicStackProps) {
        super(scope, id)

        const {api} = props

        // `/public` endpoint
        new ApiEndpoint(this, 'endpoint-public', {
            api,
            handlerPath: '../src/Public.ts',
            apiMethod: 'GET',
            apiPath: '/public/user',
        })
    }
}
