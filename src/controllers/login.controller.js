import path from 'path'
import bcrypt from 'bcrypt'
import User from '../models/modelUSER.js'
import jwt from 'jsonwebtoken'

export const login = (req, res) => {
    return res.sendFile(path.resolve('./public/html/login.html'))
}


// Esta funcao pode ser expandida para incluir validacao de captcha, limitacao de tentativas ou autenticao multifator
export const validarLogin = async (req, res) => {
    let { email, password } = req.body
    email = email?.toLowerCase().trim()

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha sao obrigatorios.' })
    }

    if (!process.env.JWT_SECRET) {
        console.error('ERRO: JWT_SECRET não definida no ambiente.')
        return res.status(500).json({ message: 'Erro de configuração no servidor.' })
    }

    try {
        const usuario = await User.findOne({ where: { email: email } })

        if (!usuario) {
            return res.status(401).json({ message: 'Usuario nao encontrado.' })
        }

  const senhaValida = await bcrypt.compare(password, usuario.password)

if (!senhaValida) {
    return res.redirect('/login?erro=Senha invalida')
}


const token = jwt.sign(
    {
    id: usuario.idUser,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil

    },
    process.env.JWT_SECRET,
    { expiresIn: '6h',
        algorithm: 'HS256', 
        issuer: 'restaurante-api'

    }
)

res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax', // Lax costuma ser mais compatível com redirecionamentos
    maxAge: 1000 * 60 * 60 * 6
})
res.redirect('/painel')


}catch (error) {
        console.error('Erro ao validar login:', error)
        return res.status(500).json({ message: 'Erro ao validar login.' })
    }
}





export const logout = (req, res) => {
    res.clearCookie('auth_token',{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
 } )

    return res.redirect('/login')
}


export const telaRecuperarSenha = (req, res) => {
  return res.sendFile(path.resolve('./public/html/recuperar_senha.html'))
}




export const recuperarSenha = async (req, res) => {
  let { email } = req.body
  email = email?.toLowerCase().trim()

  if (!email) {
    return res.status(400).json({ message: 'Informe o e-mail.' })
  }

  const usuario = await User.findOne({ where: { email: email } })

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario nao encontrado.' })
  }

 return res.redirect(`/login/nova-senha?email=${encodeURIComponent(email)}`)
}




export const telaNovaSenha = (req, res) => {
  return res.sendFile(path.resolve('./public/html/nova_senha.html'))
}




export const salvarNovaSenha = async (req, res) => {
  let { email, password } = req.body
  email = email?.toLowerCase().trim()

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e nova senha sao obrigatorios.' })
  }

  const usuario = await User.findOne({ where: { email: email } })

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario nao encontrado.' })
  }

  const senhaCriptografada = await bcrypt.hash(password, 10)

  usuario.password = senhaCriptografada
  await usuario.save()

  return res.redirect('/login')
}
