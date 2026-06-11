import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import routes from '../routes/index.js'
import sequelize from './orm.js'
import User from '../models/modelUSER.js'
import session from 'express-session'
import { apagarCache } from '../middlewares/authUser.js'
import SequelizeStore from 'connect-session-sequelize'

// Inicializa o armazenamento de sessão baseado no Sequelize
const SessionStore = SequelizeStore(session.Store)

// SQLITE (armazenava sessões em arquivo local — substituído abaixo):
// import connectSqlite3 from 'connect-sqlite3'
// const SQLiteStore = connectSqlite3(session)

// NOVO (PostgreSQL): sessões armazenadas em memória no servidor
// Em produção seria ideal usar connect-pg-simple para salvar no PostgreSQL,
// mas para essa etapa o MemoryStore do express-session já funciona.

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../../')

const app = express()

// Inicializa status do banco como desconectado
app.locals.statusBanco = {
  conectado: false,
  ultimaMensagem: 'Conectando ao banco de dados...'
}
app.use(apagarCache)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(rootDir, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.User = User

// SQLITE (configuração antiga de sessão com arquivo SQLite):
// app.use(session({
//   store: new SQLiteStore({
//     db: 'restaurante.sqlite',          // nome do arquivo SQLite
//     dir: './src/database',             // pasta onde ficava o arquivo
//     table: 'sessions',                 // tabela de sessões
//     ttl: 60 * 60 * 24,                // duração: 24h
//     concurrentDB: true
//   }),
//   secret: 'restaurante-secreto',
//   resave: false,
//   saveUninitialized: false,
//   rolling: true,
//   cookie: { maxAge: 1000 * 60 * 60 }
// }))

// Armazenamento de sessão persistente no banco de dados (Sequelize)
const mySessionStore = new SessionStore({ db: sequelize })

app.use(session({
  store: mySessionStore,
  secret: process.env.SESSION_SECRET || 'restaurante-secreto', // NOVO: lê do .env em produção
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}))

// Cria a tabela de sessões automaticamente se não existir
mySessionStore.sync()

export function exigirBancoConectado(req, res, next) {
  if (req.path.startsWith('/login')) {
    return next()
  }

  if (app.locals.statusBanco?.conectado) {
    next()
  } else {
    console.error('Banco de dados nao esta disponivel')
    res.status(503).json({
      erro: 'Banco de dados indisponivel',
      mensagem: 'O servico nao esta disponivel no momento. Tente novamente mais tarde.'
    })
  }
}

// Middleware para proteger rotas exclusivas de admin
export function exigirAdmin(req, res, next) {
  if (req.session.userId && req.session.userId.perfil === 'admin') {
    return next()
  }
  console.warn('Acesso negado: Usuário não é administrador.')
  res.status(403).send('Acesso negado. Apenas administradores podem acessar esta página.')
}

try {
  await sequelize.authenticate()
  app.locals.statusBanco = {
    conectado: true,
    ultimaMensagem: 'Banco de dados conectado com sucesso!'
  }
  const dialeto = sequelize.getDialect()
  console.log(`✅ Sucesso: Conectado ao banco de dados (${dialeto}).`)
} catch (error) {
  app.locals.statusBanco = {
    conectado: false,
    ultimaMensagem: `Erro: ${error.message}`
  }
  console.error('❌ FALHA AO CONECTAR NO BANCO DE DADOS:')
  console.error(error)
}

app.use(exigirBancoConectado)

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.use('/', routes)

export default app
