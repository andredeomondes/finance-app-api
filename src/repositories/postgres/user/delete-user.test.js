import { PostgresDeleteUserRepository } from './delete-user.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user } from '../../../tests/index.js'

describe('PostgresDeleteUserRepository', () => {
    it('should delete a user on the database', async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })

    it('should return null if user is not found', async () => {
        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toBeNull()
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresDeleteUserRepository()

        const prismaSpy = jest.spyOn(prisma.user, 'delete')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })
})
