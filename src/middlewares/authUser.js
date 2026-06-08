import User from '../models/modelUSER.js'


const perfils = ['administrador', 'cliente', 'funcionario', 'gerente']


export const autenticar = async (req,res,next) => {
    if (!req.session.userId) 
        return res.redirect('/login')

        const user = await User.findByPk(req.session.userId.id)
        if (!user) {
            return res.redirect('/login')
        }
        req.user = user
        next()
}

export const validarPerfil = (perfisPermitidos) => {
    return (req, res, next) => {
        const perfilUsuario = req.session.userId?.perfil

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