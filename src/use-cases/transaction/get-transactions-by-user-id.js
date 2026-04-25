import { userNotFoundResponse } from '../../controllers/helpers/index.js'

export class GetTransactionsByUserIdUseCase {
    constructor({ getTransactionsByUserIdRepository, getUserByIdRepository }) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)
        if (!user) {
            throw new userNotFoundResponse(params.userId)
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(params.userId)
        return transactions
    }
}
