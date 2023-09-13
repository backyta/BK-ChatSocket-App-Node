//* Funciones que se van a disparar cuando algo suceda en relacion a lo sockets
//* Funciones relacionas a las acciones que disparan mis sockets

const Usuario = require("../models/usuario");
const Mensaje = require('../models/mensaje');

const usuarioConectado = async ( uid ) => {

    const usuario = await Usuario.findById( uid ); // buscamos en la base de datos y modificamos la propiedad
    usuario.online = true

    await usuario.save(); // volvemos a guardar en BD modifcado el online
    return usuario;
}

const usuarioDesconectado = async ( uid ) =>{
    const usuario = await Usuario.findById( uid ); // buscamos en la base de datos y modificamos la propiedad
    usuario.online = false

    await usuario.save(); // volvemos a guardar en BD modifcado el online
    return usuario;
}


const getUsuarios = async () => {

    const usuarios = await Usuario
        .find() // traer todos los usuarios de la BD
        .sort('-online') // primeros lo que esten online y luego el resto

    return usuarios;

} 

const grabarMensaje = async ( payload ) => {

    try {

        const mensaje = new Mensaje( payload );
        await mensaje.save();

        return mensaje;
        
    } catch (error) {
        console.log(error);
        return false;
    }

}



module.exports = {
    getUsuarios,
    usuarioConectado,
    usuarioDesconectado,
    grabarMensaje,
}