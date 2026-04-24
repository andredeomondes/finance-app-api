import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const generateInvalidIdResponse = () =>
    badRequest({
        message: 'Invalid ID format. Expected a UUID.',
    })

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const requiredFieldIsMissingResponse = (field) =>
    badRequest({
        message: `The field '${field}' is required and cannot be empty.`,
    })

export const checkIfIsString = (value) => typeof value === 'string'

export const validateRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]

        const fieldIsEmpty =
            checkIfIsString(params[field]) &&
            validator.isEmpty(params[field], {
                ignore_whitespace: false,
            })

        if (fieldIsMissing || fieldIsEmpty) {
            return {
                missingField: field,
                ok: false,
            }
        }
    }
    return {
        ok: true,
        missingField: undefined,
    }
}
