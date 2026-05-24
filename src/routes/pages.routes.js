import { Router } from 'express';
import {
  cadastrarClientePelaPagina,
  cadastrarItemPedidoPelaPagina,
  cadastrarPedidoPelaPagina,
  cadastrarPratoPelaPagina,
  mostrarDashboard,
  mostrarPaginaClientes,
  mostrarPaginaItensPedido,
  mostrarPaginaPedidos,
  mostrarPaginaPratos
} from '../controllers/pages.controller.js';
import { exigirBancoConectado } from '../config/middleware.js';

const router = Router();

router.get('/', exigirBancoConectado, mostrarDashboard);
router.get('/clientes', exigirBancoConectado, mostrarPaginaClientes);
router.post('/clientes', exigirBancoConectado, cadastrarClientePelaPagina);
router.get('/pratos', exigirBancoConectado, mostrarPaginaPratos);
router.post('/pratos', exigirBancoConectado, cadastrarPratoPelaPagina);
router.get('/pedidos', exigirBancoConectado, mostrarPaginaPedidos);
router.post('/pedidos', exigirBancoConectado, cadastrarPedidoPelaPagina);
router.get('/itens-pedido', exigirBancoConectado, mostrarPaginaItensPedido);
router.post('/itens-pedido', exigirBancoConectado, cadastrarItemPedidoPelaPagina);

export default router;
