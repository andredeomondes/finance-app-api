export class EmailAlreadyInUseError extends Error {
    constructor() {
        super('The provided email is already in use.')
        this.name = 'EmailAlreadyInUseError'
    }
}
