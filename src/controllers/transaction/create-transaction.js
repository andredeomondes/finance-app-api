import {
    badRequest,
    checkIfIdIsValid,
    generateInvalidIdResponse,
    serverError,
    created,
} from '../helpers/index.js'
import validator from 'validator'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requireFields = [
                'id',
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ]

            for (const field of requireFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            const userIdIsvalid = checkIfIdIsValid(params.user_id)

            if (!userIdIsvalid) {
                return generateInvalidIdResponse('user_id')
            }

            if (params.amount <= 0) {
                return badRequest({
                    message: 'Amount must be greater than zero',
                })
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_decimal: false,
                    decimal_separator: '.',
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'Amount must be a valid currency format',
                })
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNING,', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message:
                        'Type must be one of the following: EARNING, EXPENSE, INVESTMENT',
                })
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })

            return created(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
