import {
    generateInvalidEmailResponse,
    generateInvalidPasswordResponse,
    generateNoFieldsToUpdateResponse,
    generateSomeFieldsNotAllowedResponse,
    generateInvalidIdResponse,
    checkIfPasswordIsValid,
    checkIfEmailIsValid,
    checkIfIdIsValid,
    serverError,
    ok,
} from './helpers/index.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return generateInvalidIdResponse()
            }

            const params = httpRequest.body || httpRequest

            if (!params || Object.keys(params).length === 0) {
                return generateNoFieldsToUpdateResponse()
            }

            const allowedField = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedField.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return generateSomeFieldsNotAllowedResponse()
            }

            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password)

                if (!passwordIsValid) {
                    return generateInvalidPasswordResponse()
                }
            }
            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email)

                if (!emailIsValid) {
                    return generateInvalidEmailResponse()
                }
            }

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )
            return ok(updatedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
