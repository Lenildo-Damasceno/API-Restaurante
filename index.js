import express from 'express';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import sequelize, { sincronizarBD } from './src/config/orm.js';
import { Categoria, Produto, Movimentacao } from './src/models/index.js';

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 3000;
const host = process.env.EXPRESS_HOST || '0.0.0.0';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, './src/public')));
app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, './src/views'));

app.use(routes);

app.get('/', (req, res) => {
  res.render('index', { nome: 'Visitante' });
});

void sequelize;
void Categoria;
void Produto;
void Movimentacao;

sincronizarBD().catch((error) => {
  console.error('Erro ao sincronizar o banco:', error.message);
});

app.listen(process.env.EXPRESS_PORT, process.env.EXPRESS_HOST, () => {
  console.log(`Servidor em execução em: http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
});
