// src/db/postgres/client.js
import pg from 'pg'
import 'dotenv/config.js' // Importa o módulo dotenv para carregar variáveis de ambiente a partir de um arquivo .env

// Importa o módulo 'pg' para interagir com o banco de dados PostgreSQL
const { Pool } = pg

console.log(process.env.POSTGRES_USER) // Exibe o usuário do PostgreSQL para verificar se as variáveis de ambiente estão sendo carregadas corretamente

// Configura o pool de conexões com o banco de dados PostgreSQL
export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
})

// Helper para facilitar as operações com o banco de dados
export const PostgresHelper = {
    // Método para realizar consultas ao banco de dados
    query: async (query, params) => {
        // Obtém um cliente do pool
        const client = await pool.connect()

        // Realiza a consulta usando o cliente
        const results = await client.query(query, params)

        // Faz o release do cliente após a consulta
        await client.release()

        // Retorna os resultados da consulta
        return results.rows
    },
}
