import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import type { CreateUserEvent } from "../Types/Users"

export const DYNAMODB_DOCUMENT_CLIENT = DynamoDBDocumentClient.from(new DynamoDBClient({region: 'ap-southeast-2'}), {
    marshallOptions: {removeUndefinedValues: true},
})

export const createUser = async (event: CreateUserEvent): Promise<CreateUserEvent> => {
    await DYNAMODB_DOCUMENT_CLIENT.send(
        new PutCommand({
            TableName: 'user-events',
            Item: event,
        })
    )
    return event
}
