import User from '../models/modelUSER.js'
import crypto from 'crypto'


 export async function listarUsuarios(req, res) {
    try {
        User.findAll()
        const usuarios = await User.findAll()
        res.status(200).json(usuarios)
    } catch (error) {
        console.error('Erro ao listar usuários:', error)
        return res.status(500).json({ error: 'Erro ao listar usuários' })
    }



    export const criarUsuario = async (req, res) => {
    }; try {
        const { nome, email, senha } = req.body
        if (!nome && !email && !senha) {
            return res.status(400).json({ error: 'Nome, email e senha são campos obrigatórios' })
        }

       const senhaCriptografada = crypto.createHash('sha256').update(senha).digest('hex')



        const novoUsuario = await User.create({ nome, email, senha: senhaCriptografada })

        res.status(201).json(novoUsuario)
    } finally { }
}