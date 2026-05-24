import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import routes from '../routes/index.js'
import sequelize from './orm.js'

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

app.use('/', routes) // Usa as rotas definidas no arquivo de rotas para a raiz do aplicativo

app.get('/', (req, res) => {
    res.render('index', { login: {}, statusBanco: app.locals.statusBanco, title: 'API-Restaurante', message: 'O painel dinâmico depende do banco conectado.', endpoints: ['GET /status', 'GET /painel', 'GET /painel/clientes', 'GET /painel/pratos', 'GET /painel/pedidos', 'GET /painel/itens-pedido'] }) // Renderiza a view 'index' e passa o objeto 'login' para a view
})

export default app
