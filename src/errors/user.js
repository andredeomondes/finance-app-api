export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`The provided ${email} is already in use.`)
        this.name = 'EmailAlreadyInUseError'
    }
}

export class UserNotFoundError extends Error {
    constructor(user) {
        super(`User with email ${user.email} not found.`)
        this.name = 'UserNotFoundError'
    }
}
