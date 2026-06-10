import Sequelize from 'sequelize'

// ============================================================
// NOVO (PostgreSQL + Neon):
// process.env.NODE_ENV === 'production' verifica se estamos
// rodando no Render. Se sim, usa o PostgreSQL pelo DATABASE_URL.
// Se não (desenvolvimento local), continua usando o SQLite.
// ============================================================
const isProducao = process.env.NODE_ENV === 'production'

// NOVO (PostgreSQL): conexão com o banco do Neon via DATABASE_URL
const sequelize = isProducao
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',           // NOVO: dialeto trocado de sqlite para postgres
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false } // NOVO: Neon exige SSL
      },
      logging: false
    })
  // SQLITE (desenvolvimento local — comentar quando não precisar mais):
  : new Sequelize({
      // dialect: 'sqlite',                              // SQLite: banco em arquivo local
      // storage: './src/database/restaurante.sqlite',  // SQLite: caminho do arquivo .sqlite
      dialect: 'sqlite',
      storage: './src/database/restaurante.sqlite',
      logging: false
    })

// Testa a conexão com o banco de dados
const conexaoBD = async () => {
    try {
        await sequelize.authenticate()
        console.log('Conexão com o banco de dados estabelecida com sucesso!')
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados: ', error)
    }
}
// Chama a função de conexão para garantir que o banco esteja acessível
conexaoBD()

// Exporta a função de sincronização do banco de dados para ser usada em outros arquivos
export const sincronizarBD = async () => {
    try {
        await sequelize.sync({ force: false }) // Use force: true para recriar as tabelas (cuidado com dados existentes)
        console.log('Banco de dados sincronizado com sucesso!')
    } catch (error) {
        console.error('Erro ao sincronizar o banco de dados: ', error)
    }
}
// Chama a função de sincronização para garantir que as tabelas estejam criadas
sincronizarBD()

export default sequelize
