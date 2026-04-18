// index.js
import express from 'express'

// Importa o pool de conexões do PostgreSQL
import { PostgresHelper } from './src/db/postgres/helper.js'

// Cria uma instância do Express
const app = express()

// Define uma rota para a raiz do servidor
app.get('/', async (req, res) => {
    // Realiza uma consulta ao banco de dados para obter todos os usuários
    const results = await PostgresHelper.query('SELECT * FROM users;')

    // Envia os resultados da consulta como resposta em formato JSON
    res.send(JSON.stringify(results.rows))
})

// Inicia o servidor na porta 3000 e exibe uma mensagem no console
app.listen(3000, () => console.log('Server is running on port 3000'))
