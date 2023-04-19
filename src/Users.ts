import { v4 } from "uuid"
import { createUser, getUserEvents, updateUser } from "./Controllers/Users"
import { UserEventType } from "./Types/Users"
import { foldUserEvents } from "./Helpers/Users"

const DEFAULT_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Cache-Signature',
}

type ApiGatewayEvent = {
    readonly httpMethod: string
    readonly pathParameters: {[key: string]: string} | null
    readonly body: string | null
}

const successResponse = (response: unknown) => ({
    statusCode: 200,
    body: JSON.stringify({data: response}),
    headers: DEFAULT_HEADERS,
})

export const handler = async (event: ApiGatewayEvent): Promise<unknown> => {
    console.log(event)

    if (event.httpMethod === 'POST') {
        return successResponse(await createUser({
            eventType: UserEventType.CreateUser,
            userId: v4(),
            createdAt: new Date().toISOString(),
        }))
    } else if (event.httpMethod === 'GET' && event.pathParameters !== null && 'userId' in event.pathParameters) {
        const userEvents = await getUserEvents(event.pathParameters.userId)
        return successResponse(foldUserEvents(userEvents))
    } else if (event.httpMethod === 'PUT' && event.pathParameters !== null && 'userId' in event.pathParameters && event.body !== null) {
        return successResponse(await updateUser({
            eventType: UserEventType.UpsertName,
            name: JSON.parse(event.body).name,
            userId: event.pathParameters.userId,
            createdAt: new Date().toISOString(),
        }))
    }
}
