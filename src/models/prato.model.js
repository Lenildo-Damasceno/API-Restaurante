import { DataTypes } from 'sequelize'
import sequelize from '../config/orm.js'

const Prato = sequelize.define('Prato', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preco: {
    type: DataTypes.REAL,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'pratos',
  timestamps: false
})

export default Prato
  /**
   * Lista todos os pratos cadastrados.
   */
  async listarTodos() {
    const pool = obterPool();

    return pool.query(sql`
      select id, nome, preco, categoria
      from pratos
      order by nome asc
    `);
  },

  /**
   * Busca um prato específico pelo identificador.
   */
  async buscarPorId(id) {
    const pool = obterPool();

    return pool.row(sql`
      select id, nome, preco, categoria
      from pratos
      where id = ${id}
    `);
  },

  /**
   * Salva um novo prato e retorna o dado persistido.
   */
  async criar(dadosPrato) {
    const pool = obterPool();

    await pool.exec(sql.insert('pratos', dadosPrato));

    return this.buscarPorId(dadosPrato.id);
  },

  /**
   * Atualiza um prato já existente e devolve o resultado final.
   */
  async atualizar(id, dadosPrato) {
    const pool = obterPool();

    await pool.exec(sql`
      update pratos
      set ${sql.set(dadosPrato)}
      where id = ${id}
    `);

    return this.buscarPorId(id);
  },

  /**
   * Exclui um prato pelo seu identificador.
   */
  async remover(id) {
    const pool = obterPool();

    await pool.exec(sql`
      delete from pratos
      where id = ${id}
    `);
  }
};

export default Prato;
