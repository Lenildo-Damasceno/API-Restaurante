import path from 'path'
import bcrypt from 'bcrypt'
import User from '../models/modelUSER.js'

export const login = (req, res) => {
    return res.sendFile(path.resolve('./public/html/login.html'))
}

export const validarLogin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha sao obrigatorios.' })
    }

    try {
        const usuario = await User.findOne({ where: { email } })

        if (!usuario) {
            return res.status(401).json({ message: 'Usuario nao encontrado.' })
        }

        const senhaValida = await bcrypt.compare(password, usuario.password)

        if (!senhaValida) {
            return res.redirect('/login?erro=Senha invalida')
        }

        return res.redirect('/painel')
    } catch (error) {
        console.error('Erro ao validar login:', error)
        return res.status(500).json({ message: 'Erro ao validar login.' })
    }
}
