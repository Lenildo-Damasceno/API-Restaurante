// index.js - Ponto de entrada da aplicação
import 'dotenv/config' 
import app from './src/config/app.js'
import { sincronizarBD } from './src/config/orm.js'
import User from './src/models/modelUSER.js'
import bcrypt from 'bcrypt'

console.log('Iniciando sincronização das tabelas...')
await sincronizarBD()

// Configuração essencial para cookies seguros em produção (atrás de proxies como Heroku/Nginx)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}

try {
    const totalUsers = await User.count()
    if (totalUsers === 0) {
        console.log('Nenhum usuário encontrado. Criando administrador padrão...')
        const senhaCriptografada = await bcrypt.hash('admin123', 10)
        await User.create({
            nome: 'Admin Padrão',
            email: 'admin@admin.com',
            password: senhaCriptografada,
            perfil: 'administrador'
        })
        console.log('Administrador padrão criado com sucesso! E-mail: admin@admin.com | Senha: admin123')
    }
} catch (error) {
    console.error('Erro ao verificar ou criar o usuário padrão:', error)
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
    console.log(`Servidor em execução em: http://${host}:${port}`)
})