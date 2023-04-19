import { omit, reduce } from "lodash"
import type { UserEvent, User } from "../Types/Users"

export const foldUserEvents = (userEvents: UserEvent[]): User => {
    return reduce(
        userEvents,
        (user, event) => ({...user, ...omit(event, ['eventType', 'createdAt'])}),
        {} as User,
    )
}
