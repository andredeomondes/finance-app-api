import validator from 'validator'
import { badRequest, notFound } from './http.js'

export const checkIfAmountIsValid = (amount) => {
    if (typeof amount !== 'number') {
        return false
    }

    return validator.isCurrency(amount.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
    })
}

export const checkIfTypeIsValid = (type) => {
    return ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)
}

export const invalidAmountResponse = () => {
    return badRequest({
        message: 'Amount must be a valid currency format',
    })
}

export const invalidTypeResponse = () => {
    return badRequest({
        message:
            'Type must be one of the following: EARNING, EXPENSE, INVESTMENT',
    })
}

export const transactionNotFoundResponse = () => {
    return notFound({ message: 'Transaction not found' })
}
