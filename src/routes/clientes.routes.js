import { Router } from 'express';
import {
  atualizarCliente,
  atualizarClienteParcial,
  buscarClientePorId,
  criarCliente,
  listarClientes,
  removerCliente
} from '../controllers/cliente.controller.js';
import { validarPerfil } from '../middlewares/authUser.js';

const router = Router();

router.get('/', listarClientes);
router.get('/:id', buscarClientePorId);
router.post('/', criarCliente);
router.put('/:id', validarPerfil(['administrador', 'gerente']), atualizarCliente);
router.patch('/:id', validarPerfil(['administrador', 'gerente']), atualizarClienteParcial);
router.delete('/:id', validarPerfil(['administrador', 'gerente']), removerCliente);

export default router;