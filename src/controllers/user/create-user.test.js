import { CreateUserController } from './create-user.js'
import { faker } from '@faker-js/faker'

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
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
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
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
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
                first_name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
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
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password({
                    length: 7,
                }),
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
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: 'teste',
                password: faker.internet.password({
                    length: 7,
                }),
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
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )
        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 5,
                }),
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const executeSpy = jest.spyOn(createUserUseCase, 'execute')
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            },
        }

        await createUserController.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
