import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import type { CreateUserEvent, UpsertNameUserEvent, UserEvent } from "../Types/Users"

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

export const getUserEvents = async (userId: string): Promise<UserEvent[]> => {
    const response = await DYNAMODB_DOCUMENT_CLIENT.send(
        new QueryCommand(
            {
                TableName: 'user-events',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId,
                },
                ScanIndexForward: true,
                ReturnConsumedCapacity: 'TOTAL',
            },
        ),
    )

    return response.Items as unknown as UserEvent[]
}

export const updateUser = async (event: UpsertNameUserEvent): Promise<UpsertNameUserEvent> => {
    await DYNAMODB_DOCUMENT_CLIENT.send(
        new PutCommand({
            TableName: 'user-events',
            Item: event,
        })
    )
    return event
}
