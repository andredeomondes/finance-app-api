import { badRequest, notFound } from './http.js'
import validator from 'validator'

export const generateInvalidPasswordResponse = () =>
    badRequest({
        message: 'The password must be at least 6 characters long.',
    })

export const generateInvalidEmailResponse = () =>
    badRequest({
        message: 'The email provided is not valid.',
    })

export const generateEmailAlreadyInUseResponse = () =>
    badRequest({
        message: 'The provided email is already in use.',
    })

export const generateNoFieldsToUpdateResponse = () => {
    return badRequest({
        message: 'No fields provided to update.',
    })
}

export const generateSomeFieldsNotAllowedResponse = () =>
    badRequest({
        message: 'Some provided fields are not allowed to be updated.',
    })

export const generateFieldIsRequiredResponse = (field) =>
    badRequest({
        message: `The field '${field}' is required and cannot be empty.`,
    })

export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found.',
    })
