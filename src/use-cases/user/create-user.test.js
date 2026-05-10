import { EmailAlreadyInUseError } from '../../errors/user'
import { CreateUserUseCase } from './create-user'
import { faker } from '@faker-js/faker'

describe('Create User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }
    class CreateUserRepositoryStub {
        async execute(user) {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    it('should succesfully create a user', async () => {
        // Arrange
        const { sut } = makeSut()
        // Act
        const createdUser = await sut.execute(user)
        // Assert
        expect(createdUser).toBeTruthy()
    })

    it('should throw and EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            user,
        )
        // Act
        const promise = sut.execute(user)
        // Assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call IdGeneratorAdapter  to generate a random id ', async () => {
        // Arrange
        const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        // Act
        await sut.execute(user)
        // Assert
        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should call PasswordHasherAdapter to cryptograph password', async () => {
        // Arrange
        const { sut, passwordHasherAdapter, createUserRepository } = makeSut()
        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        // Act
        await sut.execute(user)
        // Assert
        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
