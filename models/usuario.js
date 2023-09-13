
const { Schema, model } = require('mongoose')


const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    online: {
        type: Boolean,
        default: false
    }

})

// Para controlar como se serializan los documents del modelo a formato JSON, cuando se envia como respuesta
// a solicitudes HTTP

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject(); 
    object.uid = _id;
    return object
});


module.exports = model('Usuario', UsuarioSchema)

//* Cuando se guarda en la BD y al extraerlo o enviar la respuesta al cliente en JSON, extraemos lo que
//* no necesitamos y enviamos lo necesario al cliente.