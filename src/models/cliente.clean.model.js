import { DataTypes } from 'sequelize'
import sequelize from '../config/orm.js'

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'clientes',
  timestamps: false
})

export default Cliente
