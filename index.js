import 'dotenv/config.js'
import express from 'express'
import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
} from './src/controllers/index.js'
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByIdRepository,
} from './src/repositories/postgres/index.js'
import { GetUserByIdUseCase, CreateUserUseCase } from './src/use-cases/index.js'

import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js'
import { PostgresUpdateUserRepository } from './src/repositories/postgres/update-user.js'

import { UpdateUserUseCase } from './src/use-cases/update-user.js'
import { DeleteUserUseCase } from './src/use-cases/delete-user.js'

const app = express()

app.use(express.json())
app.use((req, res, next) => {
    console.log('REQ:', req.method, req.path, 'body:', req.body)
    next()
})

app.post('/api/users', async (req, res) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const createUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (req, res) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    const { statusCode, body } = await updateUserController.execute(req)
    res.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (req, res) => {
    const deleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    const { statusCode, body } = await deleteUserController.execute(req)
    res.status(statusCode).send(body)
})

app.get('/api/users/:userId', async (req, res) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
    console.log('listening on port ' + process.env.PORT),
)
