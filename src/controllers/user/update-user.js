import { updateUserSchema } from '../../schemas/index.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { ZodError } from 'zod'

import {
    generateSomeFieldsNotAllowedResponse,
    generateInvalidIdResponse,
    checkIfIdIsValid,
    serverError,
    ok,
    badRequest,
} from '../helpers/index.js'

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

            const params = httpRequest.body

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

            await updateUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )
            return ok(updatedUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({
                    message: error.message,
                })
            }
            console.error(error)
            return serverError()
        }
    }
}
