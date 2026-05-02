import { EmailAlreadyInUseError } from '../../errors/user.js'
import { serverError, created, badRequest } from '../helpers/index.js'
import { ZodError } from 'zod'
import { createAndUpdateUserSchema } from '../../schemas/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createAndUpdateUserSchema.parseAsync(params)

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
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

            console.log(error)
            return serverError()
        }
    }
}
