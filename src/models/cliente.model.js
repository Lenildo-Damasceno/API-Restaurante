import Sequelize from 'sequelize';
import sequelize from '../config/orm.js';

const { DataTypes } = Sequelize;


const Cliente = {
  
  async listarTodos() {
    const pool = obterPool();

    return pool.query(sql`
      select id, nome, telefone
      from clientes
      order by nome asc
    `);
  },

  
  async buscarPorId(id) {
    const pool = obterPool();

    return pool.row(sql`
      select id, nome, telefone
      from clientes
      where id = ${id}
    `);
  },

  async criar(dadosCliente) {
    const pool = obterPool();

    await pool.exec(sql.insert('clientes', dadosCliente));

    return this.buscarPorId(dadosCliente.id);
  },

  
  async atualizar(id, dadosCliente) {
    const pool = obterPool();

    await pool.exec(sql`
      update clientes
      set ${sql.set(dadosCliente)}
      where id = ${id}
    `);

    return this.buscarPorId(id);
  },

 
  async remover(id) {
    const pool = obterPool();

    await pool.exec(sql`
      delete from clientes
      where id = ${id}
    `);
  },

  
  async contarPedidosVinculados(idCliente) {
    const pool = obterPool();

    return pool.count(sql`
      select *
      from pedidos
      where idCliente = ${idCliente}
    `);
  }
};

export default Cliente;
