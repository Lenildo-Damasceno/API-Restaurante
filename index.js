// index.js - Ponto de entrada da aplicacao
import 'dotenv/config'
import app from './src/config/app.js'
import { sincronizarBD } from './src/config/orm.js'

console.log('Iniciando sincronizacao das tabelas...')
await sincronizarBD()

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}

try {
    app.locals.statusBanco = { conectado: true, modo: process.env.NODE_ENV }
} catch (error) {
    app.locals.statusBanco = { conectado: false, erro: error.message }
    console.error('Falha ao definir status do banco no app')
}

let port = process.env.PORT || process.env.EXPRESS_PORT
let host = process.env.EXPRESS_HOST || '0.0.0.0'

if (process.env.NODE_ENV === 'development') {
    port = 3000
    host = 'localhost'
} else {
    host = '0.0.0.0'
}

app.listen(port, host, () => {
    console.log(`Servidor em execucao em: http://${host}:${port}`)
})
