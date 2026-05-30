import express from 'express';
import { login, validarLogin } from '../controllers/login.controller.js';

const routeLogin = express.Router();

routeLogin.get('/', login);
routeLogin.post('/', validarLogin);
routeLogin.get('/validar', validarLogin);
routeLogin.put('/', atualizarUser);
routeLogin.delete('/', deletarUser);
routeLogin.patch('/', atualizarParcialUser);

export default routeLogin;