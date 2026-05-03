import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateTransactionRepository {
    async execute(transcationId) {
        try {
            await prisma.transaction.delete({
                where: {
                    id: transcationId,
                },
            })
        } catch (error) {
            return null
        }
    }
}
