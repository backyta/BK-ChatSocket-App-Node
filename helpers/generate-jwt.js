
const jwt = require('jsonwebtoken');

const generarJWT = ( uid ) => {
  
    return new Promise(( resolve, reject ) => {

        const payload = { uid: uid };
        jwt.sign( payload, process.env.JWT_SECRET_KEY,{
            expiresIn: '24h'
        }, ( err, token ) =>{
            if ( err ) {
                console.log( err );
                reject('No se puedo generar el JWT');
            }else{
                resolve( token )
            }

        })

    });
}


//* validar el token que viene del front en la conxion de socketm que se envio y saco del localstorage,
//* su token de acceso, con eso validaremos quien es corroborando en la BD.

const comprobarJWT = ( token = '' ) => {

    try {
        const { uid } = jwt.verify( token, process.env.JWT_SECRET_KEY)

        return [ true, uid ];

    } catch ( error ) {
        return [ false, null ];
    }

}


module.exports = {
    generarJWT,
    comprobarJWT
}