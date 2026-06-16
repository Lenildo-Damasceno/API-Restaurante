import express from 'express';
import { listarUsuarios, criarUsuario, cadastrarUsuario, atualizarUsuario, removerUser, editarParcial } from '../controllers/controlUser.js';
import { validarPerfil } from '../middlewares/authUser.js';

const routeUser = express.Router();

routeUser.get('/', validarPerfil(['administrador']), listarUsuarios);
routeUser.post('/', validarPerfil, criarUsuario);
routeUser.get('/cadastroUsuario', validarPerfil(['administrador']), cadastrarUsuario);
routeUser.put('/:id', validarPerfil(['administrador']), atualizarUsuario);
routeUser.delete('/:id', validarPerfil(['administrador']), removerUser);
routeUser.patch('/:id', validarPerfil(['administrador']), editarParcial);

export default routeUser;