
const { usuarioConectado, usuarioDesconectado, getUsuarios, grabarMensaje } = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/generate-jwt");

class Sockets { 

    constructor( io ) {
        
        this.io = io;

        // Inicializar sockets events
        this.socketsEvents();
    }

    socketsEvents() {
        //On connection
        this.io.on('connection', async ( socket ) => { // identificador del cliente que se conecto, client dispositivo del que se conecto
            //console.log(socket.handshake.query['x-token']);
            const [ valido, uid ] = comprobarJWT( socket.handshake.query['x-token'] );

            if ( !valido ) {
                console.log('Socket no identificado');
                return socket.disconnet(); // desconectamos si el token no es valido o vacio
            }

            const usuario = await usuarioConectado( uid )
            console.log(`Se conecto ${ usuario.nombre } con Uid: ${uid} y ID-Socket ${ socket.id}` ); 
            // No confundir el id del usuario con el nuevo id generado por la nueva conexion del socket, 
            // cuando este se desconecta vuelve a generar un nuevo id de conexion

            //* Unir al usuario a una sala de socket.io, que perite agrupar cualquier cantidad de personas
            //* a esta sala, y permite enviar un mensaje a todos los usuarios de esa sala

            socket.join( uid ); // uid de mongo, del usuario logeado con su JWT, asi se llama la sala
                                // unir un usuario a una sala que sea igual a su uid
            // al craear una nueva conexion este socket, cliente se une a una sala de chat de nombre de su 
            // mismo uid , por lo que si se entra co otro usuario en el mismo navegador y se envia el mensaje
            // a la persona anteterio este nuevo conexion no lo vera porque este nuevo se creo una nueva
            // sala de chat con su uid.

            //TODO: Validar el JWT
            // si el token no es valido desconectar

            //TODO: Saber que usuario esta activo, mediante el uid del token



            //TODO: Emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', await getUsuarios() )


            //TODO: Socket join (unir un usuario a una sala en particular)


            //TODO: Escuchar cuando el cliente manda un mensaje
            socket.on('mensaje-personal', async ( payload ) => {
                // console.log( payload );
                const mensaje = await grabarMensaje( payload ) // ya tiene toda la informacion del mensaje guardado en la BD
                this.io.to( payload.para ).emit('mensaje-personal', mensaje );// emite ala sala que tiene ese ID
                this.io.to( payload.de ).emit('mensaje-personal', mensaje );// emite ala sala que tiene ese ID
                // con estas 2 lineas enviamos el mensaje al receptor y a su vez al que creo el mensaje, y asi 
                // se pued egraficar en el chat ya sean los mensajes que envio o recibo
                // teber cuidado porque esto puede tener un poco mas de consumo, se podria hacer un dispatch de una
                // accion donde grabemos el mesaje tmb, o hacerlo con codigo de js al momento de generar el mensaje.
            })
            //mensaje-personal, emite este evento que tiene la info para quien va el msg


            //TODO: disconect, marcar que el usuario se desconecto en la BD


            //TODO: emitir todos los usuarios conectados
            socket.on('disconnect', async () => {
                await usuarioDesconectado( uid )
                console.log('Cliente desconectado', uid);
                this.io.emit('lista-usuarios', await getUsuarios() )
                // cuando alguien se desconecta al salir del chat se emite la nueva lista de usuarios donde esta el
                // online en false esto lo recibe el front y lo renderiza en el useEffect en el componente sideBar
            })
           
        });
    }

}


module.exports = Sockets;



//* Este clase sirve para tener control absoluto de los clientes que se vayan conectando.

//? UID independientes de socket para unir a salar y manda privates messages

//* Everyone usuarios que estan  conectados tiene un id, este le ssirve para mandar mensajes privados,
//* el problema es que esete id es muy volatil, al dia de maniana cuando se refresca el navegador
//* el id cambia, por lo cual el id anteriuo no sirve para mandar mensajes privados,
//* la idea es que unamos ese socket a una sala con el mismo uid