//Servidor de express
const express = require('express');
const { createServer } = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const Sockets = require('./sockets');
const { dbConnection } = require('../db/config');


class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        // Conectar a DB
        dbConnection();

        //  Http Server
        this.server = new createServer( this.app )

        //Configuraciones sockets
        this.io = socketio( this.server, {
            origin: "*",
            methods: ["GET", "POST"]
        } );


    }

    //Middlewares generales, antes de als rutass

    middlewares() {
        //Desplegar carpeta estatica public
        this.app.use( express.static('public') )

        //CORS (  config por defecto )
        this.app.use( cors() ); // esto solo funciona para el server

        //Parseo del body
        this.app.use( express.json() ) // serializar el json de la req a un objeto js en la respuesta
        // entiende las solicitudes entrantes de json del cliente y las convierte a objeto js para poder 
        // trabajar con estas, todas las colicitudes entrantes pasan por este midleware.

        
        // API Endpoints 
        this.app.use( '/api/login', require('../router/auth.routes') );
        this.app.use( '/api/mensajes', require('../router/mensajes.routes') );

    }

    //Configurar sockets
    configurarSockets() {
        new Sockets( this.io );
    }


    execute() {
        // Inicializar Middlewares
        this.middlewares();

        //Inicializar sockets
        this.configurarSockets();

        //Inicializar Server
        this.server.listen(this.port, () =>{
            console.log(`Server corriendo en puerto: ${ this.port }`);
        });
    }

}

module.exports = Server;

//? Middleware app.use(express.json())

//* Cuando usas app.use(express.json()), estás configurando tu aplicación Express para que, en cada 
//* solicitud entrante, analice el cuerpo de la solicitud en busca de datos JSON y los convierta en un o
//* bjeto JavaScript que estará disponible en req.body para su posterior procesamiento en tus rutas y 
//* controladores.