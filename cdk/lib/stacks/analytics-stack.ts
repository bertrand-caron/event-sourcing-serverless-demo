import { Construct } from 'constructs'
import { NestedStack } from "aws-cdk-lib"
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'

export class AnalyticsStack extends NestedStack {
    constructor(scope: Construct, id: string) {
        super(scope, id)

        const table = new Table(this, 'Table', {
            partitionKey: { name: 'type', type: AttributeType.STRING },
            sortKey: {name: 'computedAt', type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
        })

        console.log(table)
    }    
}
