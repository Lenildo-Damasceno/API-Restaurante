import { Router } from 'express';
import produtosRoutes from './produtos.routes.js';
import categoriasRoutes from './categorias.routes.js';
import movimentacoesRoutes from './movimentacoes.routes.js';

const router = Router();

router.use('/produtos', produtosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/movimentacoes', movimentacoesRoutes);

export default router;