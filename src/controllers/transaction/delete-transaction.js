import {
    checkifIdIsValid,
    generateInvalidIdResponse,
    ok,
    serverError,
} from '../helpers/index.js'
export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const idIsValid = checkifIdIsValid(httpRequest.params.id)
            if (!idIsValid) {
                return generateInvalidIdResponse()
            }

            const transaction = await this.deleteTransactionUseCase.execute(
                httpRequest.params.transactionId,
            )
            return ok(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
