import { DeleteTransactionUseCase } from './delete-transaction'
import { faker } from '@faker-js/faker'

describe('DeleteTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.commerce.price()),
    }
    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                ...transaction,
                id: transactionId,
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()
        const id = faker.string.uuid()

        // Act
        const result = await sut.execute(id)

        // Assert
        expect(result).toEqual({
            ...transaction,
            id: id,
        })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        // Arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const id = faker.string.uuid()
        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        // Act
        await sut.execute(id)

        // Assert
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(id)
    })
})
