import sequelize from '../config/orm.js'

/**
 * Middleware que verifica se o banco de dados está conectado.
 * Se não estiver, retorna erro 503 (Service Unavailable).
 */
export function exigirBancoConectado(req, res, next) {
  try {
    if (sequelize) {
      next()
    }
  } catch (erro) {
    console.error('Banco de dados não está disponível:', erro.message)
    res.status(503).json({ 
      erro: 'Banco de dados indisponível',
      mensagem: 'O serviço não está disponível no momento. Tente novamente mais tarde.'
    })
  }
}
