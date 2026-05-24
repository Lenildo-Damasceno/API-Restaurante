import { DataTypes } from 'sequelize'
import sequelize from '../config/orm.js'

const ItemPedido = sequelize.define('ItemPedido', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idPedido: {
    type: DataTypes.STRING,
    foreignKey: true
  },
  idPrato: {
    type: DataTypes.STRING,
    foreignKey: true
  }
}, {
  tableName: 'itensPedido',
  timestamps: false
})

export default ItemPedido
