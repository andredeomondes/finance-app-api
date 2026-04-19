import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest, created, serverError } from './helper.js'
import validator from 'validator'

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
                    return badRequest(
                        `O campo ${field} é obrigatório e não pode estar vazio.`,
                    )
                }
            }

            const passwordIsValid = params.password.length < 6
            if (passwordIsValid) {
                return badRequest('A senha deve ter pelo menos 6 caracteres.')
            }

            const emailIsValid = validator.isEmail(params.email)

            if (!emailIsValid) {
                return badRequest('O e-mail fornecido é inválido.')
            }

            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            console.log('Error creating user:', error)
            return serverError()
        }
    }
}
