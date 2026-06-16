import User from '../models/modelUSER.js'
import jwt from 'jsonwebtoken'


const perfils = ['administrador', 'cliente', 'funcionario', 'gerente']


export const autenticar = async (req,res,next) => {
    if(!req.cookies.auth_token) 
        return res.redirect('/login')
    
    try { const usuario = jwt.verify(req.cookies.auth_token, process.env.JWT_SECRET)
    req.user = usuario
    next()
    } catch (err) {
        console.error('Erro ao verificar token JWT:', err)
        return res.redirect('/login?erro=Token invalido')
    }
        
}



export const validarPerfil = (perfisPermitidos) => {
    return (req, res, next) => {
        const perfilUsuario = req.user?.perfil

        if (!perfilUsuario || !perfisPermitidos.includes(perfilUsuario)) {
            return res.status(403).send('Acesso negado')
        }

        next()
    }
}

export const apagarCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store', 'no-cache', 'must-revalidate', 'proxy-revalidate', 'private')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    next()
}

export const exigirBancoConectado = (req, res, next) => {
    if (req.path.startsWith('/login') || req.path.includes('.')) {
        return next()
    }

    if (req.app.locals.statusBanco?.conectado) {
        next()
    } else {
        console.error('Banco de dados não está disponível')
        res.status(503).json({
            erro: 'Banco de dados indisponível',
            mensagem: 'O serviço não está disponível no momento. Tente novamente mais tarde.'
        })
    }
}