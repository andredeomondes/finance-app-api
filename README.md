# Finance App API

API RESTful para gerenciamento de finanças pessoais, construída com Node.js, Express e Prisma.

## 🚀 Tecnologias

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **ORM**: Prisma 7 + PostgreSQL
- **Validação**: Zod 4
- **Testes**: Jest + Faker
- **Qualidade**: ESLint, Prettier, Husky, Commitlint

## ✨ Funcionalidades

- **Usuários**: CRUD completo com hash de senha (bcrypt)
- **Transações**: Criar, listar, atualizar e deletar transações
- **Tipos de transação**: EARNING (ganhos), EXPENSE (despesas), INVESTMENT (investimentos)
- **Saldo**: Cálculo automático do saldo do usuário baseado nas transações
- **Validação**: Schemas Zod para validação de entrada
- **Arquitetura limpa**: Repository → Use Case → Controller

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm

## ⚙️ Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd finance-app-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Suba o banco de dados com Docker
docker-compose up -d

# Execute as migrações do Prisma
npx prisma migrate dev

# Gere o Prisma Client
npx prisma generate
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=finance-app
PORT=3000
```

## 🐳 Banco de Dados

O projeto usa PostgreSQL via Docker:

```bash
# Subir o banco
docker-compose up -d

# Parar o banco
docker-compose down

# Ver logs
docker-compose logs -f postgres
```

## 📜 Scripts Disponíveis

```bash
npm run start:dev     # Inicia o servidor com hot-reload
npm test              # Executa os testes com Jest
npx prisma studio     # Interface visual para o banco
npx prisma migrate dev # Executa migrações em desenvolvimento
npx prisma generate   # Gera o Prisma Client
```

## 🏗️ Arquitetura

```
Request → Controller → Use Case → Repository → Database
```

- **Controllers**: Validação (Zod) e respostas HTTP
- **Use Cases**: Lógica de negócio
- **Repositories**: Acesso ao banco via Prisma
- **Factories**: Injeção de dependências
- **Schemas**: Validação com Zod

## 📁 Estrutura do Projeto

```
src/
├── controllers/       # Handlers HTTP
│   ├── user/         # Controllers de usuário
│   ├── transaction/  # Controllers de transação
│   └── helpers/      # Utilitários HTTP e validação
├── use-cases/        # Lógica de negócio
│   ├── user/
│   └── transaction/
├── repositories/     # Acesso ao banco (Prisma)
│   └── postgres/
├── factories/        # Injeção de dependências
├── schemas/          # Validação Zod
├── errors/           # Erros customizados
└── generated/prisma/ # Prisma Client (gerado)
```

## 🔌 Endpoints da API

### Usuários (`/api/users`)

| Método | Endpoint                     | Descrição              |
| ------ | ---------------------------- | ---------------------- |
| POST   | `/api/users`                 | Criar usuário          |
| GET    | `/api/users/:userId`         | Buscar usuário por ID  |
| PATCH  | `/api/users/:userId`         | Atualizar usuário      |
| DELETE | `/api/users/:userId`         | Deletar usuário        |
| GET    | `/api/users/:userId/balance` | Obter saldo do usuário |

### Transações (`/api/transactions`)

| Método | Endpoint                           | Descrição                     |
| ------ | ---------------------------------- | ----------------------------- |
| POST   | `/api/transactions`                | Criar transação               |
| GET    | `/api/transactions?user_id=:id`    | Listar transações por usuário |
| PATCH  | `/api/transactions/:transactionId` | Atualizar transação           |
| DELETE | `/api/transactions/:transactionId` | Deletar transação             |

### Exemplo de Criação de Usuário

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "João",
    "last_name": "Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Exemplo de Criação de Transação

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-do-usuario",
    "name": "Salário",
    "date": "2026-05-06",
    "amount": 5000.00,
    "type": "EARNING"
  }'
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Ver cobertura
npm test -- --coverage
```

Testes unitários com Jest e dados gerados via Faker.

## 📊 Modelo do Banco (Prisma)

```prisma
model User {
  id            String        @id @default(uuid())
  first_name    String        @db.VarChar(50)
  last_name     String        @db.VarChar(50)
  email         String        @db.VarChar(100) @unique
  password      String        @db.VarChar(100)
  transactions  Transaction[]
}

model Transaction {
  id        String          @id @default(uuid())
  user_id   String
  user      User            @relation(fields: [user_id], references: [id])
  name      String          @db.VarChar(50)
  date      DateTime        @db.Date
  amount    Decimal         @db.Decimal(10, 2)
  type      TransactionType
}

enum TransactionType {
  EARNING
  EXPENSE
  INVESTMENT
}
```

## 🎨 Padrões de Código

- **Commits**: Conventional Commits (validado pelo Commitlint)
- **Formatação**: Prettier
- **Lint**: ESLint
- **Hooks**: Husky + lint-staged (executa lint e testes antes do commit)

## 📝 Licença

MIT
