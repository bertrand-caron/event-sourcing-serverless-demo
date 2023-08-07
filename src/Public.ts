import { v4 } from "uuid"
import { createUser, getUser, getUserEvents, getUserStats, updateUser } from "./Controllers/Users"
import { UserEventType } from "./Types/Users"

const DEFAULT_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Cache-Signature',
}

type ApiGatewayEvent = {
    readonly httpMethod: string
    readonly path: string
    readonly pathParameters: {[key: string]: string} | null
    readonly body: string | null
}

const successResponse = (response: unknown) => ({
    statusCode: 200,
    body: JSON.stringify({data: response}),
    headers: DEFAULT_HEADERS,
})

export const handler = async (event: ApiGatewayEvent): Promise<unknown> => {
    return successResponse([])
}
