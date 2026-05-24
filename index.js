import app from './src/config/app.js'
import dotenv from 'dotenv'
import { sincronizarBD } from './src/config/orm.js'

dotenv.config()

// Sincroniza o banco de dados
await sincronizarBD()

const port = process.env.EXPRESS_PORT 
const host = process.env.EXPRESS_HOST 

app.listen(port, host, () => {
    console.log(`Servidor em execução em: http://${host}:${port}`)
})