import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserController } from './create-user.js'
import { faker } from '@faker-js/faker'
import { user } from '../../tests'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute() {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }

    const httpRequest = {
        body: {
            first_name: user.name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        },
    }

    it('should create a user when all fields are valid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(201)

        expect(result.body).toBe(user)
    })

    it('should return 400 if first_name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: { ...httpRequest, first_name: undefined },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: { ...httpRequest, last_name: undefined },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: { ...httpRequest, email: undefined },
        })
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: { ...httpRequest, email: 'invalid_email' },
        })
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: { ...httpRequest, password: undefined },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest,
                password: faker.internet.password({
                    length: 5,
                }),
            },
        })
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        const { sut, createUserUseCase } = makeSut()

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        const { sut, createUserUseCase } = makeSut()

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreateUserUseCase throws EmailIsAlreadyInUseError', async () => {
        const { sut, createUserUseCase } = makeSut()

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(httpRequest.body.email),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})
