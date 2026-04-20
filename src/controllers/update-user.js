import { badRequest, serverError, ok } from './helper.js'
import validator from 'validator'
import { UpdateUserUseCase } from '../use-cases/update-user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return badRequest({
                    message: 'Invalid user ID format. Expected a UUID.',
                })
            }

            console.log('httpRequest:', httpRequest)
            const updateUserParams = httpRequest.body

            if (
                !updateUserParams ||
                Object.keys(updateUserParams).length === 0
            ) {
                return badRequest({
                    message: 'No fields provided to update.',
                })
            }

            const allowedField = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowedField.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message:
                        'Some provided fields are not allowed to be updated.',
                })
            }

            if (updateUserParams.password) {
                const passwordIsNotValid = updateUserParams.password.length < 6

                if (passwordIsNotValid) {
                    return badRequest({
                        message:
                            'The password must be at least 6 characters long.',
                    })
                }
            }
            if (updateUserParams.email) {
                const emailIsNotValid = !validator.isEmail(
                    updateUserParams.email,
                )

                if (emailIsNotValid) {
                    return badRequest({
                        message: 'The provided email is not valid.',
                    })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()
            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )
            return ok(updatedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
