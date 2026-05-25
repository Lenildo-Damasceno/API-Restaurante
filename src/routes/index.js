import { Router } from 'express';
import { mostrarInicio, mostrarStatus } from '../controllers/home.controller.js';
import { exigirBancoConectado } from '../config/app.js';
import pagesRoutes from './pages.routes.js';
import clientesRoutes from './clientes.routes.js';
import pratosRoutes from './pratos.routes.js';
import pedidosRoutes from './pedidos.routes.js';
import itensPedidoRoutes from './itensPedido.routes.js';

const router = Router();

router.get('/', mostrarInicio);
router.get('/status', mostrarStatus);
router.use('/painel', pagesRoutes);
router.use('/clientes', exigirBancoConectado, clientesRoutes);
router.use('/pratos', exigirBancoConectado, pratosRoutes);
router.use('/pedidos', exigirBancoConectado, pedidosRoutes);
router.use('/itens-pedido', exigirBancoConectado, itensPedidoRoutes);

export default router;
