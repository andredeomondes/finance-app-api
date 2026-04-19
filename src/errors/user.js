export class EmailAreadyInUseError extends Error {
    constructor() {
        super('The provided email is already in use.')
        this.name = 'EmailAreadyInUseError'
    }
}
