import { describe, it } from '@jest/globals'
import { CreateTransactionUseCase } from './create-transaction'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.commerce.price()),
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }
    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }
    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }
    class IdGeneratorAdapterStub {
        async execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        }
    }

    it('should create transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(createTransactionParams)

        // Assert
        expect(result).toEqual({
            ...createTransactionParams,
            id: 'generated_id',
        })
    })
    it('should call GetUserByIdRepository with correct params', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        // Act
        await sut.execute(createTransactionParams)

        // Assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })

    it('should call idGeneratorAdapter to generate transaction id', async () => {
        // Arrange
        const { sut, idGeneratorAdapter } = makeSut()
        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        // Act
        await sut.execute(createTransactionParams)

        // Assert
        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
    })

    it('should call CreateUserRepository with correct params', async () => {
        // Arrange
        const { sut, createTransactionRepository } = makeSut()
        const createTransactionRepositorySpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        )

        // Act
        await sut.execute(createTransactionParams)

        // Assert
        expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'generated_id',
        })
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        // Act
        const promise = sut.execute(createTransactionParams)

        // Assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // Act
        const promise = sut.execute(createTransactionParams)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        // Arrange
        const { sut, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        // Act
        const promise = sut.execute(createTransactionParams)

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
