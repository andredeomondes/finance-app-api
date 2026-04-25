import {
    checkIfAmountIsValid,
    checkIfIdIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidIdResponse,
    invalidTypeResponse,
    ok,
} from '../helpers/index.js'
import { badRequest, serverErorr } from '../helpers/http.js'
export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.id)
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            const allowedField = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedField.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some fields are not allowed to update',
                })
            }
            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount)
                if (!amountIsValid) {
                    return invalidAmountResponse()
                }
            }
            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type)
                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }
            const transaction = await this.updateTransactionUseCase.execute({
                id: httpRequest.params.id,
                params,
            })

            return ok(transaction)
        } catch (error) {
            console.error(error)
            return serverErorr()
        }
    }
}
