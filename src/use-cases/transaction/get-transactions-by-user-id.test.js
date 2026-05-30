import { UserNotFoundError } from '../../errors/user'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id'
import { faker } from '@faker-js/faker'
import { user } from '../../tests/'

describe('GetTransactionsByUserIdUseCase', () => {
    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase({
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        })

        return {
            sut,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        }
    }

    it('should successfully get transactions by user id', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(faker.string.uuid())

        // Assert
        expect(result).toEqual([])
    })

    it('should throw userNotFoundError if user does not exist', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
        const id = faker.string.uuid()

        // Act
        const promise = sut.execute(id)

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(id))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')
        const id = faker.string.uuid()

        // Act
        await sut.execute(id)

        // Assert
        expect(getUserByIdSpy).toHaveBeenCalledWith(id)
    })

    it('should call GetTransactionsByUserIdRepository with correct params', async () => {
        // Arrange
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        const getTransactionsByUserIdSpy = jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        )
        const id = faker.string.uuid()

        // Act
        await sut.execute(id)

        // Assert
        expect(getTransactionsByUserIdSpy).toHaveBeenCalledWith(id)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // Act
        const promise = sut.execute(faker.string.uuid())

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetTransactionsByUserIdRepository throws', async () => {
        // Arrange
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        // Act
        const promise = sut.execute(faker.string.uuid())

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
