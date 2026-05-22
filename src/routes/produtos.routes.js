import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lista de produtos' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Detalhe do produto', id: req.params.id });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Produto criado', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Produto atualizado', id: req.params.id, data: req.body });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Produto removido', id: req.params.id });
});

export default router;