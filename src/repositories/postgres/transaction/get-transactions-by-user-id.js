import { PostgresHelper } from '../../../db/postgres/helper.js'
export class PostgresGetTransactionsByUserIdRepository {
    async execute(UserId) {
        const transactions = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [UserId],
        )
        return transactions
    }
}
