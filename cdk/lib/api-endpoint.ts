import { TypeScriptCode } from "@mrgrain/cdk-esbuild"
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway"
import { Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs"

export type ApiEndpointProps = {
    readonly api: RestApi
    readonly handlerPath: string
    readonly apiMethod: 'GET'
    readonly apiPath: string
}

export class ApiEndpoint extends Construct {
    constructor(scope: Construct, id: string, props: ApiEndpointProps) {
        super(scope, id)

        const {api, handlerPath, apiMethod, apiPath} = props

        // Extract the index file, from the index path.
        const indexFile = handlerPath.split('/').slice(-1)[0].replace(/\.ts/, '')

        const lambdaFunction = new Function(this, id, {
          runtime: Runtime.NODEJS_18_X,
          handler: `${indexFile}.handler`,
          code: new TypeScriptCode(handlerPath, {buildOptions: {treeShaking: true}}),
        })

        const integration = new LambdaIntegration(lambdaFunction, {
        })
      
        const match = apiPath.match(/^\/.*$/)
        if (match === null) {
            throw new Error(`Unsupported apiPath: '${apiPath}'`)
        } else {
            // Remove the first element (empty string)
            const [,...resources] = apiPath.split('/')
            let apiEndpoint = api.root
            for (const resource of resources) {
                apiEndpoint = apiEndpoint.addResource(resource)
            }
            apiEndpoint.addMethod(apiMethod, integration)
        }
    }
}
