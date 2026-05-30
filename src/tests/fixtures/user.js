import { faker } from '@faker-js/faker'

export const user = {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
}
