import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { badRequest, notFound, serverError } from './helper.js'
import validator from 'validator'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({
                    message: 'Invalid user ID format. Expected a UUID.',
                })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return notFound({
                    message: `User with ID ${httpRequest.params.userId} not found.`,
                })
            }

            return {
                statusCode: 200,
                body: user,
            }
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
