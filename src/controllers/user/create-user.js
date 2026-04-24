import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    checkIfPasswordIsValid,
    generateInvalidEmailResponse,
    generateInvalidPasswordResponse,
    checkIfEmailIsValid,
    serverError,
    created,
    validateRequiredFields,
    requiredFieldIsMissingResponse,
} from '../helpers/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)
            if (!passwordIsValid) {
                return generateInvalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return generateInvalidEmailResponse()
            }

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                throw new EmailAlreadyInUseError()
            }
            console.log('Error creating user:', error)
            return serverError()
        }
    }
}
