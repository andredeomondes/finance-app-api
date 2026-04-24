import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const generateInvalidIdResponse = () =>
    badRequest({
        message: 'Invalid ID format. Expected a UUID.',
    })
