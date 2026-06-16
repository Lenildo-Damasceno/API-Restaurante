// index.js - Ponto de entrada da aplicação
import 'dotenv/config' // Carrega as variáveis de ambiente IMEDIATAMENTE
import app from './src/config/app.js'
import { sincronizarBD } from './src/config/orm.js'

// Sincroniza o banco de dados
console.log('Iniciando sincronização das tabelas...')
await sincronizarBD()

// Atualiza o status no app para liberar o middleware exigirBancoConectado
try {
    app.locals.statusBanco = { conectado: true, modo: process.env.NODE_ENV }
} catch (error) {
    app.locals.statusBanco = { conectado: false, erro: error.message }
    console.error('Falha ao definir status do banco no app')
}

// Inicia o servidor Express
let port = process.env.PORT || process.env.EXPRESS_PORT
let host = process.env.EXPRESS_HOST || '0.0.0.0'

if (process.env.NODE_ENV === 'development') {
    port = 3000
    host = 'localhost'
} else {
    host = '0.0.0.0'
}

app.listen(port, host, () => { // servidor escutando na porta definida
    console.log(`Servidor em execução em: http://${host}:${port}`)
})