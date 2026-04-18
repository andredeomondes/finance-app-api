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

## Testar

```bash
npx eslint .
npx prettier --check .
echo "feat: test" | npx commitlint
```
