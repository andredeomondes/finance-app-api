/**
 * @file Teste unitário do CreateUserController
 * @description Testa apenas a camada HTTP (validação e resposta)
 * @pattern AAA (Arrange, Act, Assert)
 * @concept Stub - substitui o Use Case para isolar o controller
 */

import { CreateUserController } from './create-user.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should create a user', async () => {
        // Arrange: instancia controller com stub e cria requisição válida
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )

        const httpRequest = {
            body: {
                first_name: 'Nome',
                last_name: 'Sobrenome',
                email: 'email@dominio.com',
                password: 'senhavalida123',
            },
        }

        // Act: executa o controller com a requisição
        const result = await createUserController.execute(httpRequest)

        // Assert: verifica status 201 e body retornado
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })
})
