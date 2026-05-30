import User from '../models/modelUSER.js'
import path from 'path'
import bcrypt from 'bcrypt'

export const login = (req, res) => {
    return res.sendFile(path.resolve('./public/html/login.html'))
}

export const validarLogin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' })
    }

    try {
        const usuario = await User.findOne({ where: { email } })

        if (!usuario) {
            return res.status(401).json({ message: 'Usuário não encontrado.' })
        }

        const senhaValida = await bcrypt.compare(password, usuario.password)

        if (!senhaValida) {
            return res.redirect('/login?erro=Senha invalida')
            // return res.status(401).json({ message: 'Senha inválida.' })
        }
        res.render('painel', { usuario }) // Renderiza a view 'painel' passando o usuário como contexto
        return res.status(200).json({
            message: 'Login realizado com sucesso.',
            usuario: {
                id: usuario.idUser,
                nome: usuario.nome,
                email: usuario.email
            }
        })
    } catch (error) {
        console.error('Erro ao validar login:', error)
        return res.status(500).json({ message: 'Erro ao validar login.' })
    }
}