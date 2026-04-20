import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import validator from 'validator'
import { generateInvalidIdResponse } from './helpers/user.js'
import { notFound, serverError } from './helpers/http.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return generateInvalidIdResponse()
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
