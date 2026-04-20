import { CreateUserUseCase } from '../use-cases/create-user.js'
import { created, serverError } from './helpers/http.js'
import {
    checkIfPasswordIsValid,
    generateEmailAlreadyInUseResponse,
    generateFieldIsRequiredResponse,
    generateInvalidEmailResponse,
    generateInvalidPasswordResponse,
    checkIfEmailIsValid,
} from './helpers/user.js'

import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error.js'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return generateFieldIsRequiredResponse(field)
                }
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)
            if (!passwordIsValid) {
                return generateInvalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return generateInvalidEmailResponse()
            }

            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return generateEmailAlreadyInUseResponse()
            }
            console.log('Error creating user:', error)
            return serverError()
        }
    }
}
