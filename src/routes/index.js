import { Router } from 'express';
import { mostrarInicio } from '../controllers/home.controller.js';
import { autenticar, validarPerfil } from '../middlewares/authUser.js';
import pagesRoutes from './pages.routes.js';
import clientesRoutes from './clientes.routes.js';
import pratosRoutes from './pratos.routes.js';
import pedidosRoutes from './pedidos.routes.js';
import itensPedidoRoutes from './itensPedido.routes.js';
import { listarUsuarios, criarUsuario, cadastrarUsuario, atualizarUsuario, removerUser, editarParcial } from '../controllers/controlUser.js';
import routeUser from './user.routes.js';
import routeLogin from './login.routes.js';
import { telaRecuperarSenha, recuperarSenha, telaNovaSenha, salvarNovaSenha } from '../controllers/login.controller.js';

const router = Router();

router.get('/', mostrarInicio);
router.use('/painel', autenticar, pagesRoutes);
router.use('/clientes', autenticar, clientesRoutes);
router.use('/pratos', autenticar, validarPerfil(['administrador', 'gerente']), pratosRoutes);
router.use('/pedidos', autenticar, pedidosRoutes);
router.use('/itens-pedido', autenticar, itensPedidoRoutes);
router.get('/User/cadastroUsuario', cadastrarUsuario);
router.post('/User', criarUsuario);
router.use('/User', autenticar, validarPerfil(['admin']), routeUser);
router.get('/login/recuperar-senha', telaRecuperarSenha);
router.post('/login/recuperar-senha', recuperarSenha);
router.get('/login/nova-senha', telaNovaSenha);
router.post('/login/nova-senha', salvarNovaSenha);
router.use('/login', routeLogin);//







export default router;
