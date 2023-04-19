const DEFAULT_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Cache-Signature',
}

export const handler = async (event: unknown): Promise<unknown> => {
    return {
        statusCode: 200,
        body: JSON.stringify({data: true}),
        headers: DEFAULT_HEADERS,
    }
}
