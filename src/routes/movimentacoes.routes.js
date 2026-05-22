import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lista de movimentações' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Detalhe da movimentação', id: req.params.id });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Movimentação criada', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Movimentação atualizada', id: req.params.id, data: req.body });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Movimentação removida', id: req.params.id });
});

export default router;