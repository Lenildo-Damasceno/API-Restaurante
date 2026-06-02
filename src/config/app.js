import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import routes from '../routes/index.js'
import sequelize from './orm.js'
import User from '../models/modelUSER.js'
import session from 'express-session' 



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../../')

const app = express()

// Inicializa status do banco como desconectado
app.locals.statusBanco = {
  conectado: false,
  ultimaMensagem: 'Conectando ao banco de dados...'
}

app.use(morgan('dev')) // middleware de logging
app.use(express.json()) //middleware para fazer o parsear JSON no corpo das requisições
app.use(express.urlencoded({extended: true})) //middleware para fazer o parsear dados de formulários (x-www-form-urlencoded)
app.use(express.static(path.join(rootDir, 'public'))) //middleware para arquivos estáticos (como HTML, CSS, JS) da pasta 'public'
app.set('view engine', 'ejs') // Configura o mecanismo de visualização para EJS
app.set('views', path.join(__dirname, '../views')) // Configura o diretório onde estão as views (arquivos EJS)
app.User = User // Torna o modelo User acessível em todo o aplicativo através de app.User

/**
 * Middleware que verifica se o banco de dados está conectado.
 * Se não estiver, retorna erro 503 (Service Unavailable).
 */
export function exigirBancoConectado(req, res, next) {
  if (req.path.startsWith('/login')) {
    return next()
  }

  if (app.locals.statusBanco?.conectado) {
    next()
  } else {
    console.error('❌ Banco de dados não está disponível')
    res.status(503).json({
      erro: 'Banco de dados indisponível',
      mensagem: 'O serviço não está disponível no momento. Tente novamente mais tarde.'
    })
  }
}

// Testa conexão com o banco
try {
  await sequelize.authenticate()
  app.locals.statusBanco = {
    conectado: true,
    ultimaMensagem: 'Banco de dados conectado com sucesso!'
  }
  console.log('✅ Banco conectado!')
} catch (error) {
  app.locals.statusBanco = {
    conectado: false,
    ultimaMensagem: `Erro: ${error.message}`
  }
  console.error('❌ Erro ao conectar:', error.message)
}

// Aplica o middleware de verificação de banco em todas as rotas
app.use(exigirBancoConectado)

app.use('/', routes) // Usa as rotas definidas no arquivo de rotas para a raiz do aplicativo

app.get('/', (req, res) => {
    res.render('index', { login: {}, statusBanco: app.locals.statusBanco, title: 'API-Restaurante', message: 'O painel dinâmico depende do banco conectado.', endpoints: ['GET /status', 'GET /painel', 'GET /painel/clientes', 'GET /painel/pratos', 'GET /painel/pedidos', 'GET /painel/itens-pedido'] }) // Renderiza a view 'index' e passa o objeto 'login' para a view
})

export default app
