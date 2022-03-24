const { request, response } = require("express")

const Hospital = require('../models/hospital');

const getHospitales = async (req = request, res = response) => {

    // const hospitales = await Hospital.find();
    // Para traer en el usuario, ademas del id, los campos que queramos
    const hospitales = await Hospital.find().populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    })

}

const crearHospital = async (req = request, res = response) => {

    
    // uid del token del usuario que hace la creacion (lo seteamos en el middleware validarJWT)
    const uid = req.uid;
    
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error inesperado. Hable con el administrador'
        });
    }


}

const actualizarHospital = async (req = request, res = response) => {

    res.json({
        ok: true,
        msg: 'Actualizar Hospital'
    })

}

const borrarHospital = async (req = request, res = response) => {

    res.json({
        ok: true,
        msg: 'Borrar Hospital'
    })

}


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}