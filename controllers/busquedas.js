const { request, response } = require("express");

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const getTodo = async (req = request, res = response) => {

    const busqueda = req.params.busqueda;
    const regexp = new RegExp(busqueda, 'i'); // expresion regular para parte de la palabra, mayusculas y minisculas indistintas

    // const usuarios = await Usuario.find({ 
    //     nombre: regexp
    //  })

    // const hospitales = await Hospital.find({ 
    //     nombre: regexp
    //  })

    // const medicos = await Medico.find({ 
    //     nombre: regexp
    //  })

    const [usuarios, hospitales, medicos] = await Promise.all([
        Usuario.find({ 
            nombre: regexp
         }),
         Hospital.find({ 
            nombre: regexp
         }),
         Medico.find({ 
            nombre: regexp
         })
    ]);

     

    res.json({
        ok: true,
        usuarios,
        hospitales,
        medicos
    })

}

const getDocumentosColeccion = async(req = request, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regexp = new RegExp(busqueda, 'i'); // expresion regular para parte de la palabra, mayusculas y minisculas indistintas
    
    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regexp })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regexp })
                                .populate('usuario', 'nombre img')
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regexp })
            break;
    
        default:
           return res.status(400).json({
               ok: false,
               msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
           });
    }

    res.json({
        ok: true,
        resultados: data
    })

}


module.exports = {
    getTodo,
    getDocumentosColeccion
}