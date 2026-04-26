# finance-app-api

API para gerenciamento de finanças pessoais.

## Setup

```bash
npm install
npm run migrations
```

## Scripts

- `npm run migrations` - Executa migrações do banco

## Arquitetura

```
Request → Controller → Use Case → Repository → Database
```

- **Controller**: Valida dados da requisição HTTP
- **Use Case**: Lógica de negócio
- **Repository**: Acesso ao banco de dados

## Stack

- Node.js + Express
- PostgreSQL (pg)
- bcrypt (hash de senhas)
- uuid (IDs únicos)
- ESLint + Prettier + Husky
