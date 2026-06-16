import { Router } from 'express';
import {
  atualizarPedido,
  atualizarPedidoParcial,
  buscarPedidoPorId,
  criarPedido,
  listarPedidos,
  removerPedido
} from '../controllers/pedido.controller.js';
import { validarPerfil } from '../middlewares/authUser.js';

const router = Router();

router.get('/', listarPedidos);
router.get('/:id', buscarPedidoPorId);
router.post('/', criarPedido);
router.put('/:id', validarPerfil(['administrador', 'gerente']), atualizarPedido);
router.patch('/:id', validarPerfil(['administrador', 'gerente']), atualizarPedidoParcial);
router.delete('/:id', validarPerfil(['administrador', 'gerente']), removerPedido);

export default router;