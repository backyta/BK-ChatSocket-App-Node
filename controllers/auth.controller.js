const { response, json } = require("express");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/generate-jwt");


const crearUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;
    try {
        
        const existeEmail = await Usuario.findOne({ email: email }) // busca la el primer registro que tenga propiedad email se igual al del body enviado
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        }

        const usuario = new Usuario( req.body );

        // Encriptar password
        const salt = bcrypt.genSaltSync();  // de manera sincrona
        usuario.password = bcrypt.hashSync( password, salt );

        // Guardar en BD 
        await usuario.save();
    
        //Generar el JWT
        const token = await generarJWT( usuario.id ) // no se recomienda grabar el token en el backend, el cliente es quien lo debe almacenar
                                                     // usuario.id extrae y pasa como parametro el id ( valor ) del objeto ID guardado en la BD mongo.
                                                     // si se coloca ._id devuelve todo el objectId

       return res.json({
            ok:true,
            usuario, // sobrescribo el metodo json para que me envie lo que necesito, esta en el modelo
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        })
    } 
}


const loginUsuario = async ( req, res ) =>{

    
    const { email, password } = req.body;
    try {
        
        const usuarioDB = await Usuario.findOne({ email: email })
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg:'Email no encontrado'
            });
        }

        //Validar el password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password ) // la contrasenia que se pasa en el req contra el el hasheado de la BD
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg:'Password no es correcto'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        })
    }

}


const renewToken = async ( req, res ) => {

    const  uid = req.uid;

    //Generar un nuevo JWT usando el uid
    const token = await generarJWT( uid );

    // Obtener el usuario por UID
    const usuario = await Usuario.findById( uid );


    res.json({
        ok: true,
        token,
        usuario
    })
}



module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}