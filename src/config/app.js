import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import routes from '../routes/index.js'
import sequelize from './orm.js'
import User from '../models/modelUSER.js'
import { apagarCache, autenticar, validarPerfil, exigirBancoConectado } from '../middlewares/authUser.js'
import 'dotenv/config'
import cookieParser from 'cookie-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../../')

const app = express() 

app.use(cookieParser()) 
app.use(apagarCache)
app.use(morgan('dev'))


app.use(express.static(path.join(rootDir, 'public'))) 

app.use(express.json()) 

app.use(express.urlencoded({ extended: true }))  

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.User = User
app.locals.statusBanco = { conectado: false }
app.use(exigirBancoConectado)

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.use('/', routes)

export default app
