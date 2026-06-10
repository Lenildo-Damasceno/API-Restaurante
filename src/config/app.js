import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import routes from '../routes/index.js'
import sequelize from './orm.js'
import User from '../models/modelUSER.js'
import session from 'express-session'
import { apagarCache } from '../middlewares/authUser.js'

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

// NOVO (PostgreSQL): sessão sem store de arquivo, funciona em qualquer banco
app.use(session({
  secret: process.env.SESSION_SECRET || 'restaurante-secreto', // NOVO: lê do .env em produção
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}))

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

try {
  await sequelize.authenticate()
  app.locals.statusBanco = {
    conectado: true,
    ultimaMensagem: 'Banco de dados conectado com sucesso!'
  }
  console.log('Banco conectado!')
} catch (error) {
  app.locals.statusBanco = {
    conectado: false,
    ultimaMensagem: `Erro: ${error.message}`
  }
  console.error('Erro ao conectar:', error.message)
}

app.use(exigirBancoConectado)

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.use('/', routes)

export default app
