import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import {
    notFound,
    serverError,
    ok,
    generateInvalidIdResponse,
    checkIfIdIsValid,
} from './helpers/index.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

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

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
