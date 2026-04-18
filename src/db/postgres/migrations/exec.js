// 1. O dotenv deve ser configurado ANTES de importar o pool
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../helper.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execMigrations = async () => {
    let client // Declarada no escopo da função
    try {
        const filePath = path.join(__dirname, '01-init.sql')
        const script = fs.readFileSync(filePath)

        // CORREÇÃO: Removi o "const" aqui para usar a variável do escopo acima
        client = await pool.connect()

        await client.query(script.toString())
        console.log('Migrations executed successfully')
    } catch (error) {
        console.error('Error executing migrations:', error)
    } finally {
        if (client) {
            // CORREÇÃO: release é uma função, precisa dos parênteses ()
            await client.release()
        }
        await pool.end()
    }
}

execMigrations()
