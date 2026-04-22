import 'dotenv/config.js'
import express from 'express'
import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
} from './src/controllers/index.js'
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/index.js'
import { GetUserByIdUseCase } from './src/use-cases/index.js'

const app = express()

app.use(express.json())
app.use((req, res, next) => {
    console.log('REQ:', req.method, req.path, 'body:', req.body)
    next()
})

// Routes

// User routes

// Create user
app.post('/api/users', async (req, res) => {
    const createUserController = new CreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

// Update user
app.patch('/api/users/:userId', async (req, res) => {
    const updateUserController = new UpdateUserController()

    const { statusCode, body } = await updateUserController.execute(req)
    res.status(statusCode).send(body)
})

// Delete user
app.delete('/api/users/:userId', async (req, res) => {
    const deleteUserController = new DeleteUserController()
    const { statusCode, body } = await deleteUserController.execute(req)
    res.status(statusCode).send(body)
})

// Get user by id
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
