import bcrypt from 'bcrypt'
import path from 'path'
import User from '../models/modelUSER.js'

export async function listarUsuarios(req, res) {
    try {
        const usuarios = await User.findAll()
        return res.status(200).json(usuarios)
    } catch (error) {
        console.error('Erro ao listar usuarios:', error)
        return res.status(500).json({ error: 'Erro ao listar usuarios' })
    }
}

export const criarUsuario = async (req, res) => {
    try {
        const nome = req.body.nome || req.body.username
        const email = req.body.email
        const senha = req.body.senha || req.body.password
        const confirmarSenha = req.body.confirmarSenha || req.body.confirmPassword

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Nome, email e senha sao campos obrigatorios' })
        }

        if (confirmarSenha && senha !== confirmarSenha) {
            return res.status(400).json({ error: 'As senhas nao conferem' })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)
        await User.create({ nome, email, password: senhaCriptografada })
        return res.status(201).json({ message: 'Usuario criado com sucesso' })
    } catch (error) {
        console.error('Erro ao criar usuario:', error)
        return res.status(500).json({ error: 'Erro ao criar usuario' })
    }
}

export const cadastrarUsuario = async (req, res) => {
    try {
        return res.sendFile(path.resolve('./public/html/cadastro_Usuario.html'))
    } catch (error) {
        console.error('Erro ao enviar arquivo de cadastro:', error)
        return res.status(500).json({ error: 'Erro ao abrir pagina de cadastro' })
    }
}
