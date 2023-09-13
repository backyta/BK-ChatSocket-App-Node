
const { Schema, model } = require('mongoose')


const MensajeSchema = Schema({

    de: {
        type: Schema.Types.ObjectId, // Id de mongo va ser una referencia
        ref: 'Usuario',
        required: true,
    },
    para: {
        type: Schema.Types.ObjectId, // Id de mongo va ser una referencia
        ref: 'Usuario', // refercia ala misma coleccion Usuarios
        required: true,
    },
    mensaje: {
        type: String,
        required: true
    }
},{
    timestamps: true, // aniade fecha de creacion y ultima modificacion
})

// Para controlar como se serializan los docs del modelo a formato JSON, cuando se envia como respuesta
// a solicitudes HTTP

MensajeSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject(); 
    return object
});


module.exports = model('Mensaje', MensajeSchema)


//* al usar los timestamps, evitamos declaran 2 propiedades mas del modelo createdAt y updatedAt,
//* El uso de la opción timestamps: true es conveniente porque elimina la necesidad de gestionar manualmente 
//* estos campos de fecha en tus documentos