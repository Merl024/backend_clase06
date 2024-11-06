import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routers/views.routers.js'

// Importamos la libreria para el websockets. A esta libreria hay que 
// Pasarle las configuraciones de http, las cuales van en el app.listen
import { Server } from 'socket.io'

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//configuracion del directorio public
app.use(express.static(__dirname + '/public/'))

//Configuraciones de handlebars
app.engine('handlebars', handlebars.engine())

//Especificamos que habra una carpeta views y se dice donde va a estar
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//routers
app.use('/hbs', viewsRouter)

const httpServer = app.listen(PORT, ()=>{
    console.log('Se esta escuchando en el puerot', PORT);  
})

//Server es una clase. 
//Configuramos socket con http
const socketServer = new Server(httpServer)

/** Cuando se configura socket hay que hacerlo del lado del servidor y del cliente
 * Todo lo que son .hbs es del lado del cliente y si se hace un .log se vera 
 * en la terminal de la web.
 * 
 * Se hace la configuracion de los dos lagos para crear un cable de comunicacion, 
 * y que los dos puedan mandarse mensajes entre si.
 * 
 * Lo basico de los sockets es que uno emite y el otro lo escucha
*/

//Configuracion del lado del server
socketServer.on('connection', socket => {
    //recibe dos parametros, el mimso key que del emit y la data
    //Esto se escuchara del lado del server
    socket.on('mensaje', data =>{
        console.log(data);
    })

    socket.emit('mensaje2', 'Hola desde el servidor')

    /**Hay otra manera de recibir y mandar mensajes, eso es por medio de los 
     * broadcasts, eso sirve mas que todo cuando hay varios clientes que estan conectados
     * al mimso tiempo. 
     * 
     * La manera en como funciona es que hay varios clientes y todos lo leen, 
     * ################## MENOS el que MANDO EL MENSAJE #####################
     */

    socket.broadcast.emit('broadcasts', 'Este evento es para todos los sockets, menos el que emitio el mensaje')

    socketServer.emit('evento_para_todos', 'Este evento para todos los clientes que se conecten')
})

//Video 1. 4 H 