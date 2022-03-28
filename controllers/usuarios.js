const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;
    console.log(desde);

    // const usuarios = await Usuario.find();
    // const usuarios = await Usuario
    //                         .find({}, 'nombre email role google img')
    //                         .skip(desde)
    //                         .limit(5);
    // const totalRegistros = await Usuario.count();

    // para ejecutar las 2 promesas en simultaneo
    const [usuarios, totalRegistros] = await Promise.all([
        // Primera promesa en disaparse
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),
        // Segunda promesa 
        Usuario.countDocuments()
    ]).then()

    res.json({
        ok: true,
        usuarios,
        totalRegistros
    })

}

const crearUsuarios = async (req = request, res = response) => {

    const { email, password } = req.body;


    try {        
        
        // Verificamos si ya existe un usuario con el email ingresado
        const existeEmail = await Usuario.findOne({email});

        if (existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ingresado ya está registrado'
            })
        }



        const usuario = new Usuario(req.body);

        //Encriptar Password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Grabamos usuario en DB
        await usuario.save();

        // Generar Token - JWT
        const token = await generarJWT(usuario.id);
    
        res.json({
            ok: true,
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
        
    }

}

const actualizarUsuario = async (req, res = response) => {

    //TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos} = req.body;

        // Para controlar si no esta actualizando el email: (sino saltaria por el unique)
        if (usuarioDB.email!=email) {
            const existeEmail = await Usuario.findOne({email});
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        // No dejamos modificar el email, si el usuario es un usuario de google
        if (!usuarioDB.google){
            campos.email = email;
        } else if (usuarioDB.email!==email){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario de google no puede modificar su correo'
            });
        }


        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});
        
        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

        const usuario = Usuario.findById()

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarUsuario = async (req, res = response) => {


    try {

        const uid = req.params.id;
    
        const usuarioDB = await Usuario.findById(uid); 

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);
    
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }


}


module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}