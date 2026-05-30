import { UpdateTransactionUseCase } from './update-transaction'
import { faker } from '@faker-js/faker'
import { transaction } from '../../tests'

describe('UpdateTransactionUseCase', () => {
    class UpdateTransactionRepositorySpy {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository = new UpdateTransactionRepositorySpy()
        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return {
            sut,
            updateTransactionRepository,
        }
    }

    it('should create a transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(transaction.id, {
            amount: Number(faker.finance.amount()),
        })

        // Assert
        expect(result).toEqual(transaction)
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        // Arrange
        const { sut, updateTransactionRepository } = makeSut()
        const updateTransactionRepositorySpy = jest.spyOn(
            updateTransactionRepository,
            'execute',
        )

        // Act
        await sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        // Assert
        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
            {
                amount: transaction.amount,
            },
        )
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        // Arrange
        const { sut, updateTransactionRepository } = makeSut()
        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        // Act
        const promise = sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
