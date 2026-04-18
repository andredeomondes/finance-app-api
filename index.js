import 'dotenv/config.js'
import express from 'express'

const app = express()

app.use(express.json())

app.listen(process.env.port, () =>
    console.log('listening on port ' + process.env.port),
)
