import express from 'express';
import {listarUsuarios,criarUsuario,cadastrarUsuario} from '../controllers/controlUser.js';

const routeUser = express.Router();

routeUser.get('/', listarUsuarios);
routeUser.post('/', criarUsuario);
routeUser.get('/cadastroUsuario', cadastrarUsuario);

export default routeUser;