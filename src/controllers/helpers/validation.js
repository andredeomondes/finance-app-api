import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const generateInvalidIdResponse = () =>
    badRequest({
        message: 'Invalid ID format. Expected a UUID.',
    })

export const requiredFieldIsMissingResponse = (field) =>
    badRequest({
        message: `The field '${field}' is required and cannot be empty.`,
    })

export const generateSomeFieldsNotAllowedResponse = () =>
    badRequest({
        message: 'Some provided field is not allowed.',
    })
