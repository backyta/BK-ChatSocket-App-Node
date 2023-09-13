const jwt = require('jsonwebtoken');

// MIddleware que servira para verificar el JWT
const validarJWT = ( req, res, next ) => {

    try {
        
        const token = req.header('x-token')

        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la peticion'
            });
        }

        const { uid } = jwt.verify( token, process.env.JWT_SECRET_KEY ); // verifica el jwt
        // console.log(payload); // devuelve el uid que se uso para crear el token y las fechas de creancion

        req.uid = uid //pasamos el uid del token verificacio al req y este pasa al siguiente middlewarare

        next();
    
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg:'Token no es valido'
        })        
    }

}


module.exports = {
    validarJWT
}

//? Aqui se valida en un middleware el token que viene en las periciones HTTP, el otro de los helpers
//? es el token que viene en el query de la connexion socket