import {
    checkIfIdIsValid,
    generateInvalidIdResponse,
    serverError,
    userNotFoundResponse,
    ok,
} from '../helpers/index.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const idIsValid = checkIfIdIsValid(userId)
            if (!idIsValid) {
                return generateInvalidIdResponse()
            }
            const deletedUser = await this.deleteUserUseCase.execute(userId)
            if (!deletedUser || deletedUser.length === 0) {
                return userNotFoundResponse()
            }
            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
