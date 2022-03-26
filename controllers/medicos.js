const { request, response } = require("express")

const Medico = require('../models/medico');

const getMedicos = async (req = request, res = response) => {

    // const hospitales = await Hospital.find();
    // Para traer en el usuario, ademas del id, los campos que queramos
    const medicos = await Medico.find()
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    })

}

const crearMedico = async (req = request, res = response) => {

    const uid = req.uid;

    try {

        const medico = new Medico({
            usuario: uid,
            ...req.body
        })
    
        const medicoDB = await medico.save();
    
        res.json({
            ok: true,
            msg: medicoDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error inesperado. Hable con el administrador'
        });
    }

   

}

const actualizarMedico = async (req = request, res = response) => {


    const id = req.params.id;
    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById(id);

        if (!medicoDB){
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado con ese id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});



        res.json({
            ok: true,
            msg: 'Hospital modificado',
            medico: medicoActualizado
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

const borrarMedico = async (req = request, res = response) => {


    try {

        const id = req.params.id;
    
        const medicoDB = await Medico.findById(id); 

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con ese id'
            });
        }

        await Medico.findByIdAndDelete(id);
    
        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

    res.json({
        ok: true,
        msg: 'Borrar Medico'
    })

}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}