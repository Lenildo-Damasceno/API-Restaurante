import { DataTypes } from 'sequelize';
import sequelize from '../config/orm.js';

const Movimentacao = sequelize.define('Movimentacao', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'saida'),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  observacao: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  produtoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default Movimentacao;