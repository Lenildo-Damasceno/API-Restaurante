import bcrypt from 'bcrypt'
import User from '../models/modelUSER.js'
import { normalizarPerfil } from '../middlewares/authUser.js'



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
        const perfil = normalizarPerfil(req.body.perfil || 'cliente')

        if (!nome || !email || !senha) {
            return res.redirect(`/user/cadastroUsuario?error=${encodeURIComponent('Nome, email e senha são obrigatórios.')}`)
        }

        if (confirmarSenha && senha !== confirmarSenha) {
            return res.redirect(`/user/cadastroUsuario?error=${encodeURIComponent('As senhas não conferem.')}`)
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)
        await User.create({ nome, email, password: senhaCriptografada, perfil })
        
        
        return res.redirect('/painel?success=' + encodeURIComponent('Usuário criado com sucesso!'))

    } catch (error) {
        console.error('Erro ao criar usuario:', error)
        return res.redirect('/painel?error=' + encodeURIComponent('Erro ao criar usuário.'))
    }
}




export const cadastrarUsuario = async (req, res) => {
    try {
        return res.render('cadastro-usuario', {
            pageTitle: 'Cadastrar Usuário',
            currentPath: req.originalUrl,
            usuario: req.user,
            statusBanco: req.app.locals.statusBanco,
            feedback: null
        });
    } catch (error) {
        console.error('Erro ao enviar arquivo de cadastro:', error)
        return res.status(500).json({ error: 'Erro ao abrir pagina de cadastro' })
    }
}




export const atualizarUsuario = async (req, res) => {
    const id = req.params.id
    const { nome, email, senha , perfil} = req.body

    try {
        const usuarioBD = await User.findOne({ where: { email } })

        if (!usuarioBD) {
            return res.status(404).json({ message: 'Usuario nao encontrado.' })
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        await User.update({ nome, email, password: senhaCriptografada, perfil }, { where: { idUser: id } })
        return res.status(200).json({ message: 'Usuario atualizado com sucesso.' })
    } catch (error) {
        console.error('Erro ao atualizar usuario:', error)
        return res.status(500).json({ message: 'Erro ao atualizar usuario.' })
    }}
       


    

export const removerUser = async (req, res) => {
    const id = req.params.id

    try {
        const usuario = await User.findByPk(id)

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario nao encontrado.' })
        }

        await User.destroy({ where: { idUser: id } })
        return res.status(200).json({ message: 'Usuario removido com sucesso.' })
    } catch (error) {
        console.error('Erro ao remover usuario:', error)
        return res.status(500).json({ message: 'Erro ao remover usuario.' })
    }
}


export const editarParcial = async (req, res) => {
    const id = req.params.id
    
    try {
        const usuarioNovo = {}
        const { nome, email, senha, perfil } = req.body

        if (nome) usuarioNovo.nome = nome
        if (email) usuarioNovo.email = email
        if (senha) {
            const senhaCriptografada = await bcrypt.hash(senha, 10)
            usuarioNovo.password = senhaCriptografada
            }
        const usuarioBD = await User.findOne({ where: { idUser: id } })
        if(!usuarioBD) {
            return res.status(404).json({ message: 'Usuario nao encontrado.' })
        }
        await User.update(usuarioNovo, { where: { idUser: id } })
        return res.status(200).json({ message: 'Usuario atualizado com sucesso.' })
    } catch (error) {
        console.error('Erro ao atualizar usuario:', error)
        return res.status(500).json({ message: 'Erro ao atualizar usuario.' })
    }
} 
