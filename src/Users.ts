import { v4 } from "uuid"
import { createUser } from "./Controllers/Users"
import { UserEventType } from "./Types/Users"

const DEFAULT_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Cache-Signature',
}

type ApiGatewayEvent = {
    readonly httpMethod: string
}

const successResponse = (response: unknown) => ({
    statusCode: 200,
    body: JSON.stringify({data: response}),
    headers: DEFAULT_HEADERS,
})

export const handler = async (event: ApiGatewayEvent): Promise<unknown> => {
    if (event.httpMethod === 'POST') {
        return successResponse(await createUser({
            eventType: UserEventType.CreateUser,
            userId: v4(),
            createdAt: new Date().toISOString(),
        }))
    } else {
        return successResponse(true)
    }
}
