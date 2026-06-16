import Sequelize from 'sequelize'
import sequelize from '../config/orm.js'

const { DataTypes } = Sequelize

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
  if (!linha) {
    return null;
  }

  return {
    id: linha.id,
    quantidade: Number(linha.quantidade),
    idPedido: linha.idPedido,
    idPrato: linha.idPrato,
    pedido: linha.idPedido
      ? {
          id: linha.idPedido,
          mesa: linha.pedidoMesa === null ? null : Number(linha.pedidoMesa),
          status: linha.pedidoStatus
        }
      : null,
    prato: linha.idPrato
      ? {
          id: linha.idPrato,
          nome: linha.pratoNome,
          preco: linha.pratoPreco,
          categoria: linha.pratoCategoria
        }
      : null
  };



const ItemPedido = {
  async listarTodos() {
    const pool = obterPool();
    const linhas = await pool.query(sql`
      select
        i.id,
        i.quantidade,
        i.idPedido,
        i.idPrato,
        p.mesa as pedidoMesa,
        p.status as pedidoStatus,
        pr.nome as pratoNome,
        pr.preco as pratoPreco,
        pr.categoria as pratoCategoria
      from itensPedido i
      left join pedidos p on p.id = i.idPedido
      left join pratos pr on pr.id = i.idPrato
      order by i.id asc
    `);

    return linhas.map(mapearItemPedido);
  },

 
  async buscarPorId(id) {
    const pool = obterPool();
    const linha = await pool.row(sql`
      select
        i.id,
        i.quantidade,
        i.idPedido,
        i.idPrato,
        p.mesa as pedidoMesa,
        p.status as pedidoStatus,
        pr.nome as pratoNome,
        pr.preco as pratoPreco,
        pr.categoria as pratoCategoria
      from itensPedido i
      left join pedidos p on p.id = i.idPedido
      left join pratos pr on pr.id = i.idPrato
      where i.id = ${id}
    `);

    return mapearItemPedido(linha);
  },


  async criar(dadosItemPedido) {
    const pool = obterPool();

    await pool.exec(sql.insert('itensPedido', dadosItemPedido));

    return this.buscarPorId(dadosItemPedido.id);
  },

 
  async atualizar(id, dadosItemPedido) {
    const pool = obterPool();

    await pool.exec(sql`
      update itensPedido
      set ${sql.set(dadosItemPedido)}
      where id = ${id}
    `);

    return this.buscarPorId(id);
  },

 
  async remover(id) {
    const pool = obterPool();

    await pool.exec(sql`
      delete from itensPedido
      where id = ${id}
    `);
  },
  async removerPorPedido(idPedido) {
    const pool = obterPool();

    await pool.exec(sql`
      delete from itensPedido
      where idPedido = ${idPedido}
    `);
  },

 



  async contarPorPrato(idPrato) {
    const pool = obterPool();

    return pool.count(sql`
      select *
      from itensPedido
      where idPrato = ${idPrato}
    `);
  }
};

export default ItemPedido;
