import Sequelize from 'sequelize'





const isProd = process.env.NODE_ENV === 'production'

// Usa Neon em produção, SQLite em desenvolvimento
const sequelize = isProd
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',           // NOVO: dialeto trocado de sqlite para postgres
      dialectOptions: {
        ssl: { rejectUnauthorized: false },
        keepAlive: true              // Ajuda a manter a conexão estável com o Neon
      },
      pool: {
        max: 5,                      // Máximo de conexões simultâneas
        min: 0,
        acquire: 30000,              // Tempo máximo (ms) tentando conectar antes do erro
        idle: 10000                  // Tempo antes de liberar conexão ociosa
      },
      logging: false
    })
  // Fallback para SQLite para evitar que o app quebre se a URL sumir
  : new Sequelize({
      dialect: 'sqlite',
      storage: './src/database/restaurante.sqlite',
      logging: true                  // Habilita logs SQL em desenvolvimento
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

// Exporta a função de sincronização do banco de dados para ser usada em outros arquivos
export const sincronizarBD = async () => {
    try {
        await sequelize.sync({ alter: true }) // 'alter' ajusta a tabela sem apagar os dados
        console.log('Banco de dados sincronizado com sucesso!')
    } catch (error) {
        console.error('Erro ao sincronizar o banco de dados: ', error)
    }
}

export default sequelize
