import { DeleteTransactionUseCase } from './delete-transaction'
import { faker } from '@faker-js/faker'
import { transaction } from '../../tests'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction
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
        expect(result).toEqual(transaction)
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
