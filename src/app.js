import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routers/views.routers.js'
import { Server } from 'socket.io'

const app = express()

//Aqui le estamos asignando un puerto que este libre en glitch, si este no asigna un puerto
//Entonces se escuchara en el servidor que le asignamos. 
const PORT = process.env.PORT || 8080

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
    console.log('Se esta escuchando en el puerto', PORT);  
})

//Server es una clase. 
//Configuramos socket con http
const socketServer = new Server(httpServer)

//Configuracion del lado del server
let messages = []
socketServer.on('connection', socket => {

    socket.on('message', message =>{
        messages.push(message)

        //Vamos a emitir el mensaje
        socketServer.emit('messagesLogs', messages)
    })

    socket.on('userConnected', data => {
        console.log(data);
        socket.broadcast.emit('userConnected', data.user)
    })

    socket.on('closeChat', data=> {
        console.log(data);
        socket.broadcast.emit('userDisconnected', data.user)
    })



    // socket.on('mensaje', data =>{
    //     console.log(data);
    // })

    // socket.emit('mensaje2', 'Hola desde el servidor')

    // socket.broadcast.emit('broadcasts', 'Este evento es para todos los sockets, menos el que emitio el mensaje')

    // socketServer.emit('evento_para_todos', 'Este evento para todos los clientes que se conecten')
})
