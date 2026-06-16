import Cliente from './cliente.clean.model.js'
import Prato from './prato.clean.model.js'
import Pedido from './pedido.clean.model.js'
import ItemPedido from './itemPedido.clean.model.js'


Pedido.hasMany(ItemPedido, {
  foreignKey: 'idPedido',
  as: 'itens'
})


ItemPedido.belongsTo(Pedido, {
  foreignKey: 'idPedido',
  as: 'pedido'
})


ItemPedido.belongsTo(Prato, {
  foreignKey: 'idPrato',
  as: 'prato'
})

Prato.hasMany(ItemPedido, {
  foreignKey: 'idPrato'
})


Pedido.belongsTo(Cliente, {
  foreignKey: 'idCliente',
  as: 'cliente'
})


Cliente.hasMany(Pedido, {
  foreignKey: 'idCliente'
})

export { Cliente, Prato, Pedido, ItemPedido }
