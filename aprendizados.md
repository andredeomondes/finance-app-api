# Aprendizados

## Setup: ESLint + Prettier + Husky + Commitlint

### Comandos Essenciais

```bash
# Inicializar projeto
npm init -y

# Instalar ferramentas
npm install -D eslint prettier husky @commitlint/cli @commitlint/config-conventional lint-staged

# Configurar Husky
npx husky install
npm pkg set scripts.prepare="husky"

# Adicionar hooks
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### Configurações

**package.json**

```json
{
    "type": "module",
    "scripts": { "prepare": "husky" },
    "lint-staged": {
        "*.js": "eslint",
        "*.{js,json} "prettier --write"
    }
}
```

**.eslintrc.json**

```json
{
    "env": { "es2021": true, "node": true },
    "extends": "eslint:recommended",
    "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" }
}
```

**.prettierrc.json**

```json
{ "tabWidth": 4, "semi": false, "singleQuote": true }
```

**commitlint.config.cjs**

```javascript
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test'],
        ],
    },
}
```

### Conventional Commits

```
<tipo>(<escopo>): <descrição>

Exemplos:
feat: adiciona login
fix: corrige bug
chore: atualiza deps
docs: atualiza docs
```

---

## Migrations

### O que é

Sistema de controle de versão do banco de dados - aplicam alterações estruturais de forma controlada.

### Scripts SQL

```sql
-- Criar tabela
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Criar ENUM type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('EARNING', 'EXPENSE');
    END IF;
END$$;
```

### Executar migration (Node.js)

```javascript
import fs from 'fs'
import { pool } from '../helper.js'

const script = fs.readFileSync('./migrations/01-init.sql')
const client = await pool.connect()
await client.query(script.toString()) // Buffer precisa de .toString()
await client.release()
await pool.end()
```

### Erros Comuns

- `database "X" does not exist` → criar banco primeiro
- `A query must have either text or a name` → usar `.toString()` no Buffer

---

## Express

### O que é

Framework web minimalista para Node.js.

### Estrutura básica

```javascript
import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen(3000, () => console.log('Server running'))
```

### Rotas

```javascript
app.get('/users', async (req, res) => {
    const results = await db.query('SELECT * FROM users')
    res.json(results)
})

app.post('/users', async (req, res) => {
    // req.body contém dados do corpo da requisição
})
```

---

## Dotenv

### O que é

Carrega variáveis de ambiente de arquivo .env.

### Uso

```javascript
import 'dotenv/config'

// Acessar variáveis
const user = process.env.POSTGRES_USER
const password = process.env.POSTGRES_PASSWORD
```

### Arquivo .env

```env
POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
POSTGRES_HOST=localhost
POSTGRES_DB=financeapp
```

### Configuração (ES Modules)

- `import 'dotenv/config'` → funciona em .js com `"type": "module"`
- `import 'dotenv/config.js'` → alternativa explícita

---

## PostgreSQL + Node.js

### Pool de conexões

```javascript
import pg from 'pg'
const { Pool } = pg

export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
})
```

### Query helper

```javascript
export const PostgresHelper = {
    query: async (query, params) => {
        const client = await pool.connect()
        const results = await client.query(query, params)
        await client.release()
        return results.rows
    },
}
```

---

## Arquitetura: Repository → Use Case → Controller

### Visão Geral

```
Request → Controller → Use Case → Repository → Database
         ↓            ↓           ↓
      Validation   Business    Data Access
        Logic      Logic
```

### Repository

Responsável pela comunicação com o banco de dados.

```javascript
import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        await PostgresHelper.query(
            'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5);',
            [
                createUserParams.id,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        )
        const createdUser = await PostgresHelper.query(
            'SELECT * FROM users WHERE id = $1',
            [createUserParams.id],
        )
        return createdUser[0]
    }
}
```

### Use Case

Responsável pela lógica de negócio. Recebe dados do controller, orchestrando repositories.

```javascript
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(getUserByEmailRepository, createUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
    }
    async execute(createUserParams) {
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email)

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        const userId = uuidv4()
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        const createdUser = await this.createUserRepository.execute(user)
        return createdUser
    }
}
```

### Controller

Recebe a requisição HTTP, valida dados e delega para o Use Case. Retorna resposta HTTP.

```javascript
import {
    checkIfPasswordIsValid,
    generateInvalidEmailResponse,
    checkIfEmailIsValid,
    serverError,
    created,
    validateRequiredFields,
    requiredFieldIsMissingResponse,
} from '../helpers/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)
            if (!passwordIsValid) {
                return generateInvalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)
            if (!emailIsValid) {
                return generateInvalidEmailResponse()
            }

            const createdUser = await this.createUserUseCase.execute(params)
            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                throw new EmailAlreadyInUseError()
            }
            console.log('Error creating user:', error)
            return serverError()
        }
    }
}
```

### Factory (Injeção de Dependências)

Conecta as camadas injetando dependências.

```javascript
import { PostgresCreateUserRepository } from '../repositories/postgres/user/create-user.js'
import { CreateUserUseCase } from '../use-cases/user/create-user.js'
import { CreateUserController } from '../controllers/user/create-user.js'

export const makeCreateUser = () => {
    const createUserRepository = new PostgresCreateUserRepository()
    const createUserUseCase = new CreateUserUseCase(null, createUserRepository)
    const createUserController = new CreateUserController(createUserUseCase)
    return createUserController
}
```

### Errors Customizados

Herdam de `Error` e podem携带 dados específicos.

```javascript
export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`Email ${email} already in use`)
        this.name = 'EmailAlreadyInUseError'
    }
}
```

### Helpers (Controller)

Funções auxiliares para validação e respostas HTTP.

```javascript
export const validateRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        if (!params[field]) {
            return { ok: false, missingField: field }
        }
    }
    return { ok: true }
}

export const checkIfEmailIsValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const checkIfPasswordIsValid = (password) => {
    return password && password.length >= 6
}

export const serverError = () => ({
    statusCode: 500,
    body: { error: 'Internal server error' },
})

export const created = (data) => ({
    statusCode: 201,
    body: data,
})
```

---

## Bibliotecas

### bcrypt

Criptografia de senhas.

```javascript
import bcrypt from 'bcrypt'

const hashedPassword = await bcrypt.hash(password, 10)
const isValid = await bcrypt.compare(password, hashedPassword)
```

### uuid

Geração de IDs únicos.

```javascript
import { v4 as uuidv4 } from 'uuid'

const userId = uuidv4()
```

---

## Testar

```bash
npx eslint .
npx prettier --check .
echo "feat: test" | npx commitlint
```
