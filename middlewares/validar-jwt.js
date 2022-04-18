const { response } = require("express")
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = (req, res = response, next) => {

    // Leer el token
    const token = req.header('x-token');

    // Si no llega token en la petición
    if (!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    // Verificar el token

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }


    
}

const validarADMIN_ROLE = async (req, res, next) => {

    // la uid viene en la request del middleware validarJWT
    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

        // si existe, y es ADMIN_role, pasa el middleware con el next()
        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }

}

const validarADMIN_ROLE_o_MismoUsuario = async (req, res, next) => {

    // la uid viene en la request del middleware validarJWT
    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE' || uid === id) {
            // si existe, y es ADMIN_role, pasa el middleware con el next(), o estoy editando mi propio perfil
            next();

        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });

        }

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }

}


module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}