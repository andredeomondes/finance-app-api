import { userNotFoundResponse } from '../../controllers/helpers/index.js'

export class GetTransactionsByUserIdUseCase {
    constructor({ getTransactionsByUserIdRepository, getUserByIdRepository }) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new userNotFoundResponse(userId)
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(userId)
        return transactions
    }
}
