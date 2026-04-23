import {
    PostgresCreateTransactionrepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'

import { CreateTransactionUseCase } from '../../usecases/transaction/create-transaction.js'
import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionrepository()

    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )
    return new createTransactionController()
}
