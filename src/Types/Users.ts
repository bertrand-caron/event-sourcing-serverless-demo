export enum UserEventType {
    CreateUser = 'user.create',
}

export type UserEventKey = {
    readonly userId: string
    readonly createdAt: string
}

export type CreateUserEvent = {
    readonly eventType: UserEventType.CreateUser
} & UserEventKey

export type UserEvent = 
    | CreateUserEvent

export type User = Omit<CreateUserEvent, 'eventType'>
