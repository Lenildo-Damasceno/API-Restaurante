import { Router } from 'express';
import {
  atualizarPrato,
  atualizarPratoParcial,
  buscarPratoPorId,
  criarPrato,
  listarPratos,
  removerPrato
} from '../controllers/prato.controller.js';

const router = Router();

router.get('/', listarPratos);
router.get('/:id', buscarPratoPorId);
router.post('/', criarPrato);
router.put('/:id', atualizarPrato);
router.patch('/:id', atualizarPratoParcial);
router.delete('/:id', removerPrato);

export default router;
