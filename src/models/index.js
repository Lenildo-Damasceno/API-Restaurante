import Categoria from './categoria.model.js';
import Produto from './produto.model.js';
import Movimentacao from './movimentacao.model.js';
import sequelize from '../config/orm.js';

Produto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
Categoria.hasMany(Produto, { foreignKey: 'categoriaId', as: 'produtos' });

Movimentacao.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' });
Produto.hasMany(Movimentacao, { foreignKey: 'produtoId', as: 'movimentacoes' });

export {
  sequelize,
  Categoria,
  Produto,
  Movimentacao
};