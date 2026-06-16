import Sequelize from 'sequelize'




const isProd = process.env.NODE_ENV === 'production'
const sequelize = isProd
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',           
      dialectOptions: {
        ssl: { rejectUnauthorized: false },
        keepAlive: true   
      },
      pool: {
        max: 5,                      
        min: 0,
        acquire: 30000,             
        idle: 10000                  
      },
      logging: false 
    })
  
  : new Sequelize({
      dialect: 'sqlite',
      storage: './src/database/restaurante.sqlite',
      logging: console.log             
    })
    



const conexaoBD = async () => {
    try {
        await sequelize.authenticate()
        console.log('Conexão com o banco de dados estabelecida com sucesso!')
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados: ', error)
    }
}



export const sincronizarBD = async () => {
    try {
        await sequelize.sync({ force: false }) 
        console.log('Banco de dados sincronizado com sucesso!')
    } catch (error) {
        console.error('Erro ao sincronizar o banco de dados: ', error)
    }
}





export default sequelize
