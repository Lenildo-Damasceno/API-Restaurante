import express from 'express';
import { login, validarLogin } from '../controllers/login.controller.js';

const routeLogin = express.Router();

routeLogin.get('/', login);
routeLogin.post('/', validarLogin);
routeLogin.get('/validar', validarLogin);

export default routeLogin;
