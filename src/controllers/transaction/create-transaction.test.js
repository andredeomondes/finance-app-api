import { CreateTransactionController } from './create-transaction'
import { faker } from '@faker-js/faker'

describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return {
            sut,
            createTransactionUseCase,
        }
    }

    const baseHttpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EARNING',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 201 when creating transaction succesfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(baseHttpRequest)

        expect(response.statusCode).toBe(201)
    })

    it('should return 400 when missing user_id', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                user_id: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing name', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                name: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })
})
