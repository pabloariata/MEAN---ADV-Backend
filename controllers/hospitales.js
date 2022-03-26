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

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB){
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado con ese id'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});



        res.json({
            ok: true,
            msg: 'Hospital modificado',
            hospital: hospitalActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
            id
        })
    }

}

const borrarHospital = async (req = request, res = response) => {

     try {

        const id = req.params.id;
    
        const hospitalDB = await Hospital.findById(id); 

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese id'
            });
        }

        await Hospital.findByIdAndDelete(id);
    
        res.json({
            ok: true,
            msg: 'Hospital eliminado'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}