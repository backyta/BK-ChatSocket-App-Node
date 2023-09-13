const Mensaje = require("../models/mensaje");


const obtenerChat = async ( req, res ) => {

    //se puede colocar un try o catch

    const miId = req.uid; // viene el uid en la req del validar jwt, que es el id del usuario con el que se logeo o creo la cuenta
    const mensajesDe = req.params.de; // extrae de los parametros el :de que es un uid

    const last30 = await Mensaje.find({
        $or: [
            { de: miId, para: mensajesDe }, // para enviar mensajes de uno a otro segun el modelo
            { de: mensajesDe, para: miId },
        ]
    })
    .sort({ createdAt: 'desc' }) // descendente, mandar men sajes ascendente el que lo recibe se va tirado el mas viejo hacia arriba
    .limit( 30 )


    res.json({
        ok:true,
        mensajes: last30
    })

}

module.exports = obtenerChat;


// Hola Fernando, te queria comentar que en la parte del backend no habia que modificar nada debido a que la 
// condicion "desc" te va a traer los ultimos 30 mensajes. Como vos lo cambiaste a "asc" te va a traer los 
// primeros 30 mensajes.

// En tu caso no te diste cuenta porque son pocos los mensajes y te los trae todos igual, la manera de 
// solventarlo es al momento de ejecutar el dispatch usar el metodo reverse de los arrays, de la siguiente 
// manera:

// dispatch( {
//     type: types.getMessages,
//     payload: res.messages.reverse()
// } );
// Y la sugerencia que queria compartir es que al momento de hacer click en el mismo usuario, no dispare una 
// nueva peticion al backend, ya que no es necesario. Si los mensajes ya estan cargados.

// Entonces, antes de hacer la peticion, encerramos la misma y la accion posterior dentro de una condicion 
// como esta:

// if( activeChat !== uid )
// Le digo si el chat que se encuentra activo es diferente al usuario en el que estoy haciendo click, haz la 
// peticion. Sino no hace nada.