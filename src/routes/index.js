import { Router } from 'express';
import { autenticar, validarPerfil } from '../middlewares/authUser.js';
import pagesRoutes from './pages.routes.js';
import clientesRoutes from './clientes.routes.js';
import pratosRoutes from './pratos.routes.js';
import pedidosRoutes from './pedidos.routes.js';
import itensPedidoRoutes from './itensPedido.routes.js';
import { listarUsuarios, criarUsuario, cadastrarUsuario, atualizarUsuario, removerUser, editarParcial } from '../controllers/controlUser.js';
import routeUser from './user.routes.js';
import routeLogin from './login.routes.js';

const router = Router();

router.use('/painel', autenticar, pagesRoutes);
router.use('/clientes', autenticar, clientesRoutes);
router.use('/pratos', autenticar, validarPerfil(['administrador', 'gerente']), pratosRoutes);
router.use('/pedidos', autenticar, pedidosRoutes);
router.use('/itens-pedido', autenticar, itensPedidoRoutes);
router.use('/User', autenticar, validarPerfil(['administrador', 'gerente']), routeUser);
router.use('/login', routeLogin);







export default router;
