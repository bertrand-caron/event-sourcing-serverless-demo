import { DynamoDBClient, ScanCommandInput } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, QueryCommand, ScanCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb"
import { CreateUserEvent, UpsertNameUserEvent, User, UserEvent, UserEventType } from "../Types/Users"
import { omit, pick, reduce } from "lodash"

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

export const getAllUserEvents = async (): Promise<UserEvent[]> => {
    const params: ScanCommandInput = {
        TableName: 'user-events',
        ExclusiveStartKey: undefined as {[key: string]: any} | undefined,
    }
    let response = await DYNAMODB_DOCUMENT_CLIENT.send(new ScanCommand(params))
    const records = response.Items as UserEvent[]

    // Continue while there are more records to fetch
    while (response.LastEvaluatedKey) {
        // Get the continuation key
        params.ExclusiveStartKey = response.LastEvaluatedKey as {[key: string]: any}
        // Get the new records
        response = await DYNAMODB_DOCUMENT_CLIENT.send(new ScanCommand(params)) // eslint-disable-line no-await-in-loop
        // Fold them
        records.push(...((response.Items ?? []) as UserEvent[]))
    }

    return records
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

export const getUserStats = async (): Promise<Record<UserEventType, number>> => {
    return reduce(
        await getAllUserEvents(),
        (acc, e) => ({...acc, [e.eventType]: acc[e.eventType] + 1}),
        Object.fromEntries(Object.values(UserEventType).map(k => [k, 0])) as Record<UserEventType, number>,
    )
}
