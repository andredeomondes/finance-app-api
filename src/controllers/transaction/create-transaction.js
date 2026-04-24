import {
    invalidTypeResponse,
    checkIfIdIsValid,
    generateInvalidIdResponse,
    serverError,
    created,
    validateRequiredFields,
    requiredFieldIsMissingResponse,
    checkIfAmountIsValid,
    invalidAmountResponse,
} from '../helpers/index.js'
import { checkIfTypeIsValid } from '../helpers/transaction.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requireFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requireFields)

            if (!requiredFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            const userIdIsvalid = checkIfIdIsValid(params.user_id)

            if (!userIdIsvalid) {
                return generateInvalidIdResponse('user_id')
            }

            const amountIsValid = checkIfAmountIsValid(params.amount)

            if (!amountIsValid) {
                return invalidAmountResponse()
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = checkIfTypeIsValid(type)

            if (!typeIsValid) {
                return invalidTypeResponse()
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
