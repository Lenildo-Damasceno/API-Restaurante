import express from 'express';
import {listarUsuarios} from '../controllers/controlUser.js';

const routeUser = express.Router();

routeUser.get('/', listarUsuarios);
routeUser.post('/', criarUsuario);;

export default routeUser;