import { CreateUserController } from './create-user.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should create a user when all fields are valid', async () => {
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )
        const httpRequest = {
            body: {
                first_name: 'Nome',
                last_name: 'Sobrenome',
                email: 'email@dominio.com',
                password: 'senhavalida123',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )
        const httpRequest = {
            body: {
                last_name: 'Sobrenome',
                email: 'email@dominio.com',
                password: 'senhavalida123',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )
        const httpRequest = {
            body: {
                first_name: 'Nome',
                email: 'email@dominio.com',
                password: 'senhavalida123',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )
        const httpRequest = {
            body: {
                first_name: 'Nome',
                last_name: 'Sobrenome',
                password: 'senhavalida123',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is invalid', async () => {
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )
        const httpRequest = {
            body: {
                first_name: 'Nome',
                last_name: 'Sobrenome',
                email: 'teste',
                password: 'senhavalida123',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )
        const httpRequest = {
            body: {
                first_name: 'Nome',
                last_name: 'Sobrenome',
                email: 'email@dominio.com',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password has less than 6 characters', async () => {
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )
        const httpRequest = {
            body: {
                first_name: 'Nome',
                last_name: 'Sobrenome',
                email: 'email@dominio.com',
                password: '12345',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})
