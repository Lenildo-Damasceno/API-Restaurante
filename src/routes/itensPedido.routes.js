import { Router } from 'express';
import {
  atualizarItemPedido,
  atualizarItemPedidoParcial,
  buscarItemPedidoPorId,
  criarItemPedido,
  listarItensPedido,
  removerItemPedido
} from '../controllers/itemPedido.controller.js';
import { validarPerfil } from '../middlewares/authUser.js';

const router = Router();

router.get('/', listarItensPedido);
router.get('/:id', buscarItemPedidoPorId);
router.post('/', criarItemPedido);
router.put('/:id', validarPerfil(['administrador', 'gerente']), atualizarItemPedido);
router.patch('/:id', validarPerfil(['administrador', 'gerente']), atualizarItemPedidoParcial);
router.delete('/:id', validarPerfil(['administrador', 'gerente']), removerItemPedido);

export default router;