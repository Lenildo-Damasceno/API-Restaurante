// index.js - Ponto de entrada da aplicação
import 'dotenv/config' // Carrega as variáveis de ambiente IMEDIATAMENTE
import app from './src/config/app.js'
import { sincronizarBD } from './src/config/orm.js'

// Sincroniza o banco de dados
console.log('Iniciando sincronização das tabelas...')
await sincronizarBD()

// Inicia o servidor Express
const port = process.env.PORT || process.env.EXPRESS_PORT
const host = process.env.EXPRESS_HOST || '0.0.0.0'

app.listen(port, host, () => { // servidor escutando na porta definida
    console.log(`Servidor em execução em: http://${host}:${port}`)
})