import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, QueryCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb"
import type { CreateUserEvent, UpsertNameUserEvent, User, UserEvent } from "../Types/Users"
import { omit, pick } from "lodash"

export const DYNAMODB_DOCUMENT_CLIENT = DynamoDBDocumentClient.from(new DynamoDBClient({region: 'ap-southeast-2'}), {
    marshallOptions: {removeUndefinedValues: true},
})

export const createUser = async (event: CreateUserEvent): Promise<CreateUserEvent> => {
    await DYNAMODB_DOCUMENT_CLIENT.send(
        new TransactWriteCommand({
            TransactItems: [
                {
                    Put: {
                        TableName: 'user-events',
                        Item: event,
                    },
                },
                {
                    Put: {
                        TableName: 'users',
                        Item: omit(event, ["createdAt", 'eventType']),
                    },
                },
            ],

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
        new TransactWriteCommand({
            TransactItems: [
                {
                    Put: {
                        TableName: 'user-events',
                        Item: event,
                    },
                },
                {
                    Update: {
                        TableName: 'users',
                        Key: pick(event, "userId"),
                        UpdateExpression: "SET #name = :name",
                        ExpressionAttributeNames: {
                            '#name': 'name'
                        },
                        ExpressionAttributeValues: {
                            ':name': event.name,
                        },
                    },
                },
            ],

        })
    )
    return event
}

export const getUser = async (userId: string): Promise<User> => {
    const response = await DYNAMODB_DOCUMENT_CLIENT.send(
        new GetCommand(
            {
                TableName: 'users',
                Key: {userId},
            },
        ),
    )

    return response.Item as User
}
