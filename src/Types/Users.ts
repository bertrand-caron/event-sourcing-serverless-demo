export enum UserEventType {
    CreateUser = 'user.create',
    UpsertName = 'name.upsert'
}

export type UserEventKey = {
    readonly userId: string
    readonly createdAt: string
}

export type CreateUserEvent = {
    readonly eventType: UserEventType.CreateUser
} & UserEventKey

export type UpsertNameUserEvent = {
    readonly eventType: UserEventType.UpsertName
    readonly name: string
} & UserEventKey

export type UserEvent =
    | CreateUserEvent
    | UpsertNameUserEvent

export type User =
    & Omit<CreateUserEvent, 'eventType' | 'createdAt'>
    & Omit<UpsertNameUserEvent, 'eventType' | 'createdAt'>
