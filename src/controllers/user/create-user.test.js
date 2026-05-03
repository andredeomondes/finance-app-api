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
    // Testa:
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
    it('should return 400 if first_name is not provided', async () => {
        // Arrange: cria controller com stub e request sem first_name
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )
        const httpRequest = {
            body: {
                // first_name removido propositalmente para testar validação
                last_name: 'Sobrenome',
                email: 'email@dominio.com',
                password: 'senhavalida123',
            },
        }

        // Act: executa o controller
        const result = await createUserController.execute(httpRequest)

        // Assert: Zod deve rejeitar e retornar 400
        expect(result.statusCode).toBe(400)
    })
})
