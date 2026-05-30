import { UserNotFoundError } from '../../errors/user'
import { GetUserBalanceUseCase } from './get-user-balance'
import { faker } from '@faker-js/faker'
import { user, userBalance } from '../../tests/'

describe('GetUserBalanceUseCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserBalanceRepositoryStub = new GetUserBalanceRepositoryStub()
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepositoryStub,
            getUserByIdRepositoryStub,
        )

        return {
            sut,
            getUserBalanceRepositoryStub,
            getUserByIdRepositoryStub,
        }
    }

    it('should get user balance succesfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(faker.string.uuid())

        // Assert
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserBalanceRepository return null', async () => {
        // Arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        jest.spyOn(getUserByIdRepositoryStub, 'execute').mockResolvedValueOnce(
            null,
        )

        const userId = faker.string.uuid()

        // Act
        const promise = sut.execute(userId)

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })
    it('should call GetUserByIdRepository with correct params', async () => {
        // Arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = jest.spyOn(getUserByIdRepositoryStub, 'execute')

        // Act
        await sut.execute(userId)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        // Arrange
        const { sut, getUserBalanceRepositoryStub } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = jest.spyOn(getUserBalanceRepositoryStub, 'execute')

        // Act
        await sut.execute(userId)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // Arrange
        const { sut, getUserByIdRepositoryStub } = makeSut()
        jest.spyOn(getUserByIdRepositoryStub, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // Act
        const promise = sut.execute(faker.string.uuid())

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
