import mysql from 'mysql2/promise'
// import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

let bdConexao = null

try{
    bdConexao = await mysql.createConnection({ // createPool() para criar um pool de conexões
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        charset: 'utf8mb4',
        multipleStatements: true    
    })
    console.log('Conexão com o banco de dados estabelecida com sucesso!')
} catch (err) {
    console.error('Erro ao conectar ao banco de dados: ', err)
}

export default bdConexao
